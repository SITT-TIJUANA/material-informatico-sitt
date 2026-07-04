import { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import { api } from '../../api/client.js';

export default function Alertas() {
  const [config, setConfig] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => { api.get('/dashboard/configuracion').then((r) => setConfig(r.data)); }, []);

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true); setMensaje('');
    await api.put('/dashboard/configuracion', config);
    setGuardando(false);
    setMensaje('Configuración guardada.');
  }

  async function probarAhora() {
    setMensaje('Revisando y enviando correo si aplica…');
    await api.post('/dashboard/revisar-alertas-ahora');
    setMensaje('Revisión ejecutada. Si hay materiales sin movimiento, se envió el correo.');
  }

  if (!config) return <Layout><p style={{ color: 'var(--text-muted)' }}>Cargando…</p></Layout>;

  return (
    <Layout>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Alertas por correo</h1>

      <form onSubmit={guardar} className="card" style={{ maxWidth: 480, marginBottom: 16 }}>
        <div className="field">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={config.alertas_sin_movimiento_activas === 'true'}
              onChange={(e) => setConfig({ ...config, alertas_sin_movimiento_activas: String(e.target.checked) })}
              style={{ width: 'auto' }}
            />
            Activar alertas de materiales sin movimiento
          </label>
        </div>
        <div className="field">
          <label>Días sin cambios antes de avisar</label>
          <input
            type="number" min="1"
            value={config.dias_sin_movimiento}
            onChange={(e) => setConfig({ ...config, dias_sin_movimiento: e.target.value })}
          />
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
          Los correos de alta y baja se envían siempre a administradores y editores.
          Esta alerta adicional revisa todos los días a las 8:00 AM si hay materiales sin cambios recientes.
        </p>
        {mensaje && <div style={{ fontSize: 13, color: 'var(--aqua)', marginBottom: 12 }}>{mensaje}</div>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar'}</button>
          <button type="button" className="btn btn-outline" onClick={probarAhora}>Probar ahora</button>
        </div>
      </form>
    </Layout>
  );
}
