import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import EntrarQR from './pages/EntrarQR.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Inventario from './pages/Inventario.jsx';
import MaterialDetalle from './pages/MaterialDetalle.jsx';
import MaterialForm from './pages/MaterialForm.jsx';
import Ajustes from './pages/Ajustes.jsx';
import Historial from './pages/Historial.jsx';
import Bodegas from './pages/admin/Bodegas.jsx';
import Usuarios from './pages/admin/Usuarios.jsx';
import Alertas from './pages/admin/Alertas.jsx';
import { RutaProtegida, RutaAdmin, RutaEditor } from './components/RutaProtegida.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/entrar-qr" element={<EntrarQR />} />
      <Route path="/" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
      <Route path="/inventario" element={<RutaProtegida><Inventario /></RutaProtegida>} />
      <Route path="/material/:id" element={<RutaProtegida><MaterialDetalle /></RutaProtegida>} />
      <Route path="/alta" element={<RutaProtegida><RutaEditor><MaterialForm /></RutaEditor></RutaProtegida>} />
      <Route path="/material/:id/editar" element={<RutaProtegida><RutaEditor><MaterialForm /></RutaEditor></RutaProtegida>} />
      <Route path="/ajustes" element={<RutaProtegida><Ajustes /></RutaProtegida>} />
      <Route path="/historial" element={<RutaProtegida><Historial /></RutaProtegida>} />
      <Route path="/admin/bodegas" element={<RutaProtegida><RutaAdmin><Bodegas /></RutaAdmin></RutaProtegida>} />
      <Route path="/admin/usuarios" element={<RutaProtegida><RutaAdmin><Usuarios /></RutaAdmin></RutaProtegida>} />
      <Route path="/admin/alertas" element={<RutaProtegida><RutaAdmin><Alertas /></RutaAdmin></RutaProtegida>} />
    </Routes>
  );
}
