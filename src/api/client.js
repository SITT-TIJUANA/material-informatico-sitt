import axios from 'axios';
import { notificarGlobal } from '../context/ToastContext.jsx';

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
    } else if (!err.response) {
      // Sin respuesta del servidor: sin internet, o el backend está "despertando" (Render free)
      notificarGlobal({
        tipo: 'error',
        titulo: 'Sin conexión con el servidor',
        mensaje: 'Puede tardar hasta 1 minuto en despertar si no se usaba hace rato. Intenta de nuevo en unos segundos.'
      });
    } else if (err.response.status >= 500) {
      notificarGlobal({
        tipo: 'error',
        titulo: 'Error del servidor',
        mensaje: 'Algo falló de nuestro lado. Intenta de nuevo; si se repite, avísale a Jair.'
      });
    }
    return Promise.reject(err);
  }
);
