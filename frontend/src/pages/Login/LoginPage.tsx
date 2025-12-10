import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Paper, Typography, Container, Alert, Card, CardContent } from '@mui/material';
import { Business, Security, Speed, Group } from '@mui/icons-material';
import { RootState } from '../../redux/store';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice';
import { authAPI } from '../../api/auth';

declare global {
  interface Window {
    google: any;
    handleCredentialResponse?: (response: any) => void;
  }
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleCredentialResponse = async (response: any) => {
    try {
      dispatch(loginStart());
      
      const result = await authAPI.googleLogin(response.credential);
      
      dispatch(loginSuccess({
        token: result.data.token,
        user: result.data.user,
      }));
      
      navigate('/dashboard');
    } catch (error: any) {
      dispatch(loginFailure(error.response?.data?.message || 'Google login failed'));
    }
  };

  useEffect(() => {
    window.handleCredentialResponse = handleCredentialResponse;

    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeGoogle();
      };
      document.head.appendChild(script);
    };

    const initializeGoogle = () => {
      if (window.google && window.google.accounts) {
        try {
          window.google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          const buttonDiv = document.getElementById('google-signin-button');
          if (buttonDiv) {
            window.google.accounts.id.renderButton(buttonDiv, {
              theme: 'outline',
              size: 'large',
              width: 320,
              text: 'signin_with',
              shape: 'rectangular',
            });
          }
        } catch (error) {
          console.error('Google initialization error:', error);
        }
      }
    };

    if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      loadGoogleScript();
    } else {
      initializeGoogle();
    }

    return () => {
      if (window.handleCredentialResponse) {
        window.handleCredentialResponse = undefined;
      }
    };
  }, []);

  const features = [
    { icon: <Security />, title: 'Secure Access', desc: 'Google OAuth Authentication' },
    { icon: <Speed />, title: 'Fast Performance', desc: 'Optimized Dashboard' },
    { icon: <Group />, title: 'User Management', desc: 'Complete CRUD Operations' },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Box display="flex" alignItems="center" justifyContent="center" gap={8}>
          {/* Left Side - Branding */}
          <Box sx={{ flex: 1, color: 'white', display: { xs: 'none', md: 'block' } }}>
            <Box display="flex" alignItems="center" mb={4}>
              <Business sx={{ fontSize: 60, mr: 2 }} />
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  MERN Dashboard
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Professional Admin Panel
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
              Powerful Features for Modern Teams
            </Typography>
            
            <Box>
              {features.map((feature, index) => (
                <Box key={index} display="flex" alignItems="center" mb={3}>
                  <Box sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    borderRadius: '50%', 
                    p: 1.5, 
                    mr: 3 
                  }}>
                    {feature.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {feature.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right Side - Login Form */}
          <Box sx={{ flex: { xs: 1, md: 0.6 } }}>
            <Paper elevation={24} sx={{ 
              p: 6, 
              borderRadius: 4,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Box textAlign="center" mb={4}>
                <Business sx={{ fontSize: 48, color: '#2c3e50', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                  Welcome Back
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Sign in to access your dashboard
                </Typography>
              </Box>
              
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Box sx={{ 
                mb: 3, 
                minHeight: '60px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                p: 2,
                border: '2px dashed #e9ecef',
                borderRadius: 2,
                backgroundColor: '#f8f9fa'
              }}>
                <div id="google-signin-button"></div>
              </Box>
              
              {loading && (
                <Box textAlign="center" mt={2}>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                    Authenticating...
                  </Typography>
                </Box>
              )}

              <Box mt={4} textAlign="center">
                <Typography variant="caption" color="textSecondary">
                  Secure authentication powered by Google OAuth 2.0
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;