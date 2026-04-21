import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import studentRoutes from "./routes/studentRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS."));
    },
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Student Authentication API is running." });
});

app.use("/api", studentRoutes);

app.use((error, req, res, next) => {
  if (error.message === "Origin not allowed by CORS.") {
    return res.status(403).json({ message: error.message });
  }

  return res.status(500).json({ message: "Internal server error." });
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}.`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
  });
