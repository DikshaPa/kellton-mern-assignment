import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Paper, Box, Alert } from '@mui/material';
import FormRenderer from '../../components/FormRenderer/FormRenderer';
import { usersAPI } from '../../api/auth';
import { addUser, updateUser } from '../../redux/slices/usersSlice';
import { showToast } from '../../redux/slices/toastSlice';
import { RootState } from '../../redux/store';

const userFormSchema = {
  title: 'User Details',
  fields: [
    { 
      fieldName: 'name', 
      label: 'Full Name', 
      type: 'text' as const,
      validation: { required: true } 
    },
    { 
      fieldName: 'email', 
      label: 'Email', 
      type: 'text' as const, 
      validation: { required: true } 
    },
    { 
      fieldName: 'role', 
      label: 'Role', 
      type: 'select' as const, 
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' }
      ], 
      validation: { required: true }
    },
    { 
      fieldName: 'department', 
      label: 'Department', 
      type: 'select' as const, 
      options: [
        { label: 'IT', value: 'IT' },
        { label: 'HR', value: 'HR' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Operations', value: 'Operations' }
      ], 
      validation: { required: true }
    },
    { 
      fieldName: 'phoneNumber', 
      label: 'Phone Number', 
      type: 'text' as const,
      validation: { required: true } 
    },
    { 
      fieldName: 'joinDate', 
      label: 'Join Date', 
      type: 'date' as const,
      validation: { required: true } 
    },
    { 
      fieldName: 'isActive', 
      label: 'Active Status', 
      type: 'boolean' as const 
    }
  ]
};

const UserFormPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [initialData, setInitialData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { list: users } = useSelector((state: RootState) => state.users);

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit && id) {
      const existingUser = users.find(u => u._id === id);
      if (existingUser) {
        setInitialData({
          ...existingUser,
          joinDate: new Date(existingUser.joinDate).toISOString().split('T')[0]
        });
      } else {
        fetchUser();
      }
    }
  }, [id, isEdit, users]);

  const fetchUser = async () => {
    try {
      const response = await usersAPI.getUsers();
      const user = response.data.find((u: any) => u._id === id);
      if (user) {
        setInitialData({
          ...user,
          joinDate: new Date(user.joinDate).toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      setLoading(true);
      setError('');
      
      // Convert date format for backend
      const submitData = {
        ...formData,
        joinDate: formData.joinDate ? new Date(formData.joinDate).toISOString().split('T')[0].split('-').reverse().join('-') : formData.joinDate
      };
      
      if (isEdit) {
        const response = await usersAPI.updateUser(id!, submitData);
        dispatch(updateUser(response.data));
        dispatch(showToast({
          message: 'User updated successfully!',
          type: 'success'
        }));
      } else {
        const response = await usersAPI.createUser(submitData);
        dispatch(addUser(response.data));
        dispatch(showToast({
          message: 'User created successfully!',
          type: 'success'
        }));
      }
      
      navigate('/users');
    } catch (error: any) {
      console.error('Save failed:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
        dispatch(showToast({
          message: error.response.data.message,
          type: 'error'
        }));
      } else {
        const errorMsg = `Failed to ${isEdit ? 'update' : 'create'} user. Please try again.`;
        setError(errorMsg);
        dispatch(showToast({
          message: errorMsg,
          type: 'error'
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <FormRenderer
            schema={{
              ...userFormSchema,
              title: isEdit ? 'Edit User' : 'Create User'
            }}
            initialData={initialData}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default UserFormPage;