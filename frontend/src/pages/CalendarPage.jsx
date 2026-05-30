import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';

export default function CalendarPage() {
  const { session } = useApp();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.assignments
      .forStudent(session.id)
      .then(setItems)
      .catch((err) => setError(err.message));
  }, [session.id]);

  const sorted = [...items].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="page">
      <header className="page-header">
        <h1>Due Dates</h1>
        <p className="muted">Assignments sorted by due date</p>
      </header>

      {error && <p className="error">{error}</p>}

      <ul className="calendar-list">
        {sorted.length === 0 ? (
          <p className="muted">No upcoming assignments.</p>
        ) : (
          sorted.map((a) => {
            const due = new Date(a.dueDate);
            const overdue = due < new Date() && a.submission?.status !== 'submitted';
            return (
              <li key={a._id} className={`card calendar-item ${overdue ? 'overdue' : ''}`}>
                <div className="calendar-date">
                  <span className="day">{due.getDate()}</span>
                  <span className="month">{due.toLocaleString('default', { month: 'short' })}</span>
                </div>
                <div>
                  <strong>{a.title}</strong>
                  <p className="muted">
                    {a.course?.title} · {a.points} points
                  </p>
                  <p>
                    Status: {a.submission?.status || 'not started'}
                    {overdue && ' · Overdue'}
                  </p>
                </div>
                <Link to={`/courses/${a.course?._id}`} className="btn secondary small">
                  Open course
                </Link>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
