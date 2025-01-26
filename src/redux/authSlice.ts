import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface User {
  id: string;
  email: string;
  token: string;
  status?: string;
}
interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  error: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{ id: string; email: string; token: string }>
    ) {
      state.isLoggedIn = true;
      state.user = {
        id: action.payload.id,
        email: action.payload.email,
        token: action.payload.token,
        status: "active",
      };
      state.error = null;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    updateUserStatus(state, action: PayloadAction<{ status: string }>) {
      if (state.user) {
        state.user.status = action.payload.status;
      }
    },
  },
});

export const { login, logout, setError, updateUserStatus } = authSlice.actions;
export default authSlice.reducer;
