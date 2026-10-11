import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        img: {
            type: String,
            required: true,
        },
        tag: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        read: {
            type: String,
            required: true,
        },
        views: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        desc: {
            type: String,
            required: true,
        },
        extraDesc: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true,
        },
        role: {
            type: String,
        },
        // Comma separated, used for the <meta name="keywords"> on the blog page
        keywords: {
            type: String,
            default: "",
        },
        isFeature: {
            type: Boolean,
            default: false
        },
        slug:{
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim: true
        },
    },
    { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
