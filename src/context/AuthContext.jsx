import { createContext, useContext, useState } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const raw = localStorage.getItem('inv_sitt_user');
    return raw ? JSON.parse(raw) : null;
  });

  async function login(correo, password) {
    const { data } = await api.post('/auth/login', { correo, password });
    localStorage.setItem('inv_sitt_token', data.token);
    localStorage.setItem('inv_sitt_user', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data.usuario;
  }

  function logout() {
    localStorage.removeItem('inv_sitt_token');
    localStorage.removeItem('inv_sitt_user');
    setUsuario(null);
  }

  const puedeEditar = usuario?.rol === 'administrador' || usuario?.rol === 'editor';
  const esAdmin = usuario?.rol === 'administrador';

  return (
    <AuthContext.Provider value={{ usuario, login, logout, puedeEditar, esAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
