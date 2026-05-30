import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import Course from "../models/Course.js";
import Student from "../models/Student.js";

export const getAssignmentsByCourse = async (req, res) => {
  try {
    const filter = { course: req.params.courseId };
    if (req.query.published === "true") filter.published = true;

    const assignments = await Assignment.find(filter).sort({ dueDate: 1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const assignment = new Assignment({ ...req.body, course: req.params.courseId });
    const saved = await assignment.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    res.json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    await Submission.deleteMany({ assignment: req.params.id });
    res.json({ message: "Assignment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentAssignments = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const courseIds = student.enrollments
      .filter((e) => e.status === "active")
      .map((e) => e.course);

    const assignments = await Assignment.find({
      course: { $in: courseIds },
      published: true,
    })
      .populate("course", "title code color")
      .sort({ dueDate: 1 });

    const submissions = await Submission.find({
      student: studentId,
      assignment: { $in: assignments.map((a) => a._id) },
    });

    const withStatus = assignments.map((a) => {
      const sub = submissions.find((s) => s.assignment.toString() === a._id.toString());
      return {
        ...a.toObject(),
        submission: sub || null,
        isOverdue: new Date() > new Date(a.dueDate) && (!sub || sub.status === "draft"),
      };
    });

    res.json(withStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
