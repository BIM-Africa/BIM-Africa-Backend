import slugify from "slugify";

export const createBlog = async (req, res) => {
  try {
    // 🔥 AUTO SLUG GENERATION (MANDATORY)
    if (!req.body.slug || req.body.slug.trim() === "") {
      req.body.slug = slugify(req.body.title, {
        lower: true,
        strict: true,
      });
    }

    const blog = new Blog(req.body);
    await blog.save();

    res.status(201).json({ blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
