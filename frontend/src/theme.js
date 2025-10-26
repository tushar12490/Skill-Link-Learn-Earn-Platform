import { createTheme } from '@mui/material/styles';

const commonTypography = {
  fontFamily: '"Inter", "Segoe UI", sans-serif',
  h1: { fontWeight: 700 },
  h2: { fontWeight: 700 },
  h3: { fontWeight: 700 },
  h4: { fontWeight: 700 },
  button: { fontWeight: 600, textTransform: 'none' }
};

const lightPalette = {
  mode: 'light',
  primary: {
    main: '#0D9488',
    light: '#14B8A6',
    dark: '#0F766E',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#D97706',
    light: '#F59E0B',
    dark: '#B45309',
    contrastText: '#ffffff'
  },
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF'
  },
  text: {
    primary: '#1E293B',
    secondary: '#475569'
  },
  divider: '#E2E8F0'
};

const darkPalette = {
  mode: 'dark',
  primary: {
    main: '#14B8A6',
    light: '#2DD4BF',
    dark: '#0F766E',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
    contrastText: '#0F172A'
  },
  background: {
    default: '#0F172A',
    paper: '#1E293B'
  },
  text: {
    primary: '#F8FAFC',
    secondary: '#CBD5E1'
  },
  divider: '#334155'
};

const commonComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        transition: 'all 0.25s ease',
        boxShadow: 'none',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 8px 24px rgba(20, 184, 166, 0.25)'
        }
      }
    }
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        transition: 'background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease'
      }
    }
  },
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        transition: 'background-color 0.35s ease, color 0.35s ease, border 0.35s ease'
      }
    }
  },
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        transition: 'background-color 0.35s ease, color 0.35s ease'
      }
    }
  }
};

const createAppTheme = (mode = 'dark') => {
  const palette = mode === 'light' ? lightPalette : darkPalette;

  return createTheme({
    palette,
    typography: commonTypography,
    shape: {
      borderRadius: 16
    },
    components: commonComponents,
    transitions: {
      duration: {
        shortest: 120,
        shorter: 180,
        short: 220,
        standard: 260,
        complex: 320
      }
    }
  });
};

export default createAppTheme;
