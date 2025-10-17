import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import userRoute from './routes/users.route.js';
import connectDB from "../db/db.js";
import redisClient from "../db/redisClient.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/v1/", userRoute);

// Connect MongoDB
connectDB();

// Connect Redis
try {
  await redisClient.connect();
  console.log("Redis connected successfully");
} catch (err) {
  console.log("Redis connection failed, continuing without cache.", err);
}


// Test Redis route
app.get("/test-redis", async (req, res) => {
  try {
    await redisClient.setEx("test_key", 60, "hello redis");
    const value = await redisClient.get("test_key");

    res.json({ message: "Redis is working!", value });
  } catch (err) {
    res.status(500).json({ message: "Redis not working", error: err.message });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
