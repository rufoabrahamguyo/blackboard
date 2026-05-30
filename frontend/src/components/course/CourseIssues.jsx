import { useEffect, useState } from 'react';
import { api } from '../../api/client';

const STATUSES = ['pending', 'in_review', 'resolved', 'rejected'];

export default function CourseIssues({ course, session, isInstructor }) {
  const [issues, setIssues] = useState([]);
  const [form, setForm] = useState({
    issueType: 'missing_marks',
    subject: '',
    description: '',
    priority: 'medium',
  });
  const [error, setError] = useState('');

  const load = () => {
    const params = isInstructor
      ? { courseId: course._id, lecturerId: course.lecturer._id || course.lecturer }
      : { courseId: course._id, studentId: session.id };
    api.issues
      .list(params)
      .then(setIssues)
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    load();
  }, [course._id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.issues.create({
        studentId: session.id,
        courseId: course._id,
        ...form,
      });
      setForm({ issueType: 'missing_marks', subject: '', description: '', priority: 'medium' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}

      {!isInstructor && (
        <form className="card form-stack" onSubmit={submit}>
          <h3>Contact instructor</h3>
          <select value={form.issueType} onChange={(e) => setForm({ ...form, issueType: e.target.value })}>
            <option value="missing_marks">Missing marks</option>
            <option value="incorrect_marks">Incorrect marks</option>
            <option value="other">Other</option>
          </select>
          <input
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
          />
          <textarea
            placeholder="Describe your issue"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <button type="submit" className="btn primary">
            Submit issue
          </button>
        </form>
      )}

      <ul className="issue-list">
        {issues.length === 0 ? (
          <p className="muted">No issues for this course.</p>
        ) : (
          issues.map((issue) => (
            <li key={issue._id} className="card">
              <div className="issue-card-header">
                <strong>{issue.subject}</strong>
                <span className={`badge ${issue.status}`}>{issue.status}</span>
              </div>
              <p className="muted">
                {issue.student?.firstName} {issue.student?.lastName} · {issue.issueType}
              </p>
              <p>{issue.description}</p>
              {isInstructor && (
                <select
                  value={issue.status}
                  onChange={async (e) => {
                    await api.issues.updateStatus(issue._id, {
                      status: e.target.value,
                      resolution: e.target.value === 'resolved' ? 'Resolved' : undefined,
                      resolvedBy: course.lecturer._id || course.lecturer,
                    });
                    load();
                  }}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
