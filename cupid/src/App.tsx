// src/App.tsx

import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme/theme';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import BookDatePage from './pages/BookDatePage';
import LoadingPage from './pages/LoadingPage';
import DatePage from './pages/DatePage';
import AccountInfoPage from './pages/AccountInfoPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <ChakraProvider theme={theme}>
      <ErrorBoundary>
        <Router>
          <Routes>
            {/* If the user is not authenticated, allow access to /login and /signup */}
            <Route
              path="/signup"
              element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/dashboard" replace />}
            />
            <Route
              path="/login"
              element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />}
            />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={<PrivateRoute element={<DashboardPage />} />}
            />
            <Route
              path="/book-date"
              element={<PrivateRoute element={<BookDatePage />} />}
            />
            <Route
              path="/loading"
              element={<PrivateRoute element={<LoadingPage />} />}
            />
            <Route
              path="/date/:dateId"
              element={<PrivateRoute element={<DatePage />} />}
            />
            <Route
              path="/account"
              element={<PrivateRoute element={<AccountInfoPage />} />}
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </ChakraProvider>
  );
};

export default App;
