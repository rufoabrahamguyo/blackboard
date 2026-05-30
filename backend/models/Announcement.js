import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecturer",
      required: true,
    },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
