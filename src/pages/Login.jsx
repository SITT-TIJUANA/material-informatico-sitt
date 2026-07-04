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
      padding: 20, position: 'relative', overflow: 'hidden', background: 'var(--bg)'
    }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} preserveAspectRatio="none">
        <defs>
          <pattern id="circuito" width="90" height="90" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="2" fill="#0FB8A6" opacity="0.25" />
            <path d="M10 10 L10 45 L45 45 L45 80 L80 80" stroke="#0FB8A6" strokeWidth="1" fill="none" opacity="0.2" />
            <circle cx="45" cy="45" r="2" fill="#0FB8A6" opacity="0.25" />
            <circle cx="80" cy="80" r="2" fill="#0FB8A6" opacity="0.25" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuito)" />
      </svg>

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: 460,
        background: '#fff', borderRadius: 22, overflow: 'hidden', boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{
          height: 176, backgroundImage: `url('${import.meta.env.BASE_URL}login-bg.jpg')`, backgroundSize: 'cover',
          backgroundPosition: 'center', backgroundColor: 'var(--ink)'
        }} />

        <div style={{ padding: '32px 36px 40px' }}>
          <h2 style={{ fontSize: 22, marginBottom: 6 }}>Bienvenido de vuelta</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 26 }}>Ingresa tus credenciales para continuar</p>

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

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 24 }}>
            H. XXV Ayuntamiento de Tijuana · SITT
          </p>
        </div>
      </div>
    </div>
  );
}
