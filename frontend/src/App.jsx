import { lazy, Suspense, useMemo } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { useTheme } from './context/ThemeContext.jsx';
import createAppTheme from './theme.js';
import NewNavbar from './components/NewNavbar.jsx';
import Footer from './components/Footer.jsx';

// New pages for cleaner structure
const NewHomePage = lazy(() => import('./pages/NewHome.jsx'));
const HirePage = lazy(() => import('./pages/Hire.jsx'));
const LearnPage = lazy(() => import('./pages/Learn.jsx'));
const AboutPage = lazy(() => import('./pages/About.jsx'));
const ContactPage = lazy(() => import('./pages/Contact.jsx'));
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'));

// Protected pages (authenticated users only)
const DashboardPage = lazy(() => import('./pages/Dashboard.jsx'));
const JobsPage = lazy(() => import('./pages/JobsPage.jsx'));
const CoursesPage = lazy(() => import('./pages/CoursesPage.jsx'));
const ApplicationsPage = lazy(() => import('./pages/ApplicationsPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));

const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" aria-label="Loading" />
  </div>
);

const App = () => {
  const location = useLocation();
  const { theme } = useTheme();
  
  // Create MUI theme based on current theme mode
  const muiTheme = useMemo(() => createAppTheme(theme), [theme]);
  
  // Check if current route is a protected route (authenticated pages)
  const isProtectedRoute = ['/dashboard', '/jobs', '/courses', '/applications', '/profile'].includes(location.pathname);

  return (
    <AuthProvider>
      <MUIThemeProvider theme={muiTheme}>
        <CssBaseline />
        <div className="min-h-screen transition-colors duration-300">
          {/* Only show NewNavbar on public routes - protected routes use AppShell's navbar */}
          {!isProtectedRoute && <NewNavbar />}
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <NewHomePage />
                </Suspense>
              }
            />
            <Route
              path="/hire"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <HirePage />
                </Suspense>
              }
            />
            <Route
              path="/learn"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <LearnPage />
                </Suspense>
              }
            />
            <Route
              path="/about"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AboutPage />
                </Suspense>
              }
            />
            <Route
              path="/contact"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ContactPage />
                </Suspense>
              }
            />
            <Route
              path="/auth"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AuthPage />
                </Suspense>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                </Suspense>
              }
            />
            <Route
              path="/jobs"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ProtectedRoute>
                    <JobsPage />
                  </ProtectedRoute>
                </Suspense>
              }
            />
            <Route
              path="/courses"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ProtectedRoute>
                    <CoursesPage />
                  </ProtectedRoute>
                </Suspense>
              }
            />
            <Route
              path="/applications"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ProtectedRoute>
                    <ApplicationsPage />
                  </ProtectedRoute>
                </Suspense>
              }
            />
            <Route
              path="/profile"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                </Suspense>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
          {/* Only show Footer on public routes - protected routes use AppShell's footer */}
          {!isProtectedRoute && <Footer />}
        </div>
      </MUIThemeProvider>
    </AuthProvider>
  );
};

export default App;
