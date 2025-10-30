import { Router } from "express";
import { addBlog, deleteBlog, getAdmin, getBlogById, getBlogs, loginAdmin, updateAdmin, updateBlog } from "../controllers/admin.controller.js";

const router = Router();


router.get("/blogs", getBlogs);
router.get("/blog/:id", getBlogById); // Add this line
router.post("/blog", addBlog);
router.put("/blog/:id", updateBlog);
router.delete("/blog/:id", deleteBlog);
router.put("/admin/:id", updateAdmin);
router.get("/admin", getAdmin);
router.post("/login", loginAdmin);



export default router;