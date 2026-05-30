import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  const color = course.color || '#1e4d8c';
  const instructor = course.lecturer?.name || 'Instructor';

  return (
    <Link to={`/courses/${course._id}`} className="course-card" style={{ '--course-color': color }}>
      <div className="course-card-banner" />
      <div className="course-card-body">
        <span className="course-code">{course.code}</span>
        <h3>{course.title}</h3>
        <p className="muted">{course.term} · {instructor}</p>
      </div>
    </Link>
  );
}
