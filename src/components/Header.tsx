import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Header: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  return (
    <header className='bg-primary text-white text-center py-3'>
      <h1>Fliter</h1>
      {currentUser && (
        <div className='mt-1'>
          <p className='mb-0'>Welcome, {currentUser.email}!</p>
        </div>
      )}
    </header>
  );
};

export default Header;
