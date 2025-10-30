import mongoose from "mongoose";
import Admin from "./models/admin.js"; // use capitalized model name by convention
import dotenv from "dotenv";
dotenv.config();

const addAdmin = async () => {
  try {
    // 1. Connect to MongoDB first
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // 2. Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "admin@bimafrica.com" });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      return;
    }

    // 3. Create a new admin
    const newAdmin = new Admin({
      name: "BIM Africa's Admin",
      email: "admin@bimafrica.com",
      password: "admin123", // optionally hash this
    });

    // 4. Save admin
    await newAdmin.save();
    console.log("✅ Admin created successfully");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    // 5. Close the connection
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

addAdmin();
