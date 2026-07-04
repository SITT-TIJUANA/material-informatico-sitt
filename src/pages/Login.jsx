import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function manejarSubmit(e) {
    e.preventDefault();
    setError(''); setCargando(true);
    try {
      await login(correo, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo iniciar sesión');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, position: 'relative', overflow: 'hidden',
      backgroundImage: "linear-gradient(160deg, rgba(6,32,30,0.88), rgba(10,147,132,0.75)), url('/login-bg.jpg')",
      backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#0A2E2A'
    }}>
      {/* Patrón decorativo tipo circuito, siempre visible aunque no haya foto de fondo */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.14 }} preserveAspectRatio="none">
        <defs>
          <pattern id="circuito" width="90" height="90" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="2.5" fill="#fff" />
            <path d="M10 10 L10 45 L45 45 L45 80 L80 80" stroke="#fff" strokeWidth="1.2" fill="none" />
            <circle cx="45" cy="45" r="2.5" fill="#fff" />
            <circle cx="80" cy="80" r="2.5" fill="#fff" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuito)" />
      </svg>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 960, display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 0, borderRadius: 24, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.35)' }}>

        {/* Panel izquierdo: branding */}
        <div style={{ padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
          <div>
            <div style={{
              width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 28,
              border: '1px solid rgba(255,255,255,0.25)'
            }}>SI</div>
            <h1 style={{ fontSize: 42, lineHeight: 1.05, marginBottom: 16, color: '#fff' }}>
              Inventario<br />Informático
            </h1>
            <p style={{ fontSize: 15, opacity: 0.85, maxWidth: 320, lineHeight: 1.6 }}>
              Control total del material de cómputo, red y comunicaciones de SITT — ubicación exacta,
              historial de movimientos y alertas automáticas, todo en un solo lugar.
            </p>
          </div>
          <div style={{ fontSize: 13, opacity: 0.7 }}>
            H. XXV Ayuntamiento de Tijuana · SITT
          </div>
        </div>

        {/* Panel derecho: formulario, efecto vidrio */}
        <div style={{
          background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
          padding: '56px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center'
        }}>
          <h2 style={{ fontSize: 22, marginBottom: 6 }}>Bienvenido de vuelta</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>Ingresa tus credenciales para continuar</p>

          <form onSubmit={manejarSubmit}>
            <div className="field">
              <label>Correo</label>
              <input type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="tu.correo@sitt.gob.mx" />
            </div>
            <div className="field">
              <label>Contraseña</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            {error && (
              <div style={{ background: 'var(--red-dim)', color: 'var(--red)', fontSize: 13, padding: '10px 14px', borderRadius: 10, marginBottom: 16 }}>
                {error}
              </div>
            )}

            <button className="btn btn-primary" style={{ width: '100%', padding: '13px 0', fontSize: 15 }} disabled={cargando}>
              {cargando ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
