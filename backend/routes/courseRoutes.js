import express from "express";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollStudent,
  unenrollStudent,
  getCourseStudents,
  getGradebook,
} from "../controllers/courseController.js";

const router = express.Router();

router.get("/", getCourses);
router.post("/", createCourse);
router.get("/:id", getCourseById);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);
router.post("/:id/enroll", enrollStudent);
router.delete("/:id/enroll/:studentId", unenrollStudent);
router.get("/:id/students", getCourseStudents);
router.get("/:id/gradebook", getGradebook);

export default router;
