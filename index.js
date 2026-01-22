// ✅ Node.js (Express) + MongoDB (corrected version)
import allRoutes from './routes/index.js'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/connectDB.js'

const app = express()

// ✅ DB connect
connectDB()

// ✅ Middlewares (IMPORTANT)
app.use(cors())
app.use(express.json())

// ✅ Simple root route (Express syntax FIXED)
app.get('/', (req, res) => {
  res.send('✅ Server running correctly')
})

app.use("/api", allRoutes)

// ✅ CONTACT Endpoint (tumhara hi logic)
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message, captchaToken } = req.body

    // ⚠️ verifyCaptcha tab hi chalay ga jab function defined/import ho
    // const human = await verifyCaptcha(captchaToken)
    // if (!human) {
    //   return res.status(400).json({ error: "Captcha failed. Try again." })
    // }

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields." })
    }

    return res.json({ success: true })
  } catch (err) {
    console.error("Contact API error:", err)
    return res.status(500).json({ error: "Server error" })
  }
})

// ❌ app.listen mat lagana (Vercel crash karega)
export default app
