// One-off: give a slug to every blog that was saved without one.
// Run: node fixSlugs.mjs   (needs MONGO_URI in .env)
import mongoose from "mongoose";
import dotenv from "dotenv";
import Blog from "./models/blogs.js";
dotenv.config();

const makeSlug = (title) =>
  String(title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "blog";

await mongoose.connect(process.env.MONGO_URI);

const missing = await Blog.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }] });
console.log(`Blogs without slug: ${missing.length}`);

for (const blog of missing) {
  const base = makeSlug(blog.title);
  let slug = base;
  let n = 2;
  while (await Blog.exists({ slug, _id: { $ne: blog._id } })) slug = `${base}-${n++}`;
  await Blog.updateOne({ _id: blog._id }, { $set: { slug } });
  console.log(`  ${blog._id} -> ${slug}`);
}

await mongoose.disconnect();
