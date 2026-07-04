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
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <form onSubmit={manejarSubmit} className="card" style={{ width: 380 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, background: 'var(--cyan-dim)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)', fontWeight: 700, marginBottom: 18
        }}>SI</div>
        <h1 style={{ fontSize: 20, marginBottom: 4 }}>Inventario Informático</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>SITT — H. XXV Ayuntamiento de Tijuana</p>

        <div className="field">
          <label>Correo</label>
          <input type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="tu.correo@sitt.gob.mx" />
        </div>
        <div className="field">
          <label>Contraseña</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>

        {error && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 14 }}>{error}</div>}

        <button className="btn btn-primary" style={{ width: '100%' }} disabled={cargando}>
          {cargando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
