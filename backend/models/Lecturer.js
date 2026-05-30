import mongoose from "mongoose";

const lecturerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  course: { type: String, required: true },
});

export default mongoose.model("Lecturer", lecturerSchema);
