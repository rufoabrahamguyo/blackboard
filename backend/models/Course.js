import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    term: { type: String, default: "Fall 2026" },
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecturer",
      required: true,
    },
    color: { type: String, default: "#1e4d8c" },
    syllabus: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
