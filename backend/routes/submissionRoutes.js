import express from "express";
import { gradeSubmission, getStudentGrades } from "../controllers/submissionController.js";

const router = express.Router();

router.get("/student/:studentId/grades", getStudentGrades);
router.put("/:id/grade", gradeSubmission);

export default router;
