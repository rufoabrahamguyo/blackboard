import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function CourseRoster({ course, isInstructor }) {
  const [roster, setRoster] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [enrollId, setEnrollId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [r, students] = await Promise.all([
        api.courses.students(course._id),
        isInstructor ? api.students.list() : Promise.resolve([]),
      ]);
      setRoster(r);
      setAllStudents(students);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [course._id]);

  const enroll = async (e) => {
    e.preventDefault();
    try {
      await api.courses.enroll(course._id, enrollId);
      setEnrollId('');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const notEnrolled = allStudents.filter((s) => !roster.find((r) => r._id === s._id));

  return (
    <div>
      {error && <p className="error">{error}</p>}

      {isInstructor && (
        <form className="card form-row" onSubmit={enroll}>
          <select value={enrollId} onChange={(e) => setEnrollId(e.target.value)} required>
            <option value="">Enroll student…</option>
            {notEnrolled.map((s) => (
              <option key={s._id} value={s._id}>
                {s.firstName} {s.lastName} ({s.schoolID})
              </option>
            ))}
          </select>
          <button type="submit" className="btn primary">
            Enroll
          </button>
        </form>
      )}

      {loading ? (
        <p className="muted">Loading roster…</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>School ID</th>
              <th>Email</th>
              <th>Major</th>
            </tr>
          </thead>
          <tbody>
            {roster.length === 0 ? (
              <tr>
                <td colSpan={4} className="muted">
                  No students enrolled.
                </td>
              </tr>
            ) : (
              roster.map((s) => (
                <tr key={s._id}>
                  <td>
                    {s.firstName} {s.lastName}
                  </td>
                  <td>{s.schoolID}</td>
                  <td>{s.email}</td>
                  <td>{s.major}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
