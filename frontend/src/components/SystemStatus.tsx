import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Grid,
  LinearProgress
} from '@mui/material';
import { 
  CheckCircle, 
  Storage, 
  Speed, 
  Memory 
} from '@mui/icons-material';
import { systemAPI } from '../api/system';

interface SystemStatus {
  system: {
    status: string;
    uptime: string;
    memory: { used: number; total: number };
  };
  database: {
    status: string;
    collections: number;
  };
  users: {
    total: number;
    active: number;
    activityRate: string;
  };
  services: {
    api: string;
    auth: string;
    email: string;
  };
}

const SystemStatus: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await systemAPI.getStatus();
        setStatus(response.data);
      } catch (error) {
        console.error('Failed to fetch system status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading || !status) {
    return <LinearProgress />;
  }

  const memoryUsage = (status.system.memory.used / status.system.memory.total) * 100;

  return (
    <Grid container spacing={3}>
      {/* System Status */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <CheckCircle color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">System Status</Typography>
            </Box>
            <Box mb={1}>
              <Chip 
                label={status.system.status} 
                color="success" 
                size="small" 
              />
            </Box>
            <Typography variant="body2" color="textSecondary">
              Uptime: {status.system.uptime}
            </Typography>
            <Box mt={2}>
              <Typography variant="body2">
                Memory: {status.system.memory.used}MB / {status.system.memory.total}MB
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={memoryUsage} 
                sx={{ mt: 1 }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* User Activity */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Speed color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">User Activity Rate</Typography>
            </Box>
            <Typography variant="h4" color="primary">
              {status.users.activityRate}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {status.users.active} of {status.users.total} users active
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Database Status */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Storage color="info" sx={{ mr: 1 }} />
              <Typography variant="h6">Database</Typography>
            </Box>
            <Chip 
              label={status.database.status} 
              color={status.database.status === 'Connected' ? 'success' : 'error'} 
              size="small" 
            />
            <Typography variant="body2" color="textSecondary" mt={1}>
              Collections: {status.database.collections}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Services Status */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Memory color="secondary" sx={{ mr: 1 }} />
              <Typography variant="h6">All Services</Typography>
            </Box>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip label={`API: ${status.services.api}`} color="success" size="small" />
              <Chip label={`Auth: ${status.services.auth}`} color="success" size="small" />
              <Chip label={`Email: ${status.services.email}`} color="success" size="small" />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SystemStatus;