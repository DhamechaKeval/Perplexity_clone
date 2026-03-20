import { useDispatch } from "react-redux";
import { register, login, getMe } from "../services/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";
import toast from "react-hot-toast";
import { showError, showSuccess } from "../utils/toast";

export const useAuth = () => {
  const dispatch = useDispatch();

  // ✅ REGISTER
  const handleRegister = async ({ username, email, password }) => {
    try {
      dispatch(setLoading(true));

      await register({ username, email, password });

      showSuccess("Account created successfully, Verify email 🎉");

      return true; // ✅ important
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed ❌";

      dispatch(setError(message));
      showError(message); // ✅ toast add

      return false; // ✅ important
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ✅ LOGIN
  const handleLogin = async ({ email, password }) => {
    try {
      dispatch(setLoading(true));

      const data = await login({ email, password });

      dispatch(setUser(data.user));

      showSuccess("Login successful 🎉");

      return true; // ✅ important
    } catch (error) {
      const message = error.response?.data?.message || "Login failed ❌";

      dispatch(setError(message));
      showError(message); // ✅ toast add

      return false; // ✅ important
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ✅ GET ME
  const handleGetMe = async () => {
    try {
      dispatch(setLoading(true));

      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch user";

      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { handleRegister, handleLogin, handleGetMe };
};
