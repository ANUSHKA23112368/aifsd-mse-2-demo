import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import { JWT_SECRET } from "../config/auth.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized access. Token missing." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const Student = await Student.findById(decoded.id).select("-password");

    if (!Student) {
      return res.status(401).json({ message: "Unauthorized access. User not found." });
    }

    req.Student = Student;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized access. Invalid token." });
  }
};

export default authMiddleware;
