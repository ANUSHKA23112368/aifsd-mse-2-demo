import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "patientAuthToken";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const registerPatient = async (payload) => {
  const response = await api.post("/register", payload);
  return response.data;
};

export const loginPatient = async (payload) => {
  const response = await api.post("/login", payload);
  return response.data;
};

export const fetchProfile = async () => {
  const response = await api.get("/profile");
  return response.data;
};

export const updatePassword = async (payload) => {
  const response = await api.put("/update-password", payload);
  return response.data;
};

export const updateCondition = async (payload) => {
  const response = await api.put("/update-condition", payload);
  return response.data;
};

export const getErrorMessage = (error) =>
  error?.response?.data?.message || "Something went wrong. Please try again.";

export default api;
