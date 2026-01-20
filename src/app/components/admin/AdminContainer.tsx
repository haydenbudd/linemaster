import { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { getCurrentSession, updateLastActivity, checkSessionTimeout, onAuthStateChange } from '@/app/lib/supabase';

export function AdminContainer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionWarning, setSessionWarning] = useState(false);

  useEffect(() => {
    // Check if user has active Supabase session
    checkAuth();
    
    // Listen to auth state changes
    const { data: { subscription } } = onAuthStateChange((session) => {
      setIsAuthenticated(!!session);
      if (!session) {
        setSessionWarning(false);
      }
    });
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Monitor session timeout and user activity
  useEffect(() => {
    if (!isAuthenticated) return;

    // Track user activity to prevent timeout
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => {
      updateLastActivity();
      setSessionWarning(false);
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Check session timeout every minute
    const sessionCheck = setInterval(async () => {
      if (checkSessionTimeout()) {
        console.log('Session expired due to inactivity');
        setIsAuthenticated(false);
        return;
      }
      
      // Verify session is still valid with Supabase
      const session = await getCurrentSession();
      if (!session) {
        setIsAuthenticated(false);
        return;
      }
      
      // Show warning if session will expire in less than 5 minutes
      const lastActivity = localStorage.getItem('last_activity');
      if (lastActivity) {
        const timeSinceActivity = Date.now() - parseInt(lastActivity);
        const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
        const timeRemaining = SESSION_TIMEOUT - timeSinceActivity;
        
        if (timeRemaining < 5 * 60 * 1000 && timeRemaining > 0) {
          setSessionWarning(true);
        }
      }
    }, 60000); // Check every minute

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      clearInterval(sessionCheck);
    };
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const session = await getCurrentSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setSessionWarning(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSessionWarning(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} sessionWarning={sessionWarning} />;
}
