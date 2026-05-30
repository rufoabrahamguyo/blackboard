import Lecturer from "../models/Lecturer.js";

// GET all lecturers
export const getLecturers = async (req, res) => {
  try {
    const lecturers = await Lecturer.find();
    res.json(lecturers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET lecturer by ID
export const getLecturerById = async (req, res) => {
  try {
    const lecturer = await Lecturer.findById(req.params.id);
    if (!lecturer) return res.status(404).json({ message: "Lecturer not found" });
    res.json(lecturer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create new lecturer
export const createLecturer = async (req, res) => {
  try {
    const lecturer = new Lecturer(req.body);
    const saved = await lecturer.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT update lecturer
export const updateLecturer = async (req, res) => {
  try {
    const updated = await Lecturer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE lecturer
export const deleteLecturer = async (req, res) => {
  try {
    await Lecturer.findByIdAndDelete(req.params.id);
    res.json({ message: "Lecturer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
