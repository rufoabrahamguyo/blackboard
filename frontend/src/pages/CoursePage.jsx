import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';
import CourseAnnouncements from '../components/course/CourseAnnouncements';
import CourseAssignments from '../components/course/CourseAssignments';
import CourseGradebook from '../components/course/CourseGradebook';
import CourseRoster from '../components/course/CourseRoster';
import CourseIssues from '../components/course/CourseIssues';

const TABS = [
  { id: 'home', label: 'Course Home' },
  { id: 'assignments', label: 'Assignments' },
  { id: 'grades', label: 'Gradebook' },
  { id: 'roster', label: 'Roster' },
  { id: 'issues', label: 'Help / Issues' },
];

export default function CoursePage() {
  const { courseId } = useParams();
  const { session, isInstructor } = useApp();
  const [course, setCourse] = useState(null);
  const [tab, setTab] = useState('home');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.courses
      .get(courseId)
      .then(setCourse)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <p className="muted">Loading course…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!course) return null;

  const color = course.color || '#1e4d8c';

  return (
    <div className="page course-page">
      <div className="course-banner" style={{ background: color }}>
        <Link to="/dashboard" className="back-link">
          ← Dashboard
        </Link>
        <span className="course-banner-code">{course.code}</span>
        <h1>{course.title}</h1>
        <p>
          {course.term} · {course.lecturer?.name}
        </p>
      </div>

      {course.description && <p className="course-desc">{course.description}</p>}

      <nav className="course-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? 'course-tab active' : 'course-tab'}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="course-tab-content">
        {tab === 'home' && (
          <CourseAnnouncements course={course} isInstructor={isInstructor} />
        )}
        {tab === 'assignments' && (
          <CourseAssignments course={course} session={session} isInstructor={isInstructor} />
        )}
        {tab === 'grades' && <CourseGradebook course={course} isInstructor={isInstructor} />}
        {tab === 'roster' && <CourseRoster course={course} isInstructor={isInstructor} />}
        {tab === 'issues' && (
          <CourseIssues course={course} session={session} isInstructor={isInstructor} />
        )}
      </div>
    </div>
  );
}
