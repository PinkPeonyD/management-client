import React from "react";
import { BrowserRouter } from "react-router-dom";
import AuthorizedRoutes from "../routes/AuthorizedRoutes";
import UnauthorizedRoutes from "../routes/UnauthorizedRoutes";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const MainRouter: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  return (
    <BrowserRouter>
      {isLoggedIn ? <AuthorizedRoutes /> : <UnauthorizedRoutes />}
    </BrowserRouter>
  );
};

export default MainRouter;
