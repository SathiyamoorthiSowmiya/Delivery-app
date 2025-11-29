// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
connectDB();

const app = express();

/* ✅ CORS SETUP (IMPORTANT FOR NETLIFY) */
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local frontend (Vite)
      "http://localhost:3000", // sometimes React dev
      "https://animated-mandazi-42bacc.netlify.app", // ✅ your Netlify site
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

/* 🔑 ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

/* ✅ TEST ROUTE */
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

/* ✅ RENDER NEEDS process.env.PORT */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
