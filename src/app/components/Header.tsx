import { RotateCcw, Settings, Moon, Sun, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { GlassCard } from '@/app/components/GlassCard';
const logoLight = '/linemaster-logo.png';
const logoDark = '/linemaster-logo-white.png';

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
    <header className="sticky top-0 z-50">
      <div className="mx-auto px-2 sm:px-4 pt-2">
        <GlassCard
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
                src={isDark ? logoDark : logoLight}
                alt="Linemaster"
                className="h-7"
              />
              <div className="hidden sm:block h-4 w-px bg-foreground/10" />
              <span className="hidden sm:block text-sm font-medium text-muted-foreground tracking-tight">
                Product Finder
              </span>
            </div>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-0.5">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-all duration-200"
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-all duration-200"
                title="Admin Panel"
              >
                <Settings className="w-[18px] h-[18px] text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Admin</span>
              </button>
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 active:opacity-80 transition-all duration-200 text-sm font-medium ml-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-all duration-200"
                aria-label="Menu"
              >
                {menuOpen ? (
                  <X className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Menu className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-background/95 backdrop-blur-xl border border-foreground/10 shadow-xl overflow-hidden z-50">
                  <div className="py-1">
                    <button
                      onClick={() => { toggleTheme(); setMenuOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-foreground hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors"
                    >
                      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      {isDark ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button
                      onClick={() => { window.location.hash = '/admin'; setMenuOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-foreground hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors text-left"
                    >
                      <Settings className="w-4 h-4" />
                      Admin Panel
                    </button>
                    <div className="border-t border-foreground/5 my-1" />
                    <button
                      onClick={() => { onReset(); setMenuOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-primary hover:bg-primary/5 active:bg-primary/10 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset Wizard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </header>
  );
}
