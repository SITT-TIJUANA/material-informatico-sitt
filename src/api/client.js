import axios from 'axios';

// Cambia esto por la URL de tu backend en Render, ej: https://inventario-sitt-api.onrender.com
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({ baseURL: `${API_URL}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('inv_sitt_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('inv_sitt_token');
      localStorage.removeItem('inv_sitt_user');
      window.location.hash = '#/login';
    }
    return Promise.reject(err);
  }
);
