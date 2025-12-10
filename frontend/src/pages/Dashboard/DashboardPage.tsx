import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Container,
  Avatar,
  Chip,
  LinearProgress,
  Alert
} from '@mui/material';
import { 
  People, 
  PersonAdd, 
  PersonOff, 
  TrendingUp,
  Business,
  Assessment,
  ManageAccounts,
  Settings,
  Assessment as ReportsIcon,
  Visibility
} from '@mui/icons-material';
import { usersAPI } from '../../api/auth';
import SystemStatus from '../../components/SystemStatus';
import { useRole } from '../../hooks/useRole';

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  growth?: {
    total: string;
    active: string;
    inactive: string;
  };
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isEditor, isViewer, canCreateUsers, canViewUsers, canAccessSettings, canViewReports } = useRole();
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUsersSummary();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, trend, description }: any) => (
    <Card sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      border: `1px solid ${color}20`,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {description}
            </Typography>
          </Box>
          <Avatar sx={{ 
            bgcolor: color, 
            width: 56, 
            height: 56,
            boxShadow: `0 4px 12px ${color}40`
          }}>
            {icon}
          </Avatar>
        </Box>
        
        <Typography variant="h3" sx={{ 
          fontWeight: 700, 
          color: '#2c3e50', 
          mb: 1,
          fontSize: '2.5rem'
        }}>
          {loading ? '...' : value}
        </Typography>
        
        {trend && (
          <Box display="flex" alignItems="center">
            <TrendingUp sx={{ fontSize: 16, color: '#27ae60', mr: 0.5 }} />
            <Typography variant="caption" sx={{ color: '#27ae60', fontWeight: 600 }}>
              {trend}
            </Typography>
          </Box>
        )}
        
        {loading && (
          <LinearProgress sx={{ mt: 2, borderRadius: 1 }} />
        )}
      </CardContent>
    </Card>
  );

  const activePercentage = stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 : 0;

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center">
              <Assessment sx={{ fontSize: 32, color: '#2c3e50', mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                  Dashboard Overview
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Monitor your system performance and user analytics
                </Typography>
              </Box>
            </Box>
            <Chip 
              label={`${user?.role?.toUpperCase()} ACCESS`} 
              color={isAdmin ? 'error' : isEditor ? 'warning' : 'info'} 
              sx={{ fontWeight: 600 }}
            />
          </Box>
          {isViewer && (
            <Alert severity="info" sx={{ mb: 2 }}>
              You have viewer access. Contact admin for additional permissions.
            </Alert>
          )}
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={4} mb={4}>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<People fontSize="large" />}
              color="#3498db"
              trend={stats.growth?.total || '+0% this month'}
              description="All registered users"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Active Users"
              value={stats.activeUsers}
              icon={<PersonAdd fontSize="large" />}
              color="#27ae60"
              trend={stats.growth?.active || '+0% this week'}
              description="Currently active users"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Inactive Users"
              value={stats.inactiveUsers}
              icon={<PersonOff fontSize="large" />}
              color="#e74c3c"
              trend={stats.growth?.inactive || '-0% this week'}
              description="Inactive user accounts"
            />
          </Grid>
        </Grid>

        {/* Dynamic System Status - Admin/Editor Only */}
        {(isAdmin || isEditor) && (
          <Box mb={4}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c3e50', mb: 3 }}>
              Real-time System Monitoring
            </Typography>
            <SystemStatus />
          </Box>
        )}

        {/* Quick Actions */}
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', mb: 3 }}>
                  Quick Actions
                </Typography>
                
                <Grid container spacing={2}>
                  {/* Manage Users - Admin Only */}
                  {canCreateUsers && (
                    <Grid item xs={12} md={4}>
                      <Box 
                        onClick={() => navigate('/users')}
                        sx={{ 
                          p: 3, 
                          backgroundColor: '#f8f9fa', 
                          borderRadius: 2,
                          border: '1px solid #e9ecef',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'center',
                          '&:hover': {
                            backgroundColor: '#3498db15',
                            borderColor: '#3498db',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <ManageAccounts sx={{ fontSize: 40, color: '#3498db', mb: 1 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Manage Users
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Add, edit, or remove user accounts
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  {/* View Users - Editor/Viewer */}
                  {(isEditor || isViewer) && canViewUsers && (
                    <Grid item xs={12} md={4}>
                      <Box 
                        onClick={() => navigate('/users')}
                        sx={{ 
                          p: 3, 
                          backgroundColor: '#f8f9fa', 
                          borderRadius: 2,
                          border: '1px solid #e9ecef',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'center',
                          '&:hover': {
                            backgroundColor: '#3498db15',
                            borderColor: '#3498db',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <Visibility sx={{ fontSize: 40, color: '#3498db', mb: 1 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          View Users
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          View and edit user information
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  {/* System Settings - Admin Only */}
                  {canAccessSettings && (
                    <Grid item xs={12} md={4}>
                      <Box 
                        onClick={() => alert('Settings feature coming soon!')}
                        sx={{ 
                          p: 3, 
                          backgroundColor: '#f8f9fa', 
                          borderRadius: 2,
                          border: '1px solid #e9ecef',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'center',
                          '&:hover': {
                            backgroundColor: '#f39c1215',
                            borderColor: '#f39c12',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <Settings sx={{ fontSize: 40, color: '#f39c12', mb: 1 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          System Settings
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Configure application settings
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  {/* View Reports - Admin/Editor */}
                  {canViewReports && (
                    <Grid item xs={12} md={4}>
                      <Box 
                        onClick={() => alert('Reports feature coming soon!')}
                        sx={{ 
                          p: 3, 
                          backgroundColor: '#f8f9fa', 
                          borderRadius: 2,
                          border: '1px solid #e9ecef',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'center',
                          '&:hover': {
                            backgroundColor: '#9b59b615',
                            borderColor: '#9b59b6',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <ReportsIcon sx={{ fontSize: 40, color: '#9b59b6', mb: 1 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          View Reports
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Generate and download reports
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  {/* Viewer Message */}
                  {isViewer && (
                    <Grid item xs={12}>
                      <Box 
                        sx={{ 
                          p: 4, 
                          backgroundColor: '#e3f2fd', 
                          borderRadius: 2,
                          border: '1px solid #2196f3',
                          textAlign: 'center'
                        }}
                      >
                        <Visibility sx={{ fontSize: 48, color: '#2196f3', mb: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1976d2' }}>
                          Viewer Dashboard
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          You have read-only access to view system information and user statistics.
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardPage;