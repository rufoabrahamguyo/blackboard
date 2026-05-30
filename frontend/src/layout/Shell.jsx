import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function userInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const NAV = {
  student: [
    { to: '/dashboard', label: 'Institution Page', end: true },
    { to: '/grades', label: 'My Grades' },
    { to: '/calendar', label: 'Calendar' },
  ],
  instructor: [
    { to: '/dashboard', label: 'Institution Page', end: true },
    { to: '/admin', label: 'Course Admin' },
  ],
};

export default function Shell() {
  const { session, logout, isStudent } = useApp();
  const navigate = useNavigate();
  const links = isStudent ? NAV.student : NAV.instructor;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="shell">
      <header className="topbar">
        <Link to="/dashboard" className="brand">
          <span className="brand-icon">Bb</span>
          <span className="brand-text">
            <span className="brand-title">Blackboard</span>
            <span className="brand-sub">Learn</span>
          </span>
        </Link>

        <div className="topbar-user">
          <div className="user-chip">
            <span className="user-avatar">{userInitials(session?.name)}</span>
            <div className="user-details">
              <span className="user-name">{session?.name}</span>
              <span className="role-badge">{isStudent ? 'Student' : 'Instructor'}</span>
            </div>
          </div>
          <button type="button" className="btn btn-ghost" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      <div className="shell-body">
        <aside className="sidebar">
          <p className="sidebar-label">Menu</p>
          <nav>
            {links.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
