import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const useRole = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  const isAdmin = user?.role === 'admin';
  const isEditor = user?.role === 'editor';
  const isViewer = user?.role === 'viewer';
  
  const canCreateUsers = isAdmin;  // Only admin can create
  const canDeleteUsers = isAdmin;  // Only admin can delete
  const canEditUsers = isAdmin || isEditor;  // Admin + Editor can edit
  const canViewUsers = isAdmin || isEditor || isViewer;  // All can view
  const canAccessSettings = isAdmin;
  const canViewReports = isAdmin || isEditor;
  
  return {
    user,
    isAdmin,
    isEditor,
    isViewer,
    canCreateUsers,
    canDeleteUsers,
    canEditUsers,
    canViewUsers,
    canAccessSettings,
    canViewReports
  };
};