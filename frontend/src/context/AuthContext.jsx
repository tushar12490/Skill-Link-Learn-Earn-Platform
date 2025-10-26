import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { getProfile, login, register, setAuthTokenStorage, clearAuthTokenStorage } from '../services/authService.js';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('skilllink_token');
    if (!stored) {
      setLoading(false);
      return;
    }

    const bootstrap = async () => {
      try {
        setToken(stored);
        const profile = await getProfile(stored);
        setUser(profile);
      } catch (error) {
        console.error('Failed to bootstrap user', error);
        clearAuthTokenStorage();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const logout = useCallback(() => {
    clearAuthTokenStorage();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const handleForcedLogout = () => {
      logout();
    };
    window.addEventListener('skilllink:logout', handleForcedLogout);
    return () => {
      window.removeEventListener('skilllink:logout', handleForcedLogout);
    };
  }, [logout]);

  const handleLogin = async (credentials) => {
    const { token: issuedToken, user: authUser } = await login(credentials);
    setAuthTokenStorage(issuedToken);
    setToken(issuedToken);
    setUser(authUser);
  };

  const handleRegister = async (data) => {
    // Register the user but don't auto-login
    // User should be redirected to login page to sign in
    const registered = await register(data);
    return registered;
  };

  const value = useMemo(
    () => ({ user, token, loading, login: handleLogin, register: handleRegister, logout }),
    [user, token, loading, logout]
  );

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
