import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
import userRoute from './routes/users.route.js'
import connectDB from "../db/db.js";


const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/v1/",userRoute);

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Server is running" });
});

connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
