import Announcement from "../models/Announcement.js";
import Course from "../models/Course.js";

export const getAnnouncementsByCourse = async (req, res) => {
  try {
    const announcements = await Announcement.find({ course: req.params.courseId })
      .populate("author", "name email")
      .sort({ pinned: -1, createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const announcement = new Announcement({
      ...req.body,
      course: req.params.courseId,
      author: req.body.author || course.lecturer,
    });

    const saved = await announcement.save();
    const populated = await Announcement.findById(saved._id).populate("author", "name email");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Announcement deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
