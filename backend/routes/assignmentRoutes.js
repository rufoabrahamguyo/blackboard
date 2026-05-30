import express from "express";
import {
  getAssignmentsByCourse,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getStudentAssignments,
} from "../controllers/assignmentController.js";
import {
  getSubmissionsByAssignment,
  submitAssignment,
  gradeSubmission,
  getStudentGrades,
} from "../controllers/submissionController.js";

const router = express.Router();

router.get("/student/:studentId", getStudentAssignments);
router.get("/:assignmentId/submissions", getSubmissionsByAssignment);
router.post("/:assignmentId/submissions", submitAssignment);

router.get("/course/:courseId", getAssignmentsByCourse);
router.post("/course/:courseId", createAssignment);
router.put("/:id", updateAssignment);
router.delete("/:id", deleteAssignment);

export default router;
