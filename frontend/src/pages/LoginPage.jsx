import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const { session, setSessionFromAuth } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) navigate('/dashboard', { replace: true });
  }, [session, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.auth.login({ username, password });
      setSessionFromAuth(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-layout">
      <aside className="login-brand">
        <div className="login-brand-inner">
          <div className="login-logo">
            <span className="login-logo-mark">Bb</span>
            <div>
              <span className="login-logo-title">Blackboard</span>
              <span className="login-logo-sub">Learn</span>
            </div>
          </div>
          <h1 className="login-tagline">Your courses. One place.</h1>
          <p className="login-tagline-desc">
            Sign in with your university credentials to access courses, assignments, and grades.
          </p>
          <p className="login-institution">USIU · Learning Management System</p>
        </div>
      </aside>

      <main className="login-main">
        <div className="login-panel">
          <header className="login-panel-header">
            <h2>Sign in</h2>
            <p>Enter your username and password</p>
          </header>

          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field-label">
              Username
              <input
                type="text"
                name="username"
                autoComplete="username"
                placeholder="Email address"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>

            <label className="field-label">
              Password
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <footer className="login-footer">
            <span className="muted">Use the email and password set for your account.</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
