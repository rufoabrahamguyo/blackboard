import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import studentRoutes from "./routes/studentRoutes.js";
import lecturerRoutes from "./routes/lecturerRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";

dotenv.config();
connectDB(); // connect to MongoDB

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON bodies
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/lecturers", lecturerRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/issues", issueRoutes);

app.get("/", (req, res) => {
  res.send("Congratulations! API is running and connected to MongoDB...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));