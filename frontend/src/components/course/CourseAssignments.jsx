import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function CourseAssignments({ course, session, isInstructor }) {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [form, setForm] = useState({
    title: '',
    instructions: '',
    dueDate: '',
    points: 100,
  });
  const [submitForms, setSubmitForms] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      let list;
      if (isInstructor) {
        list = await api.assignments.byCourse(course._id);
      } else {
        const all = await api.assignments.forStudent(session.id);
        list = all.filter((a) => a.course?._id === course._id || a.course === course._id);
      }
      setAssignments(list);
      if (isInstructor) {
        const subs = {};
        for (const a of list) {
          subs[a._id] = await api.assignments.submissions(a._id);
        }
        setSubmissions(subs);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [course._id]);

  const createAssignment = async (e) => {
    e.preventDefault();
    try {
      await api.assignments.create(course._id, form);
      setForm({ title: '', instructions: '', dueDate: '', points: 100 });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const submitWork = async (assignmentId) => {
    try {
      await api.assignments.submit(assignmentId, {
        studentId: session.id,
        content: submitForms[assignmentId] || '',
      });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const gradeWork = async (submissionId, points, assignmentId) => {
    const score = Number(prompt(`Score (max ${points}):`, '0'));
    if (Number.isNaN(score)) return;
    const feedback = prompt('Feedback (optional):', '') || '';
    try {
      await api.submissions.grade(submissionId, { score, feedback });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}

      {isInstructor && (
        <form className="card form-stack" onSubmit={createAssignment}>
          <h3>Create assignment</h3>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Instructions"
            rows={3}
            value={form.instructions}
            onChange={(e) => setForm({ ...form, instructions: e.target.value })}
          />
          <div className="form-row">
            <input
              type="datetime-local"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              required
            />
            <input
              type="number"
              min={1}
              placeholder="Points"
              value={form.points}
              onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
              required
            />
          </div>
          <button type="submit" className="btn primary">
            Publish assignment
          </button>
        </form>
      )}

      {loading ? (
        <p className="muted">Loading assignments…</p>
      ) : assignments.length === 0 ? (
        <p className="muted">No assignments yet.</p>
      ) : (
        <ul className="assignment-list">
          {assignments.map((a) => (
            <li key={a._id} className="card">
              <div className="assignment-header">
                <strong>{a.title}</strong>
                <span className="badge">{a.points} pts</span>
              </div>
              <p className="muted">Due {new Date(a.dueDate).toLocaleString()}</p>
              {a.instructions && <p>{a.instructions}</p>}

              {!isInstructor && (
                <div className="submit-box">
                  <textarea
                    placeholder="Your submission"
                    rows={3}
                    value={submitForms[a._id] || ''}
                    onChange={(e) =>
                      setSubmitForms({ ...submitForms, [a._id]: e.target.value })
                    }
                  />
                  <button type="button" className="btn primary" onClick={() => submitWork(a._id)}>
                    Submit
                  </button>
                </div>
              )}

              {isInstructor && submissions[a._id]?.length > 0 && (
                <div className="submissions-table">
                  <h4>Submissions</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Status</th>
                        <th>Score</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions[a._id].map((s) => (
                        <tr key={s._id}>
                          <td>
                            {s.student?.firstName} {s.student?.lastName}
                          </td>
                          <td>{s.status}</td>
                          <td>{s.score ?? '—'}</td>
                          <td>
                            {s.status === 'submitted' && (
                              <button
                                type="button"
                                className="btn secondary small"
                                onClick={() => gradeWork(s._id, a.points, a._id)}
                              >
                                Grade
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {isInstructor && (
                <button
                  type="button"
                  className="btn danger small"
                  onClick={async () => {
                    if (confirm('Delete assignment?')) {
                      await api.assignments.remove(a._id);
                      load();
                    }
                  }}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
