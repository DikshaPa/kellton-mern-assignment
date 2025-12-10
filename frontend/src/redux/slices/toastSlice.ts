import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToastState {
  message: string | null;
  type: 'success' | 'error' | 'info' | 'warning' | null;
  open: boolean;
}

const initialState: ToastState = {
  message: null,
  type: null,
  open: false,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' | 'warning' }>) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.open = true;
    },
    hideToast: (state) => {
      state.open = false;
    },
    clearToast: (state) => {
      state.message = null;
      state.type = null;
      state.open = false;
    },
  },
});

export const { showToast, hideToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;