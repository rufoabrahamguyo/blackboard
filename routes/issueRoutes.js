import express from "express";
import {
  getIssues,
  getIssueById,
  createIssue,
  getStudentIssues,
  updateIssueStatus,
  updateIssue,
  deleteIssue
} from "../controllers/issueController.js";

const router = express.Router();

// GET all issues (with optional query params: ?studentId=xxx&lecturerId=xxx&status=pending)
router.get("/", getIssues);

// GET issue by ID
router.get("/:issueId", getIssueById);

// GET all issues for a specific student
router.get("/student/:studentId", getStudentIssues);

// POST create new issue
router.post("/", createIssue);

// PUT update issue status (for lecturer/admin)
router.put("/:issueId/status", updateIssueStatus);

// PUT update issue (for student)
router.put("/:issueId", updateIssue);

// DELETE issue
router.delete("/:issueId", deleteIssue);

export default router;

