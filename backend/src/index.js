import cluster from "cluster";
import os from "os";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import userRoute from './routes/users.route.js';
import connectDB from "../db/db.js";
import redisClient from "../db/redisClient.js";

const PORT=process.env.PORT||8000;

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Primary ${process.pid} is running`);
  console.log(`Forking ${numCPUs} workers...\n`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new one...`);
    cluster.fork();
  });
} else {
  // Worker process: start server
  const app = express();
  app.use(cors({ origin: ["https://interactive-user-relationship-hobby.vercel.app","http://localhost:5173"], credentials: true }));
  app.use(express.json());
  app.use("/api/v1/", userRoute);

  connectDB();

  (async () => {
    try {
      await redisClient.connect();
      console.log(`Redis connected successfully (Worker ${process.pid})`);
    } catch (err) {
      console.log(`Redis connection failed (Worker ${process.pid})`, err);
    }
  })();

  

  app.get("/test-redis", async (req, res) => {
    try {
      await redisClient.setEx("test_key", 60, "hello redis");
      const value = await redisClient.get("test_key");
      res.json({ message: "Redis is working!", value });
    } catch (err) {
      res.status(500).json({ message: "Redis not working", error: err.message });
    }
  });

  app.listen(PORT, () => console.log(`Worker ${process.pid} running on port ${PORT}`));
}
