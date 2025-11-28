import { Hono } from 'hono';
import { MongoClient } from 'mongodb';
import allRoutes from './routes/index.js';
import dotenv from 'dotenv';
dotenv.config();
// 🔥 reCAPTCHA verification
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


const app = new Hono();
const MONGO_URI = process.env.MONGO_URI; // ✅ replace with your MongoDB connection string

const client = new MongoClient(MONGO_URI);
await client.connect();
const db = client.db('bim_service');

// ✅ attach db to all requests (taake routes me use ho sake)
app.use('*', async (c, next) => {
  c.env = { DB: db };
  c.res.headers.set('Access-Control-Allow-Origin', '*');
  c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (c.req.method === 'OPTIONS') return c.text('OK', 200);
  await next();
});
console.log(`Server is Running on http://localhost:${process.env.PORT || 3000}`);

// ✅ root route
app.get('/', (c) => c.text('✅ Server running on Cloudflare Workers!'));
app.get('/health', (c) => c.json({ status: 'OK' }));
// ======================================
//  CONTACT FORM API (with reCAPTCHA)
// ======================================
app.post('/api/contact', async (c) => {
  try {
    const body = await c.req.json();

    const { name, email, phone, message, captchaToken } = body;

    // 1️⃣ Validate CAPTCHA
    const human = await verifyCaptcha(captchaToken);

    if (!human) {
      return c.json({ error: "Captcha failed. Try again." }, 400);
    }

    // 2️⃣ Basic validation
    if (!name || !email || !message) {
      return c.json({ error: "Missing required fields." }, 400);
    }

    // 3️⃣ No DB write — Just return OK
    return c.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return c.json({ error: "Server error" }, 500);
  }
});


// ✅ use all routes
app.route('/api', allRoutes);


export default app;
