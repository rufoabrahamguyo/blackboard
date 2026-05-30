import express from "express";
import {
  getAnnouncementsByCourse,
  createAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

const router = express.Router();

router.get("/course/:courseId", getAnnouncementsByCourse);
router.post("/course/:courseId", createAnnouncement);
router.delete("/:id", deleteAnnouncement);

export default router;
