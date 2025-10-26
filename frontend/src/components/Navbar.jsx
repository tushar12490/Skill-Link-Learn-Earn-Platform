import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Sparkles, LayoutDashboard, LogOut, ChevronDown, Users, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import Switch from '@mui/material/Switch';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/SkillLink Tech Education Website Logo.png';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' }
];

const exploreLinks = [
  {
    label: 'Freelancer marketplace',
    description: 'Meet vetted specialists ready to ship your ideas.',
    href: '/freelancers',
    icon: Users
  },
  {
    label: 'Learning hub',
    description: 'Curated courses to upskill your team at pace.',
    href: '/courses',
    icon: GraduationCap
  },
  {
    label: 'Success stories',
    description: 'See how founders are growing with SkillLink.',
    href: '/about',
    icon: Sparkles
  }
];

const QuickActionsBar = ({ user, onNavigate }) => {
  const isClient = user?.role === 'CLIENT';
  const isFreelancer = user?.role === 'FREELANCER';

  const actions = useMemo(() => {
    if (!user) return [];
    if (isClient) {
      return [
        { label: 'Post a brief', to: '/freelancers', icon: Sparkles },
        { label: 'Browse freelancers', to: '/freelancers', icon: LayoutDashboard },
        { label: 'Invite team', to: '/about', icon: Users }
      ];
    }
    if (isFreelancer) {
      return [
        { label: 'Update profile', to: '/freelancers', icon: Sparkles },
        { label: 'See open gigs', to: '/freelancers', icon: LayoutDashboard },
        { label: 'Launch course', to: '/courses', icon: GraduationCap }
      ];
    }
    return [
      { label: 'Explore courses', to: '/courses', icon: GraduationCap },
      { label: 'Meet mentors', to: '/about', icon: Users },
      { label: 'Dashboard overview', to: '/dashboard', icon: LayoutDashboard }
    ];
  }, [isClient, isFreelancer, user]);

  if (!actions.length) return null;

  return (
    <div className="border-t border-slate-200/70 bg-white/85 backdrop-blur-md dark:border-gray-700/60 dark:bg-gray-900/85">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3 text-sm sm:flex-nowrap sm:px-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          <Sparkles className="h-4 w-4 text-blue-500" aria-hidden />
          Quick actions
        </div>
        <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-1 sm:justify-end sm:pb-0 lg:flex-wrap lg:justify-start lg:overflow-visible">
          {actions.map(({ label, to, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              onClick={onNavigate}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900/80 dark:text-slate-300"
            >
              {Icon && <Icon className="h-4 w-4" />}
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ href, children, onClick }) => (
  <NavLink
    to={href}
    onClick={onClick}
    className={({ isActive }) =>
      [
        'relative text-sm font-semibold tracking-wide transition-colors duration-200',
        'hover:text-blue-600 dark:hover:text-blue-300',
        isActive ? 'text-blue-600 dark:text-blue-300' : 'text-slate-600 dark:text-slate-300'
      ].join(' ')
    }
  >
    {({ isActive }) => (
      <span className="inline-flex items-center gap-1">
        {children}
        {isActive && <span className="h-1 w-1 rounded-full bg-blue-500" />}
      </span>
    )}
  </NavLink>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [homeLink, aboutLink] = navLinks;
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
    setExploreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const close = (event) => {
      if (!(event.target.closest && event.target.closest('[data-user-menu]'))) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [menuOpen]);

  useEffect(() => {
    if (!exploreOpen) return undefined;
    const close = (event) => {
      if (!(event.target.closest && event.target.closest('[data-explore-menu]'))) {
        setExploreOpen(false);
      }
    };
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [exploreOpen]);

  const themeLabel = useMemo(() => (theme === 'dark' ? 'Dark mode' : 'Light mode'), [theme]);

  const userInitials = useMemo(() => {
    if (!user) return '';
    if (user.name) {
      const parts = user.name.trim().split(' ').filter(Boolean);
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }
    return user.email?.charAt(0)?.toUpperCase() ?? '?';
  }, [user]);

  const userFriendlyName = useMemo(() => {
    if (!user) return '';
    if (user.name) return user.name;
    return user.email;
  }, [user]);

  const userRoleLabel = useMemo(() => user?.role?.toLowerCase() ?? '', [user?.role]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? 'border-slate-200/70 bg-white/90 shadow-md backdrop-blur dark:border-gray-800/80 dark:bg-gray-900/90'
          : 'border-slate-200/60 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900'
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 sm:px-8">
        <Link
          to="/"
          className="group flex items-center gap-3 text-lg font-semibold tracking-tight text-slate-900 transition-colors duration-200 dark:text-slate-100"
        >
          <motion.img
            src={logo}
            alt="SkillLink logo"
            className="h-12 w-12 rounded-2xl border border-slate-200/60 bg-white object-contain p-1 shadow-sm transition-transform duration-300 group-hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, rotate: -2 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
          <span className="text-2xl font-black leading-none text-slate-900 dark:text-slate-100">
            Skill
            <span className="text-blue-600 dark:text-blue-400">Link</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <NavItem href={homeLink.href}>{homeLink.label}</NavItem>
          <div className="relative" data-explore-menu>
            <button
              type="button"
              onClick={() => setExploreOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-white hover:text-blue-600 dark:text-slate-300 dark:hover:border-blue-500/40 dark:hover:bg-gray-900/70 dark:hover:text-blue-300"
              aria-haspopup="true"
              aria-expanded={exploreOpen}
            >
              Explore
              <ChevronDown className={`h-4 w-4 transition-transform ${exploreOpen ? 'rotate-180' : ''}`} />
            </button>
            {exploreOpen && (
              <div className="absolute left-0 top-full mt-3 w-80 overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl ring-1 ring-black/5 dark:border-gray-700 dark:bg-gray-900">
                <div className="space-y-1">
                  {exploreLinks.map(({ label, description, href, icon: Icon }) => (
                    <Link
                      key={label}
                      to={href}
                      onClick={() => setExploreOpen(false)}
                      className="flex items-start gap-3 rounded-2xl px-4 py-3 transition hover:bg-slate-100 dark:hover:bg-gray-800"
                    >
                      {Icon && (
                        <span className="mt-0.5 rounded-full bg-blue-500/10 p-2 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">
                          <Icon className="h-4 w-4" />
                        </span>
                      )}
                      <span className="space-y-1 text-left">
                        <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400">{description}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <NavItem href={aboutLink.href}>{aboutLink.label}</NavItem>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-200 hover:text-blue-600 hover:shadow dark:border-gray-700 dark:bg-gray-900/80 dark:text-slate-200 dark:hover:text-blue-300"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <div className="relative" data-user-menu>
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900/80 dark:text-slate-200"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/10 text-xs font-semibold uppercase text-blue-600 dark:bg-blue-500/20 dark:text-blue-200">
                    {userInitials}
                  </span>
                  <span className="text-left leading-tight">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {userRoleLabel}
                    </span>
                    <span className="block text-sm text-slate-700 dark:text-slate-200">{userFriendlyName}</span>
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl ring-1 ring-black/5 dark:border-gray-700 dark:bg-gray-900">
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-gray-800"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/auth?mode=login"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-200 hover:text-blue-600 hover:shadow dark:border-gray-700 dark:bg-gray-900/80 dark:text-slate-200 dark:hover:text-blue-300"
              >
                Log in
              </Link>
              <Link
                to="/auth?mode=register"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-500"
              >
                <Sparkles className="h-4 w-4" />
                Sign up
              </Link>
            </>
          )}
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-200 dark:border-gray-700 dark:bg-gray-900/80 dark:text-slate-200">
            <Sun className="h-4 w-4" aria-hidden />
            <Switch
              size="small"
              checked={theme === 'dark'}
              onChange={toggleTheme}
              inputProps={{ 'aria-label': 'Toggle dark mode' }}
            />
            <Moon className="h-4 w-4" aria-hidden />
            <span className="sr-only">{themeLabel}</span>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200/70 bg-white p-2.5 text-slate-600 shadow-sm transition-all duration-200 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900/90 dark:text-slate-200 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="space-y-6 border-t border-slate-200 bg-white px-4 py-6 shadow-lg dark:border-gray-800 dark:bg-gray-900 md:hidden">
          <div className="flex flex-col gap-4">
            <NavItem href={homeLink.href} onClick={() => setMobileOpen(false)}>
              {homeLink.label}
            </NavItem>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Explore</p>
              <div className="flex flex-col gap-2 rounded-3xl border border-slate-200 bg-slate-50/60 p-3 dark:border-gray-800 dark:bg-gray-900/60">
                {exploreLinks.map(({ label, description, href }) => (
                  <Link
                    key={label}
                    to={href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-2xl bg-white px-3 py-3 text-left shadow-sm transition hover:bg-slate-100/70 dark:bg-gray-800/80 dark:hover:bg-gray-800"
                  >
                    <span className="block text-sm font-semibold text-slate-700 dark:text-slate-100">{label}</span>
                    <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{description}</span>
                  </Link>
                ))}
              </div>
            </div>
            <NavItem href={aboutLink.href} onClick={() => setMobileOpen(false)}>
              {aboutLink.label}
            </NavItem>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900/80 dark:text-slate-200"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-500"
                >
                  Log out
                </button>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-900/80">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600/10 text-sm font-semibold uppercase text-blue-600 dark:bg-blue-500/20 dark:text-blue-200">
                    {userInitials}
                  </span>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{userFriendlyName}</p>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{userRoleLabel}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/auth?mode=login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900/80 dark:text-slate-200"
                >
                  Log in
                </Link>
                <Link
                  to="/auth?mode=register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-500"
                >
                  Sign up
                </Link>
              </>
            )}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm dark:border-gray-700 dark:bg-gray-900/80 dark:text-slate-200">
              <span>Theme</span>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" aria-hidden />
                <Switch
                  size="small"
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                  inputProps={{ 'aria-label': 'Toggle dark mode' }}
                />
                <Moon className="h-4 w-4" aria-hidden />
              </div>
            </div>
          </div>
        </div>
      )}
      {user && (
        <QuickActionsBar
          user={user}
          onNavigate={() => {
            setMenuOpen(false);
            setExploreOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Navbar;
