import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  schoolID: { type: Number, required: true, unique: true },
  major: { type: String, required: true },
  currentYear: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  selections: {
    type: [
      {
        lecturer: { type: mongoose.Schema.Types.ObjectId, ref: "Lecturer", required: true },
        marks: Number,
      },
    ],
    validate: (v) => v.length <= 5,
  },
  enrollments: {
    type: [
      {
        course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
        enrolledAt: { type: Date, default: Date.now },
        status: { type: String, enum: ["active", "dropped"], default: "active" },
      },
    ],
    validate: (v) => v.length <= 8,
  },
});

export default mongoose.model("Student", studentSchema);
