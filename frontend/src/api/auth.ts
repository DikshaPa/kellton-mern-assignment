import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle inactive user
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.response?.data?.code === 'USER_INACTIVE') {
      // For login requests, don't redirect - let the login page handle the error
      if (error.config?.url?.includes('/auth/google')) {
        return Promise.reject(error);
      }
      
      // For other requests, clear storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(new Error('Account deactivated'));
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  googleLogin: (token: string) => api.post('/auth/google', { token }),
};

export const usersAPI = {
  getUsers: () => api.get('/users'),
  createUser: (userData: any) => api.post('/users', userData),
  updateUser: (id: string, userData: any) => api.put(`/users/${id}`, userData),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
  getUsersSummary: () => api.get('/users/summary'),
};

export default api;