import authReducer, {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from '../src/redux/slices/authSlice';

describe('Auth Slice', () => {
  const initialState = {
    token: null,
    user: null,
    loading: false,
    error: null,
  };

  it('should handle login start', () => {
    const action = loginStart();
    const state = authReducer(initialState, action);
    
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should handle login success', () => {
    const mockUser = {
      _id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'editor' as const,
      isActive: true,
      department: 'IT',
      phoneNumber: '+1234567890',
      joinDate: '2024-01-01',
      lastLogin: '2024-01-01',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    const action = loginSuccess({
      token: 'test-token',
      user: mockUser,
    });
    
    const state = authReducer(initialState, action);
    
    expect(state.loading).toBe(false);
    expect(state.token).toBe('test-token');
    expect(state.user).toEqual(mockUser);
  });

  it('should handle login failure', () => {
    const action = loginFailure('Login failed');
    const state = authReducer(initialState, action);
    
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Login failed');
  });

  it('should handle logout', () => {
    const loggedInState = {
      token: 'test-token',
      user: { name: 'Test User' } as any,
      loading: false,
      error: null,
    };
    
    const action = logout();
    const state = authReducer(loggedInState, action);
    
    expect(state.token).toBe(null);
    expect(state.user).toBe(null);
  });
});