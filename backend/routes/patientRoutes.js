import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Patient from "../models/Patient.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { JWT_SECRET } from "../config/auth.js";

const router = express.Router();

const createToken = (patientId) =>
  jwt.sign({ id: patientId }, JWT_SECRET, { expiresIn: "1d" });

const buildPatientPayload = (patient) => ({
  id: patient._id,
  name: patient.name,
  email: patient.email,
  condition: patient.condition,
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, condition } = req.body;

    if (!name || !email || !password || !condition) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingPatient = await Patient.findOne({ email: email.toLowerCase() });

    if (existingPatient) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = await Patient.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      condition,
    });

    return res.status(201).json({
      message: "Patient registered successfully.",
      token: createToken(patient._id),
      patient: buildPatientPayload(patient),
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

    const patient = await Patient.findOne({ email: email.toLowerCase() }).select("+password");

    if (!patient) {
      return res.status(401).json({ message: "Invalid login credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, patient.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid login credentials." });
    }

    return res.status(200).json({
      message: "Login successful.",
      token: createToken(patient._id),
      patient: buildPatientPayload(patient),
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed.", error: error.message });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
  return res.status(200).json({ patient: buildPatientPayload(req.patient) });
});

router.put("/update-password", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old password and new password are required." });
    }

    const patient = await Patient.findById(req.patient._id).select("+password");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, patient.password);

    if (!isOldPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    patient.password = await bcrypt.hash(newPassword, 10);
    await patient.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Password update failed.", error: error.message });
  }
});

router.put("/update-condition", authMiddleware, async (req, res) => {
  try {
    const { condition } = req.body;

    if (!condition) {
      return res.status(400).json({ message: "Condition is required." });
    }

    const patient = await Patient.findByIdAndUpdate(
      req.patient._id,
      { condition },
      { new: true, runValidators: true }
    ).select("-password");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    return res.status(200).json({
      message: "Condition updated successfully.",
      patient: buildPatientPayload(patient),
    });
  } catch (error) {
    return res.status(500).json({ message: "Condition update failed.", error: error.message });
  }
});

export default router;
