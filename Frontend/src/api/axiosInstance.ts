import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL + "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
