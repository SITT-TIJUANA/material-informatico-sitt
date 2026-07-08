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

  // Entra directo con un token ya emitido (usado por el flujo de QR), sin pedir correo/contraseña
  function entrarConSesion(token, usuarioData) {
    localStorage.setItem('inv_sitt_token', token);
    localStorage.setItem('inv_sitt_user', JSON.stringify(usuarioData));
    setUsuario(usuarioData);
  }

  function logout() {
    localStorage.removeItem('inv_sitt_token');
    localStorage.removeItem('inv_sitt_user');
    setUsuario(null);
  }

  // Vuelve a pedir los datos del usuario a la base (para reflejar cambios de perfil/foto al instante)
  async function refrescarUsuario() {
    const { data } = await api.get('/auth/me');
    localStorage.setItem('inv_sitt_user', JSON.stringify(data));
    setUsuario(data);
    return data;
  }

  const puedeEditar = usuario?.rol === 'administrador' || usuario?.rol === 'editor';
  const esAdmin = usuario?.rol === 'administrador';

  return (
    <AuthContext.Provider value={{ usuario, login, logout, refrescarUsuario, entrarConSesion, puedeEditar, esAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
