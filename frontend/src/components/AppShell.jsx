import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightModeRounded';
import DarkModeIcon from '@mui/icons-material/DarkModeRounded';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme as useCustomTheme } from '../context/ThemeContext.jsx';
import NavbarLogo from './NavbarLogo.jsx';

const AppShell = ({ children }) => {
  const { user, logout } = useAuth();
  const userRole = user?.role?.toUpperCase();
  const location = useLocation();
  const theme = useTheme();
  const { theme: currentTheme, toggleTheme } = useCustomTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const isDarkMode = currentTheme === 'dark';

  const navLinks = useMemo(() => {
    if (!user) {
      return [];
    }

    const links = [{ label: 'Dashboard', path: '/dashboard' }];

    if (userRole === 'CLIENT') {
      links.push({ label: 'Jobs', path: '/jobs' });
      links.push({ label: 'Courses', path: '/courses' });
      links.push({ label: 'Profile', path: '/profile' });
      return links;
    }

    if (userRole === 'FREELANCER') {
      links.push({ label: 'Jobs', path: '/jobs' });
      links.push({ label: 'Applications', path: '/applications' });
      links.push({ label: 'Courses', path: '/courses' });
      links.push({ label: 'Profile', path: '/profile' });
      return links;
    }

    links.push({ label: 'Courses', path: '/courses' });
    links.push({ label: 'Profile', path: '/profile' });
    return links;
  }, [user, userRole]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logoutAndClose = () => {
    handleMenuClose();
    logout();
  };

  const renderNavButtons = () => (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
        <IconButton color="inherit" onClick={toggleTheme} sx={{ transition: theme.transitions.create(['transform']), '&:active': { transform: 'scale(0.92)' } }}>
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>
      {navLinks.map((link) => (
        <Button
          key={link.path}
          component={RouterLink}
          to={link.path}
          color={location.pathname === link.path ? 'secondary' : 'inherit'}
        >
          {link.label}
        </Button>
      ))}
      {user ? (
        <Button onClick={logout} color="secondary" variant="contained">
          Logout
        </Button>
      ) : (
        <Button component={RouterLink} to="/auth" variant="contained" color="secondary">
          Sign In
        </Button>
      )}
    </Stack>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        transition: theme.transitions.create(['background-color'], {
          duration: theme.transitions.duration.standard
        })
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          transition: theme.transitions.create(['background-color', 'border-color'], {
            duration: theme.transitions.duration.standard
          })
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <NavbarLogo />
          </Stack>
          {isMobile ? (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} keepMounted>
                <MenuItem onClick={() => { toggleTheme(); handleMenuClose(); }}>
                  Toggle {isDarkMode ? 'Light' : 'Dark'} mode
                </MenuItem>
                <Divider sx={{ my: 1 }} />
                {navLinks.map((link) => (
                  <MenuItem key={link.path} component={RouterLink} to={link.path} onClick={handleMenuClose}>
                    {link.label}
                  </MenuItem>
                ))}
                {user ? (
                  <MenuItem onClick={logoutAndClose}>Logout</MenuItem>
                ) : (
                  <MenuItem component={RouterLink} to="/auth" onClick={handleMenuClose}>
                    Sign In
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : (
            renderNavButtons()
          )}
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          mx: 'auto',
          maxWidth: '1280px',
          px: { xs: 2, sm: 3, lg: 4 },
          py: { xs: 4, md: 6 },
          transition: theme.transitions.create(['background-color', 'color', 'transform'], {
            duration: theme.transitions.duration.complex
          })
        }}
      >
        {children}
      </Box>
      <Box
        component="footer"
        sx={{
          mt: 'auto',
          py: 4,
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          transition: theme.transitions.create(['background-color', 'border-color'], {
            duration: theme.transitions.duration.standard
          })
        }}
      >
        <Box
          sx={{
            mx: 'auto',
            maxWidth: '1280px',
            px: { xs: 2, sm: 3, lg: 4 }
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Typography color="text.secondary">
              © {new Date().getFullYear()} SkillLink. Empowering careers through work & learning.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Typography component={RouterLink} to="/courses" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Courses
              </Typography>
              <Typography component={RouterLink} to="/jobs" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Jobs
              </Typography>
              <Typography component="a" href="mailto:support@skilllink.com" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Contact
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

AppShell.propTypes = {
  children: PropTypes.node.isRequired
};

export default AppShell;
