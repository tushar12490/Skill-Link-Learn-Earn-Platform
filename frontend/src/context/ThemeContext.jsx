import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'skilllink-theme';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {}
});

/**
 * Get initial theme preference from localStorage or system preference
 */
const getPreferredTheme = () => {
  if (typeof window === 'undefined') {
    return 'light';
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  return media.matches ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getPreferredTheme);

  /**
   * Apply theme to document root and persist to localStorage
   * This ensures Tailwind's dark: classes work properly
   */
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove both classes first to avoid conflicts
    root.classList.remove('dark', 'light');
    
    // Add the current theme class
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
    
    // Store for next visit
    window.localStorage.setItem(STORAGE_KEY, theme);
    
    // Optional: Add data attribute for CSS targeting
    root.dataset.theme = theme;
  }, [theme]);

  /**
   * Smooth toggle with slight delay for visual feedback
   */
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
