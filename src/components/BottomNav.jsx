import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Modal from './Modal.jsx';

const I = {
  panel: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>,
  inventario: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 8l-9-5-9 5 9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></svg>,
  mas: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>,
  plus: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>,
  bodegas: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9.5 12 3l9 6.5V21H3V9.5Z" /><path d="M9 21v-7h6v7" /></svg>,
  usuarios: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /></svg>,
  alertas: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2a5 5 0 0 0-5 5v3.3c0 .6-.2 1.2-.6 1.7L4.8 14.6c-.9 1.1-.1 2.7 1.3 2.7h11.8c1.4 0 2.2-1.6 1.3-2.7l-1.6-2.6a2.6 2.6 0 0 1-.6-1.7V7a5 5 0 0 0-5-5Z" /></svg>,
  salir: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></svg>,
};

const tabStyle = ({ isActive }) => ({
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
  color: isActive ? 'var(--aqua-dark)' : 'var(--text-muted)', fontSize: 10.5, fontWeight: 700,
  flex: 1, padding: '6px 0'
});

export default function BottomNav() {
  const { usuario, logout, esAdmin } = useAuth();
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <nav className="bottom-nav-mobile" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff',
        borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center',
        padding: '6px 6px calc(env(safe-area-inset-bottom, 0px) + 6px)', zIndex: 40,
        boxShadow: '0 -6px 20px rgba(10,60,55,0.06)'
      }}>
        <NavLink to="/" end style={tabStyle}>
          {I.panel({ width: 21, height: 21 })}
          Panel
        </NavLink>
        <NavLink to="/inventario" style={tabStyle}>
          {I.inventario({ width: 21, height: 21 })}
          Inventario
        </NavLink>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', marginTop: -22 }}>
          <button
            onClick={() => navigate('/alta')}
            aria-label="Dar de alta"
            style={{
              width: 54, height: 54, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--aqua), var(--aqua-dark))',
              color: '#fff', border: '4px solid #fff', boxShadow: '0 8px 20px rgba(15,184,166,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            {I.plus({ width: 24, height: 24 })}
          </button>
        </div>

        <button onClick={() => setAbierto(true)} style={{ ...tabStyle({ isActive: false }), background: 'none', border: 'none' }}>
          {I.mas({ width: 21, height: 21 })}
          Más
        </button>
        <div style={tabStyle({ isActive: false })} onClick={() => setAbierto(true)} />
      </nav>

      <Modal abierto={abierto} onCerrar={() => setAbierto(false)} ancho={380}>
        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', background: 'var(--aqua-dim)', color: 'var(--aqua-dark)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
            }}>{usuario?.nombre?.charAt(0)?.toUpperCase() || '?'}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{usuario?.nombre}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{usuario?.rol}</div>
            </div>
          </div>

          {esAdmin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
              <OpcionMenu icono={I.bodegas} label="Bodegas" onClick={() => { setAbierto(false); navigate('/admin/bodegas'); }} />
              <OpcionMenu icono={I.usuarios} label="Usuarios" onClick={() => { setAbierto(false); navigate('/admin/usuarios'); }} />
              <OpcionMenu icono={I.alertas} label="Alertas" onClick={() => { setAbierto(false); navigate('/admin/alertas'); }} />
            </div>
          )}

          <button className="btn btn-outline" style={{ width: '100%', color: 'var(--red)' }} onClick={logout}>
            {I.salir({ width: 17, height: 17 })} Cerrar sesión
          </button>
        </div>
      </Modal>
    </>
  );
}

function OpcionMenu({ icono, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 10px', borderRadius: 10,
      border: 'none', background: 'var(--surface-2)', textAlign: 'left', fontSize: 14, fontWeight: 600, color: 'var(--text)', cursor: 'pointer'
    }}>
      {icono({ width: 18, height: 18, style: { color: 'var(--aqua-dark)' } })}
      {label}
    </button>
  );
}
