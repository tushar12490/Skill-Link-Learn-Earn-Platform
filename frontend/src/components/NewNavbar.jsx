import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import NavbarLogo from './NavbarLogo.jsx';

/**
 * Main Navigation Bar Component
 * Features:
 * - Responsive design with mobile menu
 * - Theme toggle (light/dark mode)
 * - Dynamic navigation based on auth state
 * - Smooth animations with Framer Motion
 * - Active route highlighting
 * - Text-only branding (no logo)
 */
export default function NewNavbar() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation links based on authentication state
  const navLinks = user
    ? [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Jobs', path: '/jobs' },
        { label: 'Courses', path: '/courses' },
        { label: 'Applications', path: '/applications' }
      ]
    : [
        { label: 'Home', path: '/' },
        { label: 'Hire a Freelancer', path: '/hire' },
        { label: 'Learn a Skill', path: '/learn' },
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' }
      ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg shadow-xl shadow-teal-500/10 dark:shadow-teal-400/5'
          : 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand - Shared Component */}
          <NavbarLogo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                    : 'text-neutral-700 dark:text-neutral-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle - Using dedicated component */}
            <ThemeToggle />

            {/* User Menu or Login */}
            {user ? (
              <div className="relative group">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-teal-600 dark:bg-teal-500 text-white font-medium hover:bg-teal-700 dark:hover:bg-teal-600 transition-all shadow-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold backdrop-blur-sm">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline">{user.name}</span>
                </motion.button>
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-sm transition-colors text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    👤 Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 text-sm transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/auth?mode=login">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(20, 184, 166, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-teal-600 dark:bg-teal-500 text-white font-semibold hover:bg-teal-700 dark:hover:bg-teal-600 transition-all shadow-lg"
                >
                  <span>Login / Sign Up</span>
                </motion.button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg transition-colors text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-lg'
                      : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-teal-600 dark:hover:text-teal-400'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link
                  to="/auth?mode=login"
                  className="block px-4 py-3 mt-4 rounded-xl text-sm font-semibold text-center bg-teal-600 dark:bg-teal-500 text-white hover:bg-teal-700 dark:hover:bg-teal-600 transition-all shadow-lg"
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
