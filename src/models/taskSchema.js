import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Deadline: { type: Date, required: true },
  Status: { type: Boolean, default: false },
  addInfo: { type: String, default: "nothing" },
  createdAt: { type: Date, default: Date.now },
  email: { type: String, required: true },
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
