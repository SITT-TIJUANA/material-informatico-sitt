import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client.js';

export default function EntrarQR() {
  const [params] = useSearchParams();
  const { entrarConSesion } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = params.get('t');
    if (!token) { setError('Falta el código en el enlace.'); return; }

    api.get(`/auth/qr-sesion/${token}`)
      .then(({ data }) => {
        entrarConSesion(data.token, data.usuario);
        navigate('/', { replace: true });
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'No se pudo iniciar sesión con este código.');
      });
  }, [params]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, background: 'var(--bg)', textAlign: 'center'
    }}>
      <div className="card" style={{ maxWidth: 360 }}>
        {!error ? (
          <>
            <h2 style={{ fontSize: 18, marginBottom: 8 }}>Entrando…</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Conectando con tu cuenta, un momento.</p>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 18, marginBottom: 8, color: 'var(--red)' }}>No se pudo entrar</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/login', { replace: true })}>
              Ir al login normal
            </button>
          </>
        )}
      </div>
    </div>
  );
}
