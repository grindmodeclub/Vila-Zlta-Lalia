import { useState, useEffect, useCallback } from 'react';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';

const SESSION_KEY = 'vila_admin_session';
const SESSION_DURATION = 8 * 60 * 60 * 1000;

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.expires > Date.now()) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setChecking(false);
  }, []);

  const handleLogin = useCallback((success: boolean) => {
    if (success) {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ expires: Date.now() + SESSION_DURATION })
      );
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-chinese-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brass/30 border-t-brass rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <AdminLogin onLogin={handleLogin} />
  );
}
