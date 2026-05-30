import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Shell from './layout/Shell';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CoursePage from './pages/CoursePage';
import GradesPage from './pages/GradesPage';
import CalendarPage from './pages/CalendarPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function ProtectedRoute({ children }) {
  const { session } = useApp();
  if (!session) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <Shell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses/:courseId" element={<CoursePage />} />
        <Route path="/grades" element={<GradesPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
