import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useApp } from '../../context/AppContext';

export default function CourseGradebook({ course, isInstructor }) {
  const { session, isStudent } = useApp();
  const [gradebook, setGradebook] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.courses
      .gradebook(course._id)
      .then(setGradebook)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [course._id]);

  if (loading) return <p className="muted">Loading gradebook…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!gradebook) return null;

  const myRow = isStudent
    ? gradebook.gradebook.find((r) => r.student._id === session.id)
    : null;

  if (isStudent && myRow) {
    return (
      <div>
        <h3>Your grades</h3>
        <table className="grade-table">
          <thead>
            <tr>
              <th>Assignment</th>
              <th>Points</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myRow.grades.map((g) => (
              <tr key={g.assignmentId}>
                <td>{g.title}</td>
                <td>{g.points}</td>
                <td>{g.score ?? '—'}</td>
                <td>
                  <span className={`badge ${g.status}`}>{g.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>
                <strong>Total</strong>
              </td>
              <td colSpan={2}>
                <strong>
                  {myRow.totalEarned} / {myRow.totalPossible}
                  {myRow.percentage != null && ` (${myRow.percentage}%)`}
                </strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }

  if (!isInstructor) {
    return <p className="muted">No grade data available.</p>;
  }

  return (
    <div className="gradebook-scroll">
      <table className="grade-table wide">
        <thead>
          <tr>
            <th>Student</th>
            {gradebook.assignments.map((a) => (
              <th key={a._id} title={a.title}>
                {a.title.slice(0, 12)}
                {a.title.length > 12 ? '…' : ''}
                <br />
                <small>{a.points}pts</small>
              </th>
            ))}
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {gradebook.gradebook.map((row) => (
            <tr key={row.student._id}>
              <td>
                {row.student.firstName} {row.student.lastName}
              </td>
              {row.grades.map((g) => (
                <td key={g.assignmentId}>{g.score ?? '—'}</td>
              ))}
              <td>{row.percentage ?? '—'}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
