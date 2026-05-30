import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    instructions: { type: String, default: "" },
    dueDate: { type: Date, required: true },
    points: { type: Number, required: true, min: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);
