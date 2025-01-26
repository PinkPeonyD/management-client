import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Signup from "../components/Signup";

const SignupScreen: React.FC = () => {
  return (
    <div className='d-flex flex-column min-vh-100'>
      <Header />
      <div className='flex-grow-1'>
        <Signup />
      </div>
      <Footer />
    </div>
  );
};

export default SignupScreen;
