// src/lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // cambia si tu backend está en otro puerto
  withCredentials: true, // 🔒 permite enviar y recibir cookies HttpOnly
});

export default api;
