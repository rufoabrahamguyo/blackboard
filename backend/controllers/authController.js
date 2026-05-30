import Student from "../models/Student.js";
import Lecturer from "../models/Lecturer.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const email = username.trim().toLowerCase();
    const emailMatch = { $expr: { $eq: [{ $toLower: "$email" }, email] } };

    const student = await Student.findOne(emailMatch);
    if (student?.password && student.password === password) {
      return res.json({
        role: "student",
        user: {
          _id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
        },
      });
    }

    const lecturer = await Lecturer.findOne(emailMatch);
    if (lecturer?.password && lecturer.password === password) {
      return res.json({
        role: "instructor",
        user: {
          _id: lecturer._id,
          name: lecturer.name,
          email: lecturer.email,
        },
      });
    }

    res.status(401).json({ message: "Invalid username or password" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
