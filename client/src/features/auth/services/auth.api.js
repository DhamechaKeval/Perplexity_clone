import axios from "axios";

const baseURL =
  import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export const register = async ({ username, email, password }) => {
  const response = await api.post("/auth/register", {
    username,
    email,
    password,
  });
  return response.data;
};

export const login = async ({ email, password }) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/get-me");
  return response.data;
};
