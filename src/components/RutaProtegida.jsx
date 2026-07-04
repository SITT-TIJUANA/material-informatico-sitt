import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function RutaProtegida({ children }) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  return children;
}

export function RutaAdmin({ children }) {
  const { esAdmin } = useAuth();
  if (!esAdmin) return <Navigate to="/" replace />;
  return children;
}

export function RutaEditor({ children }) {
  const { puedeEditar } = useAuth();
  if (!puedeEditar) return <Navigate to="/" replace />;
  return children;
}
