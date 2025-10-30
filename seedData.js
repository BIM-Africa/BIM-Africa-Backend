import mongoose from "mongoose";
import dotenv from "dotenv";
import Blog from "./models/blogs.js"; // adjust the path to your Blog model

dotenv.config(); // for MongoDB URI from .env

const seedBlogs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    // Sample Data (removed _id)
    const blogs = [
      {
        img: "https://images.unsplash.com/photo-1660644807804-ffacfd7a4137?crop=entr…",
        tag: "Cybersecurity",
        date: "Dec 15, 2024",
        read: "8 min read",
        views: "2.4k",
        title: "The Future of Cybersecurity: AI-Powered Threat Detection in 2024",
        desc: "Discover how artificial intelligence is revolutionizing cybersecurity …",
        extraDesc: "asdorjnmkaxasxasjxbasjxbasxjhasxjkxkxasxasxasxuxasx",
        author: "Sarah Mitchell",
        isFeature: true,
      },
      {
        img: "https://images.unsplash.com/photo-1606836591695-4d58a73eba1e?crop=entr…",
        tag: "Web Development",
        date: "Dec 12, 2024",
        read: "6 min read",
        views: "1.8k",
        title: "Building Scalable Web Applications with Modern React Architecture",
        desc: "Learn the best practices for developing high-performance React applica…",
        extraDesc: "sdfghjskadasdadasd",
        author: "Marcus Johnson",
      },
      {
        img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?crop=entr…",
        tag: "Mobile Apps",
        date: "Dec 10, 2024",
        read: "5 min read",
        views: "1.2k",
        title: "Mobile-First Design: Creating Apps That Users Love",
        desc: "Explore the principles of mobile-first design and how to create intuit…",
        extraDesc: "sadasdadasdasdasd",
        author: "Elena Rodriguez",
      },
      {
        img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=form…",
        tag: "Case Studies",
        date: "Dec 08, 2024",
        read: "12 min read",
        views: "956",
        title: "Digital Transformation Success Stories: Lessons from Luxembourg",
        desc: "Case study showcasing how European businesses transformed their operat…",
        extraDesc: "asdasdasdasdasdasdasd",
        author: "David Chen",
      },
      {
        img: "https://images.unsplash.com/photo-1758523670550-223a01cd7764?crop=entr…",
        tag: "Web Development",
        date: "Dec 05, 2024",
        read: "10 min read",
        views: "1.5k",
        title: "Progressive Web Apps: Bridging the Gap Between Web and Mobile",
        desc: "Understand how PWAs are changing the digital landscape — and why they …",
        extraDesc: "asdadasdkasdjaslasxiasnxiasnxioxn",
        author: "Alex Thompson",
        isFeature: false,
      },
      {
        img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=form…",
        tag: "Digital Strategy",
        date: "Dec 03, 2024",
        read: "9 min read",
        views: "2.1k",
        title: "The Rise of Low-Code Solutions in Enterprise Development",
        desc: "Discover how low-code platforms accelerate development cycles and demo…",
        extraDesc: "asdasdasdasdasdasd",
        author: "Rachel Kim",
      },
      {
        img: "https://res.cloudinary.com/dy1lbmx8i/image/upload/v1761488896/wzppvea5…",
        tag: "Travel & Tour",
        date: "Dec 05, 2024",
        read: "10 min read",
        views: "3k",
        title: "Travel &Tour",
        desc: "fjsdklfjsdklfjlsdjfklsdjflsdjlfjsdklfjsdlfjsdlj",
        extraDesc:
          "kljsdlfjkljjjjjjjjjjjjjjjjjjjjjjjjjjjjjoosdjfejfsdfrifsdfiueirweiruwur…",
        author: "Alex Thompson",
        isFeature: false,
      },
    ];

    // Clear previous data (optional)
    await Blog.deleteMany();
    console.log("🧹 Old blogs removed");

    // Insert new data
    await Blog.insertMany(blogs);
    console.log("✅ Blog data seeded successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    mongoose.connection.close();
  }
};

seedBlogs();