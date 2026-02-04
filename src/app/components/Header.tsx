import { RotateCcw, Settings, Moon, Sun, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onReset: () => void;
  onRefresh?: () => void;
}

export function Header({ onReset, onRefresh }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="https://linemaster.com/wp-content/uploads/2024/10/linemaster-logo.jpg"
              alt="Linemaster"
              className="h-9 dark:brightness-0 dark:invert"
            />
            <div className="hidden sm:block h-6 w-px bg-border" />
            <span className="hidden sm:block text-sm font-semibold text-muted-foreground">
              Product Finder
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </button>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                title="Refresh product data"
              >
                <RefreshCw className="w-5 h-5 text-foreground" />
              </button>
            )}
            <a
              href="#/admin"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '/admin';
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
              title="Admin Panel"
            >
              <Settings className="w-5 h-5 text-foreground" />
              <span className="text-sm font-semibold hidden sm:inline">Admin</span>
            </a>
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}