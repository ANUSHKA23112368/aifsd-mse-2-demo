import mongoose from "mongoose";

const grievanceSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.model("Grievance", grievanceSchema);