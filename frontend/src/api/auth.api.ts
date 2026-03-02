import apiClient from "./client";

export const login = async (email: string, password: string) => {
  const res = await apiClient.post("/auth/login", { email, password });
  return res.data; // { access_token: "...", token_type: "bearer" }
};

export const register = async (username: string, email: string, password: string) => {
  const res = await apiClient.post("/auth/register", { username, email, password });
  return res.data;
};