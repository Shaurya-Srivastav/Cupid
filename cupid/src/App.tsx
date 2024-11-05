// App.tsx
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

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<LoginPage />} />
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
            path="/date"
            element={<PrivateRoute element={<DatePage />} />}
          />
          <Route
            path="/date/:id"
            element={<PrivateRoute element={<DatePage />} />}
          />
          <Route
            path="/account"
            element={<PrivateRoute element={<AccountInfoPage />} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
