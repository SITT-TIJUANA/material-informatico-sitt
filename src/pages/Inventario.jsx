import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { api } from '../api/client.js';

export default function Inventario() {
  const [materiales, setMateriales] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [q, setQ] = useState('');
  const [bodegaId, setBodegaId] = useState('');
  const [condicion, setCondicion] = useState('');
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    setCargando(true);
    const { data } = await api.get('/materiales', { params: { q, bodega_id: bodegaId, condicion } });
    setMateriales(data);
    setCargando(false);
  }

  useEffect(() => { api.get('/bodegas').then((r) => setBodegas(r.data)); }, []);
  useEffect(() => {
    const t = setTimeout(cargar, 300);
    return () => clearTimeout(t);
  }, [q, bodegaId, condicion]);

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24 }}>Inventario</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{materiales.length} materiales encontrados</p>
        </div>
        <Link to="/alta" className="btn btn-primary">+ Dar de alta</Link>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Buscar por artículo, marca, modelo, serie, folio…"
          value={q} onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontSize: 14 }}
        />
        <select value={bodegaId} onChange={(e) => setBodegaId(e.target.value)} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)' }}>
          <option value="">Todas las bodegas</option>
          {bodegas.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
        </select>
        <select value={condicion} onChange={(e) => setCondicion(e.target.value)} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)' }}>
          <option value="">Cualquier condición</option>
          <option value="Nuevo">Nuevo</option>
          <option value="Usado">Usado</option>
          <option value="Dañado">Dañado</option>
        </select>
      </div>

      {cargando ? (
        <p style={{ color: 'var(--text-muted)' }}>Cargando…</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {materiales.map((m) => (
            <Link key={m.id} to={`/material/${m.id}`} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, transition: 'border-color .15s' }}>
              <div style={{
                aspectRatio: '4/3', borderRadius: 8, overflow: 'hidden', background: 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {m.foto_material_url
                  ? <img src={m.foto_material_url} alt={m.articulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <IconoSinFoto />}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{m.articulo}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.marca} {m.modelo}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge badge-${m.condicion?.toLowerCase()}`}>{m.condicion}</span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.bodega_nombre || 'Sin bodega'}</span>
              </div>
            </Link>
          ))}
          {materiales.length === 0 && (
            <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)' }}>
              No hay materiales que coincidan con la búsqueda.
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}

function IconoSinFoto() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8B96A6" strokeWidth="1.5">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M21 16l-5-5-4 4-3-3-6 6" />
    </svg>
  );
}
