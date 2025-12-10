import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './redux/store';
import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import UsersListPage from './pages/Users/UsersListPage';
import UserFormPage from './pages/Users/UserFormPage';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { useUserStatus } from './hooks/useUserStatus';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50', // Dark blue-gray
      light: '#34495e',
      dark: '#1a252f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e74c3c', // Professional red
      light: '#ec7063',
      dark: '#c0392b',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
    success: {
      main: '#27ae60',
      light: '#58d68d',
      dark: '#1e8449',
    },
    error: {
      main: '#e74c3c',
      light: '#ec7063',
      dark: '#c0392b',
    },
    warning: {
      main: '#f39c12',
      light: '#f7dc6f',
      dark: '#d68910',
    },
    info: {
      main: '#3498db',
      light: '#85c1e9',
      dark: '#2980b9',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
      color: '#2c3e50',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#2c3e50',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#2c3e50',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#2c3e50',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#2c3e50',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      color: '#2c3e50',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          padding: '10px 24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

const RouterContent: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  
  // Check user status for automatic logout (inside Router context)
  useUserStatus();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {token && <Sidebar />}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />
          <Route path="/users" element={
            <PrivateRoute>
              <UsersListPage />
            </PrivateRoute>
          } />
          <Route path="/users/create" element={
            <PrivateRoute>
              <UserFormPage />
            </PrivateRoute>
          } />
          <Route path="/users/:id/edit" element={
            <PrivateRoute>
              <UserFormPage />
            </PrivateRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Box>
      <Toast />
    </Box>
  );
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <RouterContent />
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;