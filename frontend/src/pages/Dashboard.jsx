import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';
import CourseCard from '../components/CourseCard';

export default function Dashboard() {
  const { session, isStudent, isInstructor } = useApp();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = isStudent
      ? api.dashboard.student(session.id)
      : api.dashboard.instructor(session.id);

    load
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [session.id, isStudent]);

  if (loading) return <p className="muted">Loading dashboard…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!data) return null;

  const stats = data.stats || {};

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Institution Page</h1>
          <p className="muted">
            Welcome back, <strong>{session.name}</strong>
            {isStudent ? ' — here are your courses and upcoming work.' : ' — manage your teaching courses below.'}
          </p>
        </div>
      </header>

      <div className="stat-row">
        {isStudent ? (
          <>
            <Stat label="Courses" value={stats.courses} />
            <Stat label="Upcoming" value={stats.upcomingAssignments} />
            <Stat label="Open issues" value={stats.pendingIssues} />
            <Stat label="Graded" value={stats.gradedSubmissions} />
          </>
        ) : (
          <>
            <Stat label="Courses" value={stats.courses} />
            <Stat label="Students" value={stats.students} />
            <Stat label="To grade" value={stats.needsGrading} />
            <Stat label="Open issues" value={stats.openIssues} />
          </>
        )}
      </div>

      <section className="section">
        <h2>My Courses</h2>
        <div className="course-grid">
          {(data.courses || []).length === 0 ? (
            <p className="muted">
              {isStudent
                ? 'You are not enrolled in any courses yet.'
                : 'No courses yet. Create one in Course Admin.'}
            </p>
          ) : (
            data.courses.map((c) => <CourseCard key={c._id} course={c} />)
          )}
        </div>
      </section>

      {isStudent && data.upcomingAssignments?.length > 0 && (
        <section className="section">
          <h2>Upcoming assignments</h2>
          <ul className="activity-list">
            {data.upcomingAssignments.map((a) => (
              <li key={a._id}>
                <div>
                  <strong>{a.title}</strong>
                  <span className="muted">
                    {a.course?.title} · due {formatDate(a.dueDate)}
                  </span>
                </div>
                <Link to={`/courses/${a.course?._id}`} className="btn secondary small">
                  Open
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.recentAnnouncements?.length > 0 && (
        <section className="section">
          <h2>Recent announcements</h2>
          <ul className="announcement-feed">
            {data.recentAnnouncements.map((a) => (
              <li key={a._id} className="card">
                <div className="announcement-meta">
                  <strong>{a.title}</strong>
                  <span className="muted">
                    {a.course?.title || a.course?.code} · {formatDate(a.createdAt)}
                  </span>
                </div>
                <p>{a.body}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-value">{value ?? 0}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function formatDate(d) {
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
