import admin from "../models/admin.js";
import Blog from "../models/blogs.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const isBcryptHash = (value) => /^\$2[aby]\$\d{2}\$/.test(String(value || ""));
function makeSlug(title) {
  return String(title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Slug is unique in the DB, so append -2, -3... when a title repeats
async function uniqueSlug(title, excludeId) {
  const base = makeSlug(title) || "blog";
  let slug = base;
  let n = 2;
  while (await Blog.exists({ slug, ...(excludeId && { _id: { $ne: excludeId } }) })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

// Tell the Next.js frontend to rebuild its static blog pages + sitemap.
// Needs FRONTEND_URL and REVALIDATE_SECRET (same value as on the frontend).
async function revalidateFrontend(slugs = []) {
  const base = process.env.FRONTEND_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!base || !secret) return;
  try {
    const res = await fetch(`${base.replace(/\/+$/, "")}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-revalidate-secret": secret },
      body: JSON.stringify({ slugs: slugs.filter(Boolean) }),
    });
    if (!res.ok) console.error("Frontend revalidate failed:", res.status);
  } catch (err) {
    console.error("Frontend revalidate error:", err.message);
  }
}

// GET /api/blogs with pagination
export const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments();
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      blogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalBlogs: total,
        limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/blog/:id - Get single blog
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    return res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/blogs
export const addBlog = async (req, res) => {
  try {
    if (!req.body.title || !String(req.body.title).trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const slug = await uniqueSlug(req.body.title);

    const newBlog = new Blog({
      ...req.body,
      slug, // 👈 yahan slug add ho gaya
    });

    const saved = await newBlog.save();
    await revalidateFrontend([saved.slug]);
    return res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create blog",
      error: error.message,
    });
  }
};


// DELETE /api/blogs/:id
export const deleteBlog = async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Blog not found" });
    await revalidateFrontend([deleted.slug]);
    return res.status(200).json({ message: "Blog deleted", deleted });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete blog", error: error.message });
  }
};

// PUT /api/blogs/:id
export const updateBlog = async (req, res) => {
  try {
    // Keep existing slugs stable (URLs), but give old slug-less blogs one
    const { slug: _ignored, ...data } = req.body;
    const existing = await Blog.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Blog not found" });
    if (!existing.slug) {
      data.slug = await uniqueSlug(data.title || existing.title, existing._id);
    }

    const updated = await Blog.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Blog not found" });
    await revalidateFrontend([updated.slug]);
    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update blog", error: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { _id: _ignored, ...data } = req.body;
    if (data.password) data.password = await bcrypt.hash(String(data.password), 10);
    const updated = await admin.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!updated) return res.status(404).json({ message: "Admin not found" });
    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update admin", error: error.message });
  }
};

export const getAdmin = async (req, res) => {
  try {
    const adminUpdate = await admin.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json(adminUpdate);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const found = await admin.findOne({ email });
    if (!found) return res.status(404).json({ message: "Admin not found" });
    if (!password) return res.status(401).json({ message: "Incorrect password" });

    // Old accounts were saved in plain text: accept once, then store a bcrypt hash
    let ok;
    if (isBcryptHash(found.password)) {
      ok = await bcrypt.compare(String(password), found.password);
    } else {
      ok = found.password === password;
      if (ok) {
        found.password = await bcrypt.hash(String(password), 10);
        await found.save();
      }
    }
    if (!ok) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: found._id, email: found.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(200).json({
      message: "Login successful",
      data: {
        name: found.name,
        email: found.email
      },
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};