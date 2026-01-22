import express from "express";
import cors from "cors";
import allRoutes from "./routes/index.js";
import { connectDB } from "./config/connectDB.js";
// import { verifyCaptcha } from "./utils/verifyCaptcha.js"; // if you have it

const app = express();

app.use(cors());
app.use(express.json()); // ✅ important

connectDB();

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ Server running!");
});

app.use("/api", allRoutes);

// ✅ CONTACT Endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message, captchaToken } = req.body;

    // ✅ If captcha is optional temporarily:
    // const human = await verifyCaptcha(captchaToken);
    // if (!human) return res.status(400).json({ error: "Captcha failed" });

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ✅ Only listen in local dev (prevents serverless crash)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
