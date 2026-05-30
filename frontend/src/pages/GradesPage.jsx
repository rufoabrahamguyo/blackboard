import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';

export default function GradesPage() {
  const { session } = useApp();
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.submissions
      .grades(session.id)
      .then(setGrades)
      .catch((err) => setError(err.message));
  }, [session.id]);

  return (
    <div className="page">
      <header className="page-header">
        <h1>My Grades</h1>
        <p className="muted">All graded work across your courses</p>
      </header>

      {error && <p className="error">{error}</p>}

      {grades.length === 0 ? (
        <p className="muted">No graded submissions yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Assignment</th>
              <th>Score</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g) => (
              <tr key={g._id}>
                <td>
                  <Link to={`/courses/${g.assignment?.course?._id}`}>
                    {g.assignment?.course?.code}
                  </Link>
                </td>
                <td>{g.assignment?.title}</td>
                <td>
                  {g.score} / {g.assignment?.points}
                </td>
                <td>{g.feedback || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
