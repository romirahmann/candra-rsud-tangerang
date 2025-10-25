import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false, // 🔹 state baru
  error: null, // 🔹 state baru
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload; // simpan pesan error
    },
    logout: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;

export default authSlice.reducer;
