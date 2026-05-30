import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';

export default function AdminPage() {
  const { session } = useApp();
  const [lecturers, setLecturers] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  const [studentForm, setStudentForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    schoolID: '',
    major: '',
    currentYear: '1',
    email: '',
    password: '',
  });

  const [courseForm, setCourseForm] = useState({
    title: '',
    code: '',
    description: '',
    term: 'Fall 2026',
    color: '#1e4d8c',
  });

  const load = async () => {
    try {
      const [l, s, c] = await Promise.all([
        api.lecturers.list(),
        api.students.list(),
        api.courses.list({ lecturerId: session.id }),
      ]);
      setLecturers(l);
      setStudents(s);
      setCourses(c);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, [session.id]);

  const addStudent = async (e) => {
    e.preventDefault();
    try {
      await api.students.create({
        ...studentForm,
        age: Number(studentForm.age),
        schoolID: Number(studentForm.schoolID),
      });
      setStudentForm({
        firstName: '',
        lastName: '',
        age: '',
        schoolID: '',
        major: '',
        currentYear: '1',
        email: '',
        password: '',
      });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const addCourse = async (e) => {
    e.preventDefault();
    try {
      await api.courses.create({ ...courseForm, lecturer: session.id });
      setCourseForm({ title: '', code: '', description: '', term: 'Fall 2026', color: '#1e4d8c' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Course Admin</h1>
        <p className="muted">Manage courses and students</p>
      </header>

      {error && <p className="error">{error}</p>}

      <div className="admin-grid">
        <section className="card form-stack">
          <h3>Create course</h3>
          <form onSubmit={addCourse}>
            <input
              placeholder="Course title"
              value={courseForm.title}
              onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
              required
            />
            <input
              placeholder="Course code (e.g. CS101)"
              value={courseForm.code}
              onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={courseForm.description}
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
            />
            <input
              placeholder="Term"
              value={courseForm.term}
              onChange={(e) => setCourseForm({ ...courseForm, term: e.target.value })}
            />
            <input
              type="color"
              value={courseForm.color}
              onChange={(e) => setCourseForm({ ...courseForm, color: e.target.value })}
            />
            <button type="submit" className="btn primary">
              Create course
            </button>
          </form>
        </section>

        <section className="card form-stack">
          <h3>Add student</h3>
          <form onSubmit={addStudent}>
            <div className="form-row">
              <input
                placeholder="First name"
                value={studentForm.firstName}
                onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })}
                required
              />
              <input
                placeholder="Last name"
                value={studentForm.lastName}
                onChange={(e) => setStudentForm({ ...studentForm, lastName: e.target.value })}
                required
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={studentForm.email}
              onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
              required
            />
            <div className="form-row">
              <input
                type="number"
                placeholder="School ID"
                value={studentForm.schoolID}
                onChange={(e) => setStudentForm({ ...studentForm, schoolID: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Age"
                value={studentForm.age}
                onChange={(e) => setStudentForm({ ...studentForm, age: e.target.value })}
                required
              />
            </div>
            <input
              placeholder="Major"
              value={studentForm.major}
              onChange={(e) => setStudentForm({ ...studentForm, major: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={studentForm.password}
              onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
              required
            />
            <button type="submit" className="btn primary">
              Add student
            </button>
          </form>
        </section>
      </div>

      <section className="section">
        <h2>Your courses ({courses.length})</h2>
        <ul className="simple-list">
          {courses.map((c) => (
            <li key={c._id}>
              <strong>{c.code}</strong> — {c.title} ({c.term})
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>Students ({students.length})</h2>
        <p className="muted">Enroll students from each course Roster tab.</p>
      </section>
    </div>
  );
}
