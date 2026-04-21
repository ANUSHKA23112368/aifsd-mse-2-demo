import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const createToken = (studentId) =>
  jwt.sign({ id: studentId }, process.env.JWT_SECRET, { expiresIn: "1d" });

const buildStudentPayload = (student) => ({
  id: student._id,
  name: student.name,
  email: student.email,
  course: student.course,
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, course } = req.body;

    if (!name || !email || !password || !course) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingStudent = await Student.findOne({ email: email.toLowerCase() });

    if (existingStudent) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      course,
    });

    return res.status(201).json({
      message: "Student registered successfully.",
      token: createToken(student._id),
      student: buildStudentPayload(student),
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed.", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const student = await Student.findOne({ email: email.toLowerCase() }).select("+password");

    if (!student) {
      return res.status(401).json({ message: "Invalid login credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid login credentials." });
    }

    return res.status(200).json({
      message: "Login successful.",
      token: createToken(student._id),
      student: buildStudentPayload(student),
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed.", error: error.message });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
  return res.status(200).json({ student: buildStudentPayload(req.student) });
});

router.put("/update-password", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old password and new password are required." });
    }

    const student = await Student.findById(req.student._id).select("+password");

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, student.password);

    if (!isOldPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    student.password = await bcrypt.hash(newPassword, 10);
    await student.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Password update failed.", error: error.message });
  }
});

router.put("/update-course", authMiddleware, async (req, res) => {
  try {
    const { course } = req.body;

    if (!course) {
      return res.status(400).json({ message: "Course is required." });
    }

    const student = await Student.findByIdAndUpdate(
      req.student._id,
      { course },
      { new: true, runValidators: true }
    ).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    return res.status(200).json({
      message: "Course updated successfully.",
      student: buildStudentPayload(student),
    });
  } catch (error) {
    return res.status(500).json({ message: "Course update failed.", error: error.message });
  }
});

export default router;
