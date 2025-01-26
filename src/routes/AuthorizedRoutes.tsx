import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomeScreen from "../pages/HomeScreen";
import LoginScreen from "../pages/LoginScreen";
import SignupScreen from "../pages/SignupScreen";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const AuthorizedRoutes: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  return (
    <Routes>
      <Route
        path='/'
        element={isLoggedIn ? <HomeScreen /> : <Navigate to='/login' replace />}
      />
      <Route
        path='/login'
        element={isLoggedIn ? <Navigate to='/' replace /> : <LoginScreen />}
      />
      <Route
        path='/signup'
        element={isLoggedIn ? <Navigate to='/' replace /> : <SignupScreen />}
      />
    </Routes>
  );
};

export default AuthorizedRoutes;
