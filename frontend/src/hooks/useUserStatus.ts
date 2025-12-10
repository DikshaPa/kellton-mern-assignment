import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import { showToast } from '../redux/slices/toastSlice';

export const useUserStatus = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check user status every 30 seconds
    const checkUserStatus = () => {
      if (user && !user.isActive) {
        dispatch(showToast({
          message: 'Your account has been deactivated. Please contact administrator.',
          type: 'error'
        }));
        dispatch(logout());
        navigate('/login');
      }
    };

    const interval = setInterval(checkUserStatus, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [user, dispatch, navigate]);
};