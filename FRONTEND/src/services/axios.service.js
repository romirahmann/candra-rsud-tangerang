/* eslint-disable no-unused-vars */
import axios from "axios";
import { baseApi } from "./api.service";

const api = axios.create({
  baseURL: baseApi,
});

// Request Interceptor → Inject token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor → Cek token kadaluarsa
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      sessionStorage.removeItem("token");

      // Dispatch event supaya React bisa handle
      window.dispatchEvent(new Event("unauthorized"));
    }

    return Promise.reject(error);
  }
);

export default api;
