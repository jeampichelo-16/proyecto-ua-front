// src/lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

console.log("Modo:", import.meta.env.VITE_STAGE);

export default api;
