import { Router } from "express";
import Blog from "../models/blogs.js";
import {
  addBlog,
  deleteBlog,
  getAdmin,
  getBlogById,
  getBlogs,
  loginAdmin,
  updateAdmin,
  updateBlog
} from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// --------------------
// BLOG ROUTES
// --------------------
router.get("/blogs", getBlogs);

// ✅ SLUG ROUTE — MUST BE ABOVE ID ROUTE
router.get("/blog/slug/:slug", async (req, res) => {
  try {
    const slug = String(req.params.slug || "").trim().toLowerCase();
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ ID ROUTE — BELOW
router.get("/blog/:id", getBlogById);

// Writes are admin-only
router.post("/blog", requireAdmin, addBlog);
router.put("/blog/:id", requireAdmin, updateBlog);
router.delete("/blog/:id", requireAdmin, deleteBlog);

// --------------------
// ADMIN
// --------------------
router.put("/admin/:id", requireAdmin, updateAdmin);
router.get("/admin", requireAdmin, getAdmin);
router.post("/login", loginAdmin);

export default router;
