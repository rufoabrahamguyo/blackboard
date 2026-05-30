import Course from "../models/Course.js";
import Student from "../models/Student.js";
import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import Announcement from "../models/Announcement.js";
import Issue from "../models/Issue.js";

export const getDashboard = async (req, res) => {
  try {
    const { studentId, lecturerId } = req.query;

    if (studentId) {
      const student = await Student.findById(studentId).populate({
        path: "enrollments.course",
        populate: { path: "lecturer", select: "name" },
      });
      if (!student) return res.status(404).json({ message: "Student not found" });

      const activeCourses = student.enrollments
        .filter((e) => e.status === "active" && e.course)
        .map((e) => e.course);

      const courseIds = activeCourses.map((c) => c._id);
      const upcomingAssignments = await Assignment.find({
        course: { $in: courseIds },
        published: true,
        dueDate: { $gte: new Date() },
      })
        .populate("course", "title code color")
        .sort({ dueDate: 1 })
        .limit(5);

      const recentAnnouncements = await Announcement.find({ course: { $in: courseIds } })
        .populate("course", "title code color")
        .populate("author", "name")
        .sort({ createdAt: -1 })
        .limit(5);

      const pendingIssues = await Issue.countDocuments({
        student: studentId,
        status: { $in: ["pending", "in_review"] },
      });

      const submissions = await Submission.find({ student: studentId });
      const graded = submissions.filter((s) => s.status === "graded").length;

      return res.json({
        role: "student",
        user: {
          _id: student._id,
          name: `${student.firstName} ${student.lastName}`,
          email: student.email,
        },
        courses: activeCourses,
        stats: {
          courses: activeCourses.length,
          upcomingAssignments: upcomingAssignments.length,
          pendingIssues,
          gradedSubmissions: graded,
        },
        upcomingAssignments,
        recentAnnouncements,
      });
    }

    if (lecturerId) {
      const courses = await Course.find({ lecturer: lecturerId });
      const courseIds = courses.map((c) => c._id);

      const studentsCount = await Student.countDocuments({
        "enrollments.course": { $in: courseIds },
        "enrollments.status": "active",
      });

      const openIssues = await Issue.countDocuments({
        lecturer: lecturerId,
        status: { $in: ["pending", "in_review"] },
      });

      const needsGrading = await Submission.countDocuments({
        status: "submitted",
        assignment: {
          $in: await Assignment.find({ course: { $in: courseIds } }).distinct("_id"),
        },
      });

      const recentAnnouncements = await Announcement.find({ course: { $in: courseIds } })
        .populate("course", "title code")
        .sort({ createdAt: -1 })
        .limit(5);

      return res.json({
        role: "instructor",
        courses,
        stats: {
          courses: courses.length,
          students: studentsCount,
          openIssues,
          needsGrading,
        },
        recentAnnouncements,
      });
    }

    res.status(400).json({ message: "Provide studentId or lecturerId" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
