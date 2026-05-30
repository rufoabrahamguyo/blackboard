import { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext(null);

const STORAGE_KEY = 'blackboard_session';

export function AppProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  }, [session]);

  const setSessionFromAuth = (data) => {
    if (data.role === 'student') {
      setSession({
        role: 'student',
        id: data.user._id,
        name: `${data.user.firstName} ${data.user.lastName}`,
        email: data.user.email,
      });
    } else {
      setSession({
        role: 'instructor',
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
      });
    }
  };

  const logout = () => setSession(null);

  const isStudent = session?.role === 'student';
  const isInstructor = session?.role === 'instructor';

  return (
    <AppContext.Provider value={{ session, setSessionFromAuth, logout, isStudent, isInstructor }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
