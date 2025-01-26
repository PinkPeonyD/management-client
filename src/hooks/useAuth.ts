import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { login, logout } from "../redux/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch("https://management-server-bmj0.onrender.com/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      dispatch(
        login({
          id: data.user.id,
          email: data.user.email,
          token: data.token,
        })
      );
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return { isLoggedIn, user, login: handleLogin, logout: handleLogout };
};

export default useAuth;
