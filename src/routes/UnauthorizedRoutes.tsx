import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "../pages/LoginScreen";
import SignupScreen from "../pages/SignupScreen";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const UnauthorizedRoutes: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  return (
    <Routes>
      <Route
        path='/login'
        element={isLoggedIn ? <Navigate to='/' replace /> : <LoginScreen />}
      />
      <Route
        path='/signup'
        element={isLoggedIn ? <Navigate to='/' replace /> : <SignupScreen />}
      />
      <Route path='*' element={<Navigate to='/login' replace />} />
    </Routes>
  );
};

export default UnauthorizedRoutes;
