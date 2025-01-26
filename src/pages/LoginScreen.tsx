import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Login from "../components/Login";

const LoginScreen: React.FC = () => {
  return (
    <div className='d-flex flex-column min-vh-100'>
      <Header />
      <div className='flex-grow-1'>
        <Login />
      </div>
      <Footer />
    </div>
  );
};

export default LoginScreen;
