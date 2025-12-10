import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  People,
  ExitToApp,
  Business,
} from '@mui/icons-material';
import { RootState } from '../redux/store';
import { logout } from '../redux/slices/authSlice';

const DRAWER_WIDTH = 280;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Users Management', icon: <People />, path: '/users' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#2c3e50',
          color: '#ffffff',
          borderRight: 'none',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#34495e' }}>
        <Business sx={{ fontSize: 40, color: '#3498db', mb: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff', mb: 0.5 }}>
          MERN Dashboard
        </Typography>
        <Typography variant="caption" sx={{ color: '#bdc3c7' }}>
          Admin Panel
        </Typography>
      </Box>
      
      <Divider sx={{ borderColor: '#34495e' }} />
      
      {/* User Info */}
      {user && (
        <Box sx={{ p: 3, backgroundColor: '#34495e' }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar 
              sx={{ 
                bgcolor: '#3498db', 
                width: 48, 
                height: 48, 
                mr: 2,
                fontSize: '1.2rem',
                fontWeight: 600
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#ffffff' }}>
                {user.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#bdc3c7' }}>
                {user.email}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={user.role?.toUpperCase()} 
            size="small" 
            sx={{ 
              backgroundColor: '#3498db', 
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.75rem'
            }} 
          />
        </Box>
      )}
      
      <Divider sx={{ borderColor: '#34495e' }} />
      
      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1, px: 2 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: '#3498db',
                  '&:hover': {
                    backgroundColor: '#2980b9',
                  },
                },
                '&:hover': {
                  backgroundColor: '#34495e',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  fontSize: '0.95rem'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      {/* Logout Button */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            backgroundColor: '#e74c3c',
            '&:hover': {
              backgroundColor: '#c0392b',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#ffffff', minWidth: 40 }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.95rem'
            }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;