import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.ts";
import usersReducer from "./usersSlice.ts";
import { useDispatch } from "react-redux";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
