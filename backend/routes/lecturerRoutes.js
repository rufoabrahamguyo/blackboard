import express from "express";
import {
  getLecturers,
  getLecturerById,
  createLecturer,
  updateLecturer,
  deleteLecturer
} from "../controllers/lecturerController.js";

const router = express.Router();

router.get("/", getLecturers);
router.get("/:id", getLecturerById);
router.post("/", createLecturer);
router.put("/:id", updateLecturer);
router.delete("/:id", deleteLecturer);

export default router;