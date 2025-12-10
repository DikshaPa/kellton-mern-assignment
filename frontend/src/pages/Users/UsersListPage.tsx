import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography, Container, Alert } from '@mui/material';
import { Add, Visibility } from '@mui/icons-material';
import TableRenderer from '../../components/TableRenderer/TableRenderer';
import { RootState } from '../../redux/store';
import { fetchUsersStart, fetchUsersSuccess, fetchUsersFailure, deleteUser } from '../../redux/slices/usersSlice';
import { showToast } from '../../redux/slices/toastSlice';
import { usersAPI } from '../../api/auth';
import { useRole } from '../../hooks/useRole';

const UsersListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: users } = useSelector((state: RootState) => state.users);
  const { isAdmin, isEditor, isViewer, canCreateUsers, canEditUsers, canDeleteUsers } = useRole();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      dispatch(fetchUsersStart());
      const response = await usersAPI.getUsers();
      dispatch(fetchUsersSuccess(response.data));
    } catch (error) {
      dispatch(fetchUsersFailure('Failed to fetch users'));
      dispatch(showToast({
        message: 'Failed to fetch users',
        type: 'error'
      }));
    }
  };

  const handleDeleteUser = async (user: any) => {
    if (!canDeleteUsers) {
      dispatch(showToast({
        message: 'You do not have permission to delete users',
        type: 'error'
      }));
      return;
    }
    
    if (window.confirm(`Delete user ${user.name}?`)) {
      try {
        await usersAPI.deleteUser(user._id);
        dispatch(deleteUser(user._id));
        dispatch(showToast({
          message: 'User deleted successfully!',
          type: 'success'
        }));
      } catch (error) {
        console.error('Delete failed:', error);
        dispatch(showToast({
          message: 'Failed to delete user',
          type: 'error'
        }));
      }
    }
  };

  const handleEditUser = (user: any) => {
    if (!canEditUsers) {
      dispatch(showToast({
        message: 'You do not have permission to edit users',
        type: 'error'
      }));
      return;
    }
    navigate(`/users/${user._id}/edit`);
  };

  const userTableConfig = {
    headers: [
      { label: "Name", fieldName: "name", sortable: true },
      { label: "Email", fieldName: "email", sortable: true },
      { label: "Role", fieldName: "role", sortable: true },
      { label: "Department", fieldName: "department", sortable: true },
      { label: "Phone", fieldName: "phoneNumber" },
      { label: "Join Date", fieldName: "joinDate", sortable: true },
      { label: "Last Login", fieldName: "lastLogin", sortable: true },
      { label: "Status", fieldName: "isActive" },
    ],
    data: users,
    onEditClick: canEditUsers ? handleEditUser : undefined,
    onDeleteClick: canDeleteUsers ? handleDeleteUser : undefined,
    showActions: canEditUsers || canDeleteUsers,
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h4">Users Management</Typography>
            {isViewer && <Visibility color="action" />}
          </Box>
          {canCreateUsers && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/users/create')}
            >
              Add User
            </Button>
          )}
        </Box>
        
        {isViewer && (
          <Alert severity="info" sx={{ mb: 3 }}>
            You have read-only access to user information.
          </Alert>
        )}
        
        {isEditor && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            You can view and edit users, but cannot create or delete users.
          </Alert>
        )}
        
        <TableRenderer config={userTableConfig} />
      </Box>
    </Container>
  );
};

export default UsersListPage;