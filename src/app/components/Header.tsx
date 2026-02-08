import { RotateCcw, Settings, Moon, Sun, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
const logoLight = '/Linemaster Blue Corporate Logo 2.png';
const logoDark = '/white linemaster logo.png';

interface HeaderProps {
  onReset: () => void;
}

export function Header({ onReset }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={isDark ? logoDark : logoLight}
              alt="Linemaster"
              className="h-7"
            />
            <div className="hidden sm:block h-4 w-px bg-border" />
            <span className="hidden sm:block text-sm font-medium text-muted-foreground tracking-tight">
              Product Finder
            </span>
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? (
                <Sun className="w-[18px] h-[18px] text-muted-foreground" />
              ) : (
                <Moon className="w-[18px] h-[18px] text-muted-foreground" />
              )}
            </button>
            <button
              onClick={() => { window.location.hash = '/admin'; }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
              title="Admin Panel"
            >
              <Settings className="w-[18px] h-[18px] text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Admin</span>
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium ml-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-card border border-border shadow-xl overflow-hidden z-50">
                <div className="py-1">
                  <button
                    onClick={() => { toggleTheme(); setMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  <button
                    onClick={() => { window.location.hash = '/admin'; setMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors text-left"
                  >
                    <Settings className="w-4 h-4" />
                    Admin Panel
                  </button>
                  <div className="border-t border-border my-1" />
                  <button
                    onClick={() => { onReset(); setMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset Wizard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
