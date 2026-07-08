import { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import Interruptor from '../../components/Interruptor.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { api } from '../../api/client.js';

const TIPOS = [
  { clave: 'notif_alta', label: 'Altas' },
  { clave: 'notif_baja', label: 'Bajas' },
  { clave: 'notif_edicion', label: 'Ediciones' },
  { clave: 'notif_eliminacion', label: 'Eliminaciones' },
];

export default function Alertas() {
  const [config, setConfig] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const { notificar } = useToast();

  useEffect(() => {
    api.get('/dashboard/configuracion').then((r) => setConfig(r.data));
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    const { data } = await api.get('/auth/usuarios');
    setUsuarios(data.filter((u) => u.rol === 'administrador' || u.rol === 'editor'));
  }

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

  async function cambiarPreferencia(usuarioId, clave, valor) {
    // Actualiza de inmediato en pantalla, sin esperar a la respuesta (se siente más ágil)
    setUsuarios((us) => us.map((u) => (u.id === usuarioId ? { ...u, [clave]: valor } : u)));
    try {
      await api.patch(`/auth/usuarios/${usuarioId}/notificaciones`, { [clave]: valor });
    } catch {
      cargarUsuarios(); // si algo falla, recarga los valores reales
      notificar({ tipo: 'error', titulo: 'No se pudo guardar la preferencia' });
    }
  }

  if (!config) return <Layout><p style={{ color: 'var(--text-muted)' }}>Cargando…</p></Layout>;

  return (
    <Layout>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Alertas por correo</h1>

      <div className="card" style={{ marginBottom: 24, overflowX: 'auto' }}>
        <h3 style={{ fontSize: 15, marginBottom: 4 }}>Notificaciones por usuario</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
          Elige qué tipo de correos recibe cada quién. Solo administradores y editores aparecen aquí (consulta no da de alta ni edita nada).
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 480 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase' }}>
              <th style={{ padding: '8px 6px' }}>Usuario</th>
              {TIPOS.map((t) => (
                <th key={t.clave} style={{ padding: '8px 6px', textAlign: 'center' }}>{t.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 6px' }}>
                  <div style={{ fontWeight: 600 }}>{u.nombre}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.correo}</div>
                </td>
                {TIPOS.map((t) => (
                  <td key={t.clave} style={{ padding: '10px 6px', textAlign: 'center' }}>
                    <Interruptor
                      activo={Boolean(u[t.clave])}
                      onChange={(v) => cambiarPreferencia(u.id, t.clave, v)}
                    />
                  </td>
                ))}
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)' }}>No hay administradores o editores todavía.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={guardar} className="card" style={{ maxWidth: 480 }}>
        <h3 style={{ fontSize: 15, marginBottom: 14 }}>Materiales sin movimiento</h3>
        <div className="field">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={config.alertas_sin_movimiento_activas === 'true'}
              onChange={(e) => setConfig({ ...config, alertas_sin_movimiento_activas: String(e.target.checked) })}
              style={{ width: 'auto' }}
            />
            Activar esta alerta
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
          Revisa todos los días a las 8:00 AM si hay materiales sin cambios recientes, y avisa a quienes tengan esta notificación activada arriba.
        </p>
        {mensaje && <div style={{ fontSize: 13, color: 'var(--aqua-dark)', marginBottom: 12 }}>{mensaje}</div>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar'}</button>
          <button type="button" className="btn btn-outline" onClick={probarAhora}>Probar ahora</button>
        </div>
      </form>
    </Layout>
  );
}
