import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function CourseAnnouncements({ course, isInstructor }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', body: '', pinned: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.announcements
      .byCourse(course._id)
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [course._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.announcements.create(course._id, {
        ...form,
        author: course.lecturer._id || course.lecturer,
      });
      setForm({ title: '', body: '', pinned: false });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}

      {isInstructor && (
        <form className="card form-stack" onSubmit={handleSubmit}>
          <h3>Post announcement</h3>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Message to class"
            rows={4}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            required
          />
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.pinned}
              onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
            />
            Pin to top
          </label>
          <button type="submit" className="btn primary">
            Post
          </button>
        </form>
      )}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : items.length === 0 ? (
        <p className="muted">No announcements yet.</p>
      ) : (
        <ul className="announcement-feed">
          {items.map((a) => (
            <li key={a._id} className="card">
              <div className="announcement-meta">
                <strong>
                  {a.pinned && <span className="pin">📌 </span>}
                  {a.title}
                </strong>
                <span className="muted">
                  {a.author?.name} · {new Date(a.createdAt).toLocaleString()}
                </span>
              </div>
              <p>{a.body}</p>
              {isInstructor && (
                <button
                  type="button"
                  className="btn danger small"
                  onClick={async () => {
                    await api.announcements.remove(a._id);
                    load();
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
