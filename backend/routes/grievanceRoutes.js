import express from "express";
import Grievance from "../models/Grievance.js";

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  const data = await Grievance.create(req.body);
  res.json(data);
});

// GET ALL
router.get("/", async (req, res) => {
  const data = await Grievance.find();
  res.json(data);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const data = await Grievance.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(data);
});

export default router;