import Student from "../models/Student.js";

// GET all students
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select("-password")
      .populate("selections.lecturer")
      .populate("enrollments.course");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET student by ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select("-password")
      .populate("selections.lecturer")
      .populate("enrollments.course");

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create new student
export const createStudent = async (req, res) => {
  const { firstName, lastName, age, schoolID, major, currentYear, email, password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const student = new Student({
      firstName,
      lastName,
      age,
      schoolID,
      major,
      currentYear,
      email,
      password,
      selections: [],
      enrollments: [],
    });

    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT update existing student
export const updateStudent = async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("selections.lecturer");

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT update student's course selections
export const updateStudentSelections = async (req, res) => {
  try {
    const { selections } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { selections },
      { new: true }
    ).populate("selections.lecturer");

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (error) {
    console.error("Error updating student selections:", error);
    res.status(500).json({ message: error.message });
  }
};

// PUT update marks for a specific lecturer's course
export const updateStudentMarks = async (req, res) => {
  try {
    const { marks } = req.body;
    const { studentId, lecturerId } = req.params;

    // Find the student first
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find the correct selection entry (the one for this lecturer)
    const selection = student.selections.find(
      (sel) => sel.lecturer.toString() === lecturerId
    );

    if (!selection) {
      return res.status(404).json({
        message: "This student is not registered under that lecturer",
      });
    }

    // Update the marks
    selection.marks = marks;

    // Save updated student document
    await student.save();

    res.json({
      message: "Marks updated successfully",
      student,
    });
  } catch (error) {
    console.error("Error updating marks:", error);
    res.status(500).json({ message: error.message });
  }
};


// DELETE student
export const deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};