import express from "express"; // if using ES Modules (or use require() with CommonJS)
import { configDotenv } from "dotenv";
import cors from 'cors';
import allRoutes from "./routes/index.js";
import {connectDB} from "./config/connectDB.js";

configDotenv();

connectDB();

const app = express();
const PORT = process.env.PORT;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json());

app.use("/api", allRoutes)

// simple route
app.get("/", (req, res) => {
  res.send("Server running");
});

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

export default app
