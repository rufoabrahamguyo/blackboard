import Issue from "../models/Issue.js";
import Student from "../models/Student.js";
import Course from "../models/Course.js";

// GET all issues (with optional filters)
export const getIssues = async (req, res) => {
  try {
    const { studentId, lecturerId, status } = req.query;
    const filter = {};
    
    if (studentId) filter.student = studentId;
    if (lecturerId) filter.lecturer = lecturerId;
    if (status) filter.status = status;
    
    if (req.query.courseId) filter.course = req.query.courseId;

    const issues = await Issue.find(filter)
      .populate('student', 'firstName lastName email schoolID')
      .populate('course', 'title code')
      .populate('lecturer', 'name email course')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 }); // Most recent first
    
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET issue by ID
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId)
      .populate('student', 'firstName lastName email schoolID')
      .populate('lecturer', 'name email course')
      .populate('resolvedBy', 'name email');
    
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create new issue (student submits)
export const createIssue = async (req, res) => {
  try {
    const { studentId, lecturerId, courseId, issueType, subject, description, priority, attachments } = req.body;
    
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    let resolvedLecturerId = lecturerId;
    let resolvedCourseId = courseId;

    if (courseId) {
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });
      resolvedLecturerId = course.lecturer;
      const isEnrolled = student.enrollments.some(
        (e) => e.course.toString() === courseId && e.status === "active"
      );
      if (!isEnrolled) {
        return res.status(400).json({ message: "You are not enrolled in this course" });
      }
    } else if (!lecturerId) {
      return res.status(400).json({ message: "Provide courseId or lecturerId" });
    } else {
      const viaSelection = student.selections.some(
        (sel) => sel.lecturer.toString() === lecturerId
      );
      const lecturerCourses = await Course.find({ lecturer: lecturerId });
      const viaEnrollment = lecturerCourses.some((c) =>
        student.enrollments.some(
          (e) => e.course.toString() === c._id.toString() && e.status === "active"
        )
      );
      if (!viaSelection && !viaEnrollment) {
        return res.status(400).json({ message: "You are not registered under this lecturer" });
      }
    }
    
    const issue = new Issue({
      student: studentId,
      course: resolvedCourseId,
      lecturer: resolvedLecturerId,
      issueType: issueType || 'missing_marks',
      subject,
      description,
      priority: priority || 'medium',
      attachments: attachments || [],
      status: 'pending'
    });
    
    const savedIssue = await issue.save();
    const populatedIssue = await Issue.findById(savedIssue._id)
      .populate('student', 'firstName lastName email schoolID')
      .populate('lecturer', 'name email course');
    
    res.status(201).json(populatedIssue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET issues by student ID
export const getStudentIssues = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const issues = await Issue.find({ student: studentId })
      .populate('lecturer', 'name email course')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT update issue status (lecturer/admin resolves)
export const updateIssueStatus = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { status, resolution, resolvedBy } = req.body;
    
    const updateData = { status };
    
    if (status === 'resolved') {
      updateData.resolution = resolution;
      updateData.resolvedBy = resolvedBy;
      updateData.resolvedAt = new Date();
    }
    
    const updatedIssue = await Issue.findByIdAndUpdate(
      issueId,
      updateData,
      { new: true }
    )
      .populate('student', 'firstName lastName email schoolID')
      .populate('lecturer', 'name email course')
      .populate('resolvedBy', 'name email');
    
    if (!updatedIssue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    
    res.json(updatedIssue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT update issue (student can update their own pending issues)
export const updateIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { subject, description, attachments } = req.body;
    
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    
    // Only allow updates if status is pending
    if (issue.status !== 'pending') {
      return res.status(400).json({ 
        message: "Cannot update issue that is not pending" 
      });
    }
    
    const updatedIssue = await Issue.findByIdAndUpdate(
      issueId,
      { subject, description, attachments },
      { new: true }
    )
      .populate('student', 'firstName lastName email schoolID')
      .populate('lecturer', 'name email course');
    
    res.json(updatedIssue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE issue (student can delete their own pending issues)
export const deleteIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    
    // Only allow deletion if status is pending
    if (issue.status !== 'pending') {
      return res.status(400).json({ 
        message: "Cannot delete issue that is not pending" 
      });
    }
    
    await Issue.findByIdAndDelete(issueId);
    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

