import mongoose from "mongoose";
import dotenv from "dotenv";
import Blog from "./models/blogs.js";
import connectDB from "./config/connectDB.js";

dotenv.config();

function makeSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

await connectDB();

const blogs = await Blog.find({
  $or: [{ slug: { $exists: false } }, { slug: "" }],
});

for (const blog of blogs) {
  blog.slug = makeSlug(blog.title);
  await blog.save();
}

console.log("✅ Slugs generated for old blogs");
process.exit();
