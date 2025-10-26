import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: 'CLIENT'
};

const getModeFromSearch = (search) => {
  if (!search) return 'login';
  const params = new URLSearchParams(search);
  const mode = params.get('mode');
  return mode === 'register' ? 'register' : 'login';
};

const AuthPage = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialTab = useMemo(() => getModeFromSearch(location.search), [location.search]);
  const [tab, setTab] = useState(initialTab);
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (value) => {
    setTab(value);
    setError(null);
    navigate(`/auth?mode=${value}`, { replace: true, state: location.state });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'role' ? value.toUpperCase() : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (tab === 'login') {
        await login({ email: form.email, password: form.password });
        navigate(from, { replace: true });
      } else {
        // Register user then redirect to login page
        await register(form);
        setError(null);
        setForm(initialForm);
        // Switch to login tab and show success message
        setTab('login');
        navigate('/auth?mode=login', { replace: true });
        // You could also show a success toast here
        alert('Account created successfully! Please log in.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };
  const tabClasses = (value) =>
    `flex-1 py-2 text-sm font-semibold uppercase tracking-wide transition-all duration-300 border-b-2 ${
      tab === value
        ? 'border-teal text-teal'
        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-teal'
    }`;

  const inputClasses =
    'w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal transition-all duration-300';

  return (
    <div className="mx-auto mt-10 w-full max-w-md px-4 py-12 transition-all duration-300 sm:px-0">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6 text-center"
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-teal">Welcome to SkillLink</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{tab === 'login' ? 'Log in' : 'Create account'}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {tab === 'login'
            ? 'Enter your credentials to access your personalized dashboard.'
            : 'Join the SkillLink ecosystem to collaborate, mentor, or learn with the community.'}
        </p>
      </motion.div>

      <div className="mt-10 overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-teal/10 transition-all duration-300 dark:bg-gray-900 sm:p-8">
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-gray-100/70 p-1 dark:bg-gray-800/60">
          <button type="button" className={tabClasses('login')} onClick={() => handleTabChange('login')}>
            Login
          </button>
          <button type="button" className={tabClasses('register')} onClick={() => handleTabChange('register')}>
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-left text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 transition-all duration-300" noValidate>
          {tab === 'register' && (
            <div className="space-y-1 text-left">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
          )}

          <div className="space-y-1 text-left">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email *</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password *</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          {tab === 'register' && (
            <div className="space-y-1 text-left">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className={`${inputClasses} cursor-pointer`}
              >
                <option value="CLIENT">Client</option>
                <option value="FREELANCER">Freelancer / Mentor</option>
                <option value="LEARNER">Learner</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-teal py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:bg-teal-dark focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
          >
            {tab === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
