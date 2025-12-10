import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UsersState, User } from '../../types';

const initialState: UsersState = {
  list: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action: PayloadAction<User[]>) => {
      state.loading = false;
      state.list = action.payload;
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.list.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.list.findIndex(user => user._id === action.payload._id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(user => user._id !== action.payload);
    },
  },
});

export const { 
  fetchUsersStart, 
  fetchUsersSuccess, 
  fetchUsersFailure, 
  addUser, 
  updateUser, 
  deleteUser 
} = usersSlice.actions;
export default usersSlice.reducer;