import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import StudentRoutes from "./routes/StudentRoutes.js";
import grievanceRoutes from "./routes/grievanceRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

app.use("/api", StudentRoutes);
app.use("/api/grievance", grievanceRoutes);

// Start server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("DB error:", err.message);
  });