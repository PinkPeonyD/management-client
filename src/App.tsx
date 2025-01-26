import React from "react";
import MainRouter from "./routes/MainRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (
    <>
      <ToastContainer />
      <MainRouter />
    </>
  );
};

export default App;
