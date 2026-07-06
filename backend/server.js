import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import expertRoutes from "./routes/expertRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import contractRoutes from "./routes/contractRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // Your Vercel URL
].filter(Boolean); // removes undefined if FRONTEND_URL isn't set yet

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || (origin && (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/expert", expertRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/contracts", contractRoutes);

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));