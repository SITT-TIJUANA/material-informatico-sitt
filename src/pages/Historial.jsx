import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { api } from '../api/client.js';

const ETIQUETA = {
  alta: { texto: 'Alta', clase: 'badge-nuevo' },
  baja: { texto: 'Baja', clase: 'badge-baja' },
  edicion: { texto: 'Edición', clase: 'badge-usado' },
  reactivacion: { texto: 'Reactivación', clase: 'badge-nuevo' },
};

export default function Historial() {
  const [movimientos, setMovimientos] = useState(null);

  useEffect(() => { api.get('/dashboard/historial').then((r) => setMovimientos(r.data)); }, []);

  return (
    <Layout>
      <Link to="/ajustes" style={{ color: 'var(--text-muted)', fontSize: 13 }}>← Ajustes</Link>
      <h1 style={{ fontSize: 26, margin: '10px 0 4px' }}>Historial de movimientos</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 22 }}>Últimas altas, bajas y ediciones de todo el inventario</p>

      {!movimientos ? (
        <p style={{ color: 'var(--text-muted)' }}>Cargando…</p>
      ) : movimientos.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Todavía no hay movimientos registrados.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {movimientos.map((m) => {
            const et = ETIQUETA[m.tipo] || { texto: m.tipo, clase: 'badge-usado' };
            return (
              <Link key={m.id} to={m.material_id ? `/material/${m.material_id}` : '#'} className="card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span className={`badge ${et.clase}`} style={{ minWidth: 84, justifyContent: 'center', flexShrink: 0 }}>{et.texto}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{m.articulo || 'Material eliminado'}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{m.detalle}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    {m.usuario_nombre || 'Usuario'} · {new Date(m.creado_en).toLocaleString('es-MX')}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
