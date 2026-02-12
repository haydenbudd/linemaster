import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  ShoppingCart,
  Search,
} from 'lucide-react';
import { Link } from '@/app/components/Router';

const NAV_LINKS = [
  { label: 'Products', href: '/products' },
  { label: 'Custom Solutions', href: '/custom-solutions' },
  { label: 'Industries', href: '/industries' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
] as const;

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      {/* Top utility bar */}
      <div className="hidden lg:block w-full bg-[#060E1A] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-9 text-xs text-white/50">
          <div className="flex items-center gap-6">
            <span>ISO 13485 Certified</span>
            <span className="text-white/20">|</span>
            <span>70+ Years of Precision Engineering</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="tel:8609741000"
              className="flex items-center gap-1.5 hover:text-white/80 transition-colors"
            >
              <Phone className="w-3 h-3" />
              (860) 974-1000
            </a>
            <Link
              href="/shop"
              className="flex items-center gap-1.5 hover:text-white/80 transition-colors"
            >
              <ShoppingCart className="w-3 h-3" />
              Shop
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <motion.header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? 'nav-glass shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span className="text-xl font-bold tracking-wider text-white transition-colors group-hover:text-[#2563EB]">
              LINEMASTER
            </span>
            <span className="text-[0.6rem] font-medium tracking-[0.25em] text-white/40 uppercase">
              Switch Corporation
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5 group"
              >
                {link.label}
                {(link.label === 'Products' || link.label === 'Industries') && (
                  <ChevronDown className="inline-block w-3.5 h-3.5 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              className="p-2 text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              aria-label="Search"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            <Link
              href="/request-quote"
              className="relative inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#3B82F6] transition-all duration-300 shadow-lg shadow-[#2563EB]/20 hover:shadow-[#2563EB]/40 hover:-translate-y-0.5"
            >
              Request Quote
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMobile}
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-[#0D1B30] border-l border-white/5 shadow-2xl lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 h-18 border-b border-white/5">
                <span className="text-lg font-bold tracking-wider text-white">
                  LINEMASTER
                </span>
                <button
                  onClick={closeMobile}
                  className="p-2 text-white/50 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer links */}
              <div className="px-4 py-6 space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center px-4 py-3.5 text-base font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      onClick={closeMobile}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="pt-4 border-t border-white/5 mt-4">
                  <Link
                    href="/shop"
                    className="flex items-center gap-2 px-4 py-3.5 text-base font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    onClick={closeMobile}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Shop
                  </Link>
                  <a
                    href="tel:8609741000"
                    className="flex items-center gap-2 px-4 py-3.5 text-base font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    onClick={closeMobile}
                  >
                    <Phone className="w-4 h-4" />
                    (860) 974-1000
                  </a>
                </div>

                <div className="pt-4">
                  <Link
                    href="/request-quote"
                    className="flex items-center justify-center w-full px-5 py-3 text-sm font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#3B82F6] transition-all shadow-lg shadow-[#2563EB]/20"
                    onClick={closeMobile}
                  >
                    Request Quote
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
