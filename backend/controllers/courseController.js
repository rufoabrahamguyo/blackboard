import Course from "../models/Course.js";
import Student from "../models/Student.js";
import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";

export const getCourses = async (req, res) => {
  try {
    const { lecturerId, studentId } = req.query;
    let courses;

    if (studentId) {
      const student = await Student.findById(studentId).populate({
        path: "enrollments.course",
        populate: { path: "lecturer", select: "name email" },
      });
      if (!student) return res.status(404).json({ message: "Student not found" });
      courses = student.enrollments
        .filter((e) => e.status === "active" && e.course)
        .map((e) => e.course);
    } else if (lecturerId) {
      courses = await Course.find({ lecturer: lecturerId }).populate("lecturer", "name email");
    } else {
      courses = await Course.find().populate("lecturer", "name email");
    }

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("lecturer", "name email course");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    const saved = await course.save();
    const populated = await Course.findById(saved._id).populate("lecturer", "name email");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate(
      "lecturer",
      "name email"
    );
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    await Student.updateMany({}, { $pull: { enrollments: { course: req.params.id } } });
    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const enrollStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const already = student.enrollments.some(
      (e) => e.course.toString() === courseId && e.status === "active"
    );
    if (already) {
      return res.status(400).json({ message: "Student already enrolled" });
    }

    student.enrollments.push({ course: courseId });
    await student.save();

    const populated = await Student.findById(studentId).populate("enrollments.course");
    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const unenrollStudent = async (req, res) => {
  try {
    const { id: courseId, studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const enrollment = student.enrollments.find((e) => e.course.toString() === courseId);
    if (!enrollment) return res.status(404).json({ message: "Not enrolled in this course" });

    enrollment.status = "dropped";
    await student.save();
    res.json({ message: "Student unenrolled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseStudents = async (req, res) => {
  try {
    const students = await Student.find({
      "enrollments.course": req.params.id,
      "enrollments.status": "active",
    }).select("firstName lastName email schoolID major currentYear enrollments");

    const roster = students.map((s) => ({
      _id: s._id,
      firstName: s.firstName,
      lastName: s.lastName,
      email: s.email,
      schoolID: s.schoolID,
      major: s.major,
      currentYear: s.currentYear,
    }));

    res.json(roster);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGradebook = async (req, res) => {
  try {
    const courseId = req.params.id;
    const assignments = await Assignment.find({ course: courseId, published: true }).sort({
      dueDate: 1,
    });

    const students = await Student.find({
      "enrollments.course": courseId,
      "enrollments.status": "active",
    }).select("firstName lastName email schoolID");

    const assignmentIds = assignments.map((a) => a._id);
    const submissions = await Submission.find({
      assignment: { $in: assignmentIds },
    });

    const gradebook = students.map((student) => {
      const grades = assignments.map((assignment) => {
        const sub = submissions.find(
          (s) =>
            s.student.toString() === student._id.toString() &&
            s.assignment.toString() === assignment._id.toString()
        );
        return {
          assignmentId: assignment._id,
          title: assignment.title,
          points: assignment.points,
          score: sub?.score ?? null,
          status: sub?.status ?? "missing",
          submissionId: sub?._id ?? null,
        };
      });

      const earned = grades.reduce((sum, g) => sum + (g.score ?? 0), 0);
      const possible = grades.reduce((sum, g) => sum + g.points, 0);

      return {
        student: {
          _id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          schoolID: student.schoolID,
        },
        grades,
        totalEarned: earned,
        totalPossible: possible,
        percentage: possible > 0 ? Math.round((earned / possible) * 100) : null,
      };
    });

    res.json({ assignments, gradebook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
