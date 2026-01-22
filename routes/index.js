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

const router = Router();

// --------------------
// BLOG ROUTES
// --------------------
router.get("/blogs", getBlogs);

// ✅ SLUG ROUTE — MUST BE ABOVE ID ROUTE
router.get("/blog/slug/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
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

router.post("/blog", addBlog);
router.put("/blog/:id", updateBlog);
router.delete("/blog/:id", deleteBlog);

// --------------------
// ADMIN
// --------------------
router.put("/admin/:id", updateAdmin);
router.get("/admin", getAdmin);
router.post("/login", loginAdmin);

export default router;
