import { RotateCcw, Settings, Moon, Sun, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import LiquidGlass from 'liquid-glass-react';

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
    <header className="sticky top-0 z-50">
      <div className="mx-auto px-2 sm:px-4 pt-2">
        <LiquidGlass
          cornerRadius={20}
          padding="0 16px"
          blurAmount={0.5}
          saturation={160}
          displacementScale={30}
          overLight={!isDark}
          className="w-full"
          style={{ minHeight: 52 }}
        >
          <div className="flex items-center justify-between h-[52px]">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="https://linemaster.com/wp-content/uploads/2024/10/linemaster-logo.jpg"
                alt="Linemaster"
                className="h-7 dark:brightness-0 dark:invert"
              />
              <div className="hidden sm:block h-4 w-px bg-foreground/10" />
              <span className="hidden sm:block text-sm font-medium text-muted-foreground tracking-tight">
                Product Finder
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                title={isDark ? 'Light mode' : 'Dark mode'}
              >
                {isDark ? (
                  <Sun className="w-[18px] h-[18px] text-muted-foreground" />
                ) : (
                  <Moon className="w-[18px] h-[18px] text-muted-foreground" />
                )}
              </button>
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                  title="Refresh product data"
                >
                  <RefreshCw className="w-[18px] h-[18px] text-muted-foreground" />
                </button>
              )}
              <a
                href="#/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                title="Admin Panel"
              >
                <Settings className="w-[18px] h-[18px] text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Admin</span>
              </a>
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all duration-200 text-sm font-medium ml-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </LiquidGlass>
      </div>
    </header>
  );
}
