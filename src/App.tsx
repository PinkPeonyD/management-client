import React from "react";
import MainRouter from "./routes/MainRouter";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  return (
    <>
      <ToastContainer />
      <MainRouter />
    </>
  );
};

export default App;
