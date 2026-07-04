import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Iconos de equipo de cómputo que "llueven" de fondo, sutil y animado
const ICONOS_LLUVIA = [
  { left: '4%', size: 26, delay: '0s', duration: '11s', tipo: 'monitor' },
  { left: '12%', size: 18, delay: '3.5s', duration: '9s', tipo: 'laptop' },
  { left: '20%', size: 22, delay: '1.2s', duration: '13s', tipo: 'servidor' },
  { left: '29%', size: 15, delay: '6s', duration: '8.5s', tipo: 'chip' },
  { left: '37%', size: 24, delay: '2.4s', duration: '12s', tipo: 'monitor' },
  { left: '46%', size: 17, delay: '8s', duration: '10s', tipo: 'laptop' },
  { left: '54%', size: 20, delay: '0.8s', duration: '11.5s', tipo: 'chip' },
  { left: '62%', size: 26, delay: '4.5s', duration: '9.5s', tipo: 'servidor' },
  { left: '70%', size: 16, delay: '7s', duration: '13.5s', tipo: 'monitor' },
  { left: '78%', size: 22, delay: '2s', duration: '10.5s', tipo: 'laptop' },
  { left: '86%', size: 18, delay: '5.5s', duration: '12.5s', tipo: 'chip' },
  { left: '93%', size: 24, delay: '1.6s', duration: '9s', tipo: 'servidor' },
  { left: '8%', size: 14, delay: '9.5s', duration: '14s', tipo: 'chip' },
  { left: '65%', size: 15, delay: '10s', duration: '11s', tipo: 'monitor' },
];

function IconoEquipo({ tipo, ...p }) {
  const comun = { fill: 'none', stroke: '#0FB8A6', strokeWidth: 1.6 };
  if (tipo === 'laptop') return <svg {...p} viewBox="0 0 24 24" {...comun}><rect x="4" y="4" width="16" height="11" rx="1.5" /><path d="M2 18h20l-2 2H4l-2-2Z" /></svg>;
  if (tipo === 'servidor') return <svg {...p} viewBox="0 0 24 24" {...comun}><rect x="4" y="3" width="16" height="6" rx="1.2" /><rect x="4" y="11" width="16" height="6" rx="1.2" /><circle cx="7.5" cy="6" r="0.8" fill="#0FB8A6" stroke="none" /><circle cx="7.5" cy="14" r="0.8" fill="#0FB8A6" stroke="none" /></svg>;
  if (tipo === 'chip') return <svg {...p} viewBox="0 0 24 24" {...comun}><rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" /></svg>;
  return <svg {...p} viewBox="0 0 24 24" {...comun}><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M9 20h6M12 16v4" /></svg>;
}

function LluviaComputadoras() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <style>{`
        @keyframes caidaEquipo {
          0% { transform: translateY(-8vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.22; }
          90% { opacity: 0.22; }
          100% { transform: translateY(108vh) rotate(25deg); opacity: 0; }
        }
      `}</style>
      {ICONOS_LLUVIA.map((it, i) => (
        <IconoEquipo
          key={i}
          tipo={it.tipo}
          width={it.size}
          height={it.size}
          style={{
            position: 'absolute', top: 0, left: it.left,
            animation: `caidaEquipo ${it.duration} linear ${it.delay} infinite`
          }}
        />
      ))}
    </div>
  );
}

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
      <LluviaComputadoras />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: 460,
        background: '#fff', borderRadius: 22, overflow: 'hidden', boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Portada institucional — se ajusta sola al tamaño real de tu imagen (16:9), sin recortarla */}
        <div style={{
          aspectRatio: '16 / 9', width: '100%',
          backgroundImage: `url('${import.meta.env.BASE_URL}login-bg.jpg')`, backgroundSize: 'cover',
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
