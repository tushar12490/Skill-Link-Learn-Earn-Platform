import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { CssBaseline, ThemeProvider } from '@mui/material';
import createAppTheme from '../theme.js';

const ThemeModeContext = createContext({
  mode: 'dark',
  toggleMode: () => {},
  setMode: () => {}
});

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState('dark');

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const value = useMemo(() => ({ mode, setMode, toggleMode }), [mode, toggleMode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

ThemeModeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useThemeMode = () => useContext(ThemeModeContext);

export default ThemeModeContext;
