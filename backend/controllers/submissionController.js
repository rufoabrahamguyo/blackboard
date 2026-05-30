import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";
import Student from "../models/Student.js";

const ensureEnrolled = async (studentId, courseId) => {
  const student = await Student.findById(studentId);
  if (!student) return { error: "Student not found", status: 404 };
  const enrolled = student.enrollments.some(
    (e) => e.course.toString() === courseId.toString() && e.status === "active"
  );
  if (!enrolled) return { error: "Not enrolled in this course", status: 400 };
  return { student };
};

export const getSubmissionsByAssignment = async (req, res) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.assignmentId })
      .populate("student", "firstName lastName email schoolID")
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitAssignment = async (req, res) => {
  try {
    const { studentId, content } = req.body;
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const check = await ensureEnrolled(studentId, assignment.course);
    if (check.error) return res.status(check.status).json({ message: check.error });

    let submission = await Submission.findOne({
      assignment: assignment._id,
      student: studentId,
    });

    if (submission && submission.status !== "draft") {
      return res.status(400).json({ message: "Assignment already submitted" });
    }

    if (!submission) {
      submission = new Submission({ assignment: assignment._id, student: studentId });
    }

    submission.content = content || "";
    submission.status = "submitted";
    submission.submittedAt = new Date();
    await submission.save();

    const populated = await Submission.findById(submission._id).populate(
      "student",
      "firstName lastName email"
    );
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const gradeSubmission = async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: "Submission not found" });

    const assignment = await Assignment.findById(submission.assignment);
    if (score > assignment.points) {
      return res.status(400).json({ message: `Score cannot exceed ${assignment.points} points` });
    }

    submission.score = score;
    submission.feedback = feedback || "";
    submission.status = "graded";
    await submission.save();

    const populated = await Submission.findById(submission._id)
      .populate("student", "firstName lastName email schoolID")
      .populate("assignment", "title points");
    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getStudentGrades = async (req, res) => {
  try {
    const submissions = await Submission.find({
      student: req.params.studentId,
      status: "graded",
    }).populate({
      path: "assignment",
      select: "title points dueDate",
      populate: { path: "course", select: "title code color" },
    });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
