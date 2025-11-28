import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import allRoutes from "./routes/index.js";
import { connectDB } from "./config/connectDB.js";
import fetch from "node-fetch";

configDotenv();
connectDB();

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use("/api", allRoutes);

// reCAPTCHA verify function
const verifyCaptcha = async (token) => {
  try {
    const secret = process.env.RECAPTCHA_SECRET;

    const res = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
      { method: "POST" }
    );

    const data = await res.json();
    return data.success === true && data.score >= 0.3;
  } catch (err) {
    console.error("Captcha verify error:", err);
    return false;
  }
};

// CONTACT Endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message, captchaToken } = req.body;

    const human = await verifyCaptcha(captchaToken);
    if (!human) {
      return res.status(400).json({ error: "Captcha failed. Try again." });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

export default app
