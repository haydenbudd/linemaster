import { useState, useEffect } from 'react';
import { Lock, Mail, AlertCircle, Shield, Clock, CheckCircle } from 'lucide-react';
import { signInWithPassword, checkAccountLocked } from '@/app/lib/supabase';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [lockoutMinutes, setLockoutMinutes] = useState<number | null>(null);

  useEffect(() => {
    // Check if account is locked on mount
    const lockStatus = checkAccountLocked();
    if (lockStatus.locked && lockStatus.remainingTime) {
      const minutes = lockStatus.remainingTime;
      setLockoutMinutes(minutes);
      setError(`Account locked due to too many failed attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`);
      
      // Update countdown timer
      const interval = setInterval(() => {
        const newLockStatus = checkAccountLocked();
        if (!newLockStatus.locked) {
          setLockoutMinutes(null);
          setError('');
          clearInterval(interval);
        } else if (newLockStatus.remainingTime) {
          setLockoutMinutes(newLockStatus.remainingTime);
          setError(`Account locked. Try again in ${newLockStatus.remainingTime} minute${newLockStatus.remainingTime === 1 ? '' : 's'}.`);
        }
      }, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setRemainingAttempts(null);
    
    // Check if account is locked
    const lockStatus = checkAccountLocked();
    if (lockStatus.locked) {
      setLockoutMinutes(lockStatus.remainingTime || null);
      setError(`Account locked. Try again in ${lockStatus.remainingTime} minute${lockStatus.remainingTime === 1 ? '' : 's'}.`);
      return;
    }
    
    setLoading(true);
    
    try {
      await signInWithPassword(email, password);
      // Success - onLogin will be called by parent component detecting session
      onLogin();
    } catch (err: any) {
      console.error('Login error:', err);
      
      const errorMessage = err?.message || 'Login failed';
      
      if (errorMessage.includes('Account locked')) {
        // Extract minutes from error message
        const match = errorMessage.match(/(\d+) minute/);
        const minutes = match ? parseInt(match[1]) : null;
        setLockoutMinutes(minutes);
        setError(errorMessage);
      } else if (errorMessage.includes('Invalid login credentials')) {
        const attempts = JSON.parse(localStorage.getItem('login_attempts') || '{"count":0}');
        const remaining = 5 - attempts.count;
        setRemainingAttempts(remaining);
        setError(`Invalid email or password. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`);
      } else if (errorMessage.includes('Email not confirmed')) {
        setError('Email not confirmed. Please check your email or contact your administrator.');
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
      
      setPassword(''); // Clear password on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2">Admin Access</h1>
        <p className="text-gray-600 text-center mb-6">
          Secure login with Supabase authentication
        </p>

        {/* Security Features Info */}
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
          <p className="font-medium mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security Features:
          </p>
          <ul className="text-xs space-y-1.5">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3" />
              Encrypted password storage (bcrypt)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3" />
              Auto-logout after 30 min inactivity
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3" />
              Account lockout (5 failed attempts)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3" />
              Secure session tokens
            </li>
          </ul>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="marketing@linemaster.com"
                required
                autoFocus
                disabled={loading || lockoutMinutes !== null}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your password"
                required
                disabled={loading || lockoutMinutes !== null}
              />
            </div>
          </div>

          {error && (
            <div className={`${lockoutMinutes ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'} border px-4 py-3 rounded-lg flex gap-3`}>
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${lockoutMinutes ? 'text-red-600' : 'text-amber-600'}`} />
              <div className={`flex-1 ${lockoutMinutes ? 'text-red-800' : 'text-amber-800'}`}>
                <p className="font-medium text-sm">{error}</p>
                {remainingAttempts !== null && remainingAttempts > 0 && (
                  <p className="text-xs mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {remainingAttempts === 1 
                      ? 'Last attempt before 15-minute lockout!' 
                      : `${remainingAttempts} attempts left before lockout`}
                  </p>
                )}
                {lockoutMinutes && (
                  <p className="text-xs mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Lockout automatically expires in {lockoutMinutes} minute{lockoutMinutes === 1 ? '' : 's'}
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || lockoutMinutes !== null}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </>
            ) : lockoutMinutes ? (
              <>
                <Lock className="w-5 h-5" />
                Locked ({lockoutMinutes}m)
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Sessions expire after 30 minutes of inactivity
            </p>
            <p className="text-xs text-gray-400">
              Don't have credentials? Contact your administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}