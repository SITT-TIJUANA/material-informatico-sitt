import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { Grupo, Fila } from '../components/ListaAgrupada.jsx';
import QRConectar from '../components/QRConectar.jsx';
import BotonCerrarSesion from '../components/BotonCerrarSesion.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client.js';

const IC = {
  perfil: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5" /></svg>,
  historial: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>,
  bodegas: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9.5 12 3l9 6.5V21H3V9.5Z" /><path d="M9 21v-7h6v7" /></svg>,
  usuarios: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /></svg>,
  alertas: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2a5 5 0 0 0-5 5v3.3c0 .6-.2 1.2-.6 1.7L4.8 14.6c-.9 1.1-.1 2.7 1.3 2.7h11.8c1.4 0 2.2-1.6 1.3-2.7l-1.6-2.6a2.6 2.6 0 0 1-.6-1.7V7a5 5 0 0 0-5-5Z" /></svg>,
  qr: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01" /></svg>,
  camara: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" /><circle cx="12" cy="14" r="3.5" /></svg>,
  salir: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></svg>,
};

export default function Ajustes() {
  const { usuario, logout, esAdmin, refrescarUsuario } = useAuth();
  const navigate = useNavigate();
  const inputFoto = useRef(null);
  const [subiendo, setSubiendo] = useState(false);
  const [qrAbierto, setQrAbierto] = useState(false);

  async function cambiarFoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);
    try {
      const form = new FormData();
      form.append('foto', file);
      await api.put('/auth/perfil', form);
      await refrescarUsuario();
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <Layout>
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>Ajustes</h1>

      {/* Encabezado de perfil */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 26 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 68, height: 68, borderRadius: '50%', overflow: 'hidden',
            background: 'var(--aqua-dim)', color: 'var(--aqua-dark)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700
          }}>
            {usuario?.foto_perfil_url
              ? <img src={usuario.foto_perfil_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : usuario?.nombre?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <button
            onClick={() => inputFoto.current?.click()}
            disabled={subiendo}
            style={{
              position: 'absolute', bottom: -2, right: -2, width: 26, height: 26, borderRadius: '50%',
              background: 'var(--aqua)', color: '#fff', border: '2.5px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
            aria-label="Cambiar foto de perfil"
          >
            {IC.camara}
          </button>
          <input ref={inputFoto} type="file" accept="image/*" capture="user" style={{ display: 'none' }} onChange={cambiarFoto} />
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{usuario?.nombre}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{usuario?.correo}</div>
          <span className="badge badge-nuevo" style={{ marginTop: 6, textTransform: 'capitalize' }}>{usuario?.rol}</span>
        </div>
      </div>

      <Grupo titulo="Acceso rápido">
        <Fila icono={IC.qr} label="Conectar mi teléfono (QR)" onClick={() => setQrAbierto(true)} ultima />
      </Grupo>

      <Grupo titulo="Actividad">
        <Fila icono={IC.historial} label="Historial de movimientos" onClick={() => navigate('/historial')} ultima />
      </Grupo>

      {esAdmin && (
        <Grupo titulo="Administración">
          <Fila icono={IC.bodegas} label="Bodegas" onClick={() => navigate('/admin/bodegas')} />
          <Fila icono={IC.usuarios} label="Usuarios" onClick={() => navigate('/admin/usuarios')} />
          <Fila icono={IC.alertas} label="Alertas por correo" onClick={() => navigate('/admin/alertas')} ultima />
        </Grupo>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8, marginBottom: 8 }}>
        <BotonCerrarSesion onClick={logout} />
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
        Inventario Informático SITT
      </p>

      <QRConectar abierto={qrAbierto} onCerrar={() => setQrAbierto(false)} />
    </Layout>
  );
}
