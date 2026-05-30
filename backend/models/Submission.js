import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    content: { type: String, default: "" },
    submittedAt: { type: Date },
    score: { type: Number, min: 0 },
    feedback: { type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "submitted", "graded"],
      default: "draft",
    },
  },
  { timestamps: true }
);

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export default mongoose.model("Submission", submissionSchema);
