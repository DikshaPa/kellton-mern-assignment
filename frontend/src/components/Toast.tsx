import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { hideToast, clearToast } from '../redux/slices/toastSlice';

const Toast: React.FC = () => {
  const dispatch = useDispatch();
  const { message, type, open } = useSelector((state: RootState) => state.toast);

  const handleClose = () => {
    dispatch(hideToast());
  };

  const handleExited = () => {
    dispatch(clearToast());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      TransitionProps={{ onExited: handleExited }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={type || 'info'} 
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;