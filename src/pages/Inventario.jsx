import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import Layout from '../components/Layout.jsx';
import Modal from '../components/Modal.jsx';
import SegmentoDeslizante from '../components/SegmentoDeslizante.jsx';
import { api } from '../api/client.js';

const COLORES = ['#0FB8A6', '#E7A94C', '#2FBE7F', '#E8615B', '#5E7B78', '#7C6FE0', '#5AC8E0'];

export default function Inventario() {
  const [vista, setVista] = useState('lista'); // 'lista' | 'fotos' | 'graficas'
  const [materiales, setMateriales] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [q, setQ] = useState('');
  const [bodegaId, setBodegaId] = useState('');
  const [condicion, setCondicion] = useState('');
  const [cargando, setCargando] = useState(true);
  const [seleccionado, setSeleccionado] = useState(null);
  const [resumen, setResumen] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (vista === 'graficas' && !resumen) {
      api.get('/dashboard/resumen').then((r) => setResumen(r.data));
    }
  }, [vista]);

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 30 }}>Inventario</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>{materiales.length} materiales encontrados</p>
        </div>
        <Link to="/alta" className="btn btn-primary">+ Dar de alta</Link>
      </div>

      {/* Control segmentado: Lista / Fotos / Gráficas */}
      <div style={{ marginBottom: 22 }}>
        <SegmentoDeslizante
          opciones={[
            { value: 'lista', label: 'Lista' },
            { value: 'fotos', label: 'Fotos' },
            { value: 'graficas', label: 'Gráficas' }
          ]}
          valor={vista}
          onChange={setVista}
        />
      </div>

      {(vista === 'lista' || vista === 'fotos') && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
          <input
            placeholder="Buscar por artículo, marca, modelo, serie, folio…"
            value={q} onChange={(e) => setQ(e.target.value)}
            style={{ flex: '1 1 220px', minWidth: 0, background: '#fff', border: '1px solid var(--border)', borderRadius: 100, padding: '12px 18px', color: 'var(--text)', fontSize: 14, boxShadow: 'var(--shadow)' }}
          />
          <select value={bodegaId} onChange={(e) => setBodegaId(e.target.value)} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 100, padding: '12px 18px', color: 'var(--text)', boxShadow: 'var(--shadow)' }}>
            <option value="">Todas las bodegas</option>
            {bodegas.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
          </select>
          <select value={condicion} onChange={(e) => setCondicion(e.target.value)} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 100, padding: '12px 18px', color: 'var(--text)', boxShadow: 'var(--shadow)' }}>
            <option value="">Cualquier condición</option>
            <option value="Nuevo">Nuevo</option>
            <option value="Usado">Usado</option>
            <option value="Dañado">Dañado</option>
          </select>
        </div>
      )}

      {vista === 'lista' && (
        cargando ? <p style={{ color: 'var(--text-muted)' }}>Cargando…</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
            {materiales.map((m) => (
              <button
                key={m.id}
                onClick={() => setSeleccionado(m)}
                className="card"
                style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border)', transition: 'transform .15s, box-shadow .15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
              >
                <div style={{ aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {m.foto_material_url
                    ? <img src={m.foto_material_url} alt={m.articulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <IconoSinFoto />}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 2 }}>{m.articulo}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{m.marca} {m.modelo}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge badge-${m.condicion?.toLowerCase()}`}>{m.condicion}</span>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.bodega_nombre || 'Sin bodega'}</span>
                </div>
              </button>
            ))}
            {materiales.length === 0 && (
              <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)' }}>
                No hay materiales que coincidan con la búsqueda.
              </div>
            )}
          </div>
        )
      )}

      {vista === 'fotos' && (
        cargando ? <p style={{ color: 'var(--text-muted)' }}>Cargando…</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
            {materiales.map((m) => (
              <button
                key={m.id}
                onClick={() => setSeleccionado(m)}
                style={{
                  aspectRatio: '1/1', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)',
                  background: 'var(--surface-2)', cursor: 'pointer', position: 'relative', padding: 0
                }}
              >
                {m.foto_material_url
                  ? <img src={m.foto_material_url} alt={m.articulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconoSinFoto grande /></div>}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 8px 6px',
                  background: 'linear-gradient(transparent, rgba(6,32,30,0.75))', color: '#fff',
                  fontSize: 11.5, fontWeight: 600, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                  {m.articulo}
                </div>
              </button>
            ))}
            {materiales.length === 0 && (
              <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)' }}>
                No hay materiales que coincidan con la búsqueda.
              </div>
            )}
          </div>
        )
      )}

      {vista === 'graficas' && (
        !resumen ? <p style={{ color: 'var(--text-muted)' }}>Cargando gráficas…</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="g-charts">
              <div className="card">
                <h3 style={{ fontSize: 15, marginBottom: 16 }}>Materiales por clasificación</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={resumen.porClasificacion || []} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DCEEEB" horizontal={false} />
                    <XAxis type="number" stroke="#5E7B78" fontSize={12} />
                    <YAxis type="category" dataKey="nombre" stroke="#5E7B78" fontSize={12} width={110} />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #DCEEEB', borderRadius: 8 }} />
                    <Bar dataKey="total" fill="#0FB8A6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card">
                <h3 style={{ fontSize: 15, marginBottom: 16 }}>Condición del equipo</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={resumen.porCondicion || []} dataKey="total" nameKey="nombre" innerRadius={55} outerRadius={85} paddingAngle={3}>
                      {(resumen.porCondicion || []).map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #DCEEEB', borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card">
              <h3 style={{ fontSize: 15, marginBottom: 16 }}>Materiales por bodega</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={resumen.porBodega || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCEEEB" vertical={false} />
                  <XAxis dataKey="nombre" stroke="#5E7B78" fontSize={12} />
                  <YAxis stroke="#5E7B78" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #DCEEEB', borderRadius: 8 }} />
                  <Bar dataKey="total" fill="#E7A94C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )
      )}

      <Modal abierto={Boolean(seleccionado)} onCerrar={() => setSeleccionado(null)} ancho={520}>
        {seleccionado && (
          <div>
            <div style={{ aspectRatio: '16/9', background: 'var(--surface-2)', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {seleccionado.foto_material_url
                ? <img src={seleccionado.foto_material_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <IconoSinFoto grande />}
            </div>
            <div style={{ padding: 26 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <h2 style={{ fontSize: 21 }}>{seleccionado.articulo}</h2>
                <span className={`badge badge-${seleccionado.condicion?.toLowerCase()}`}>{seleccionado.condicion}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 18 }}>{seleccionado.marca} {seleccionado.modelo}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
                <DatoModal label="Folio" valor={seleccionado.no_resguardo_interno} />
                <DatoModal label="No. Serie" valor={seleccionado.no_serie} />
                <DatoModal label="Bodega" valor={seleccionado.bodega_nombre} />
                <DatoModal label="Resguardante" valor={seleccionado.resguardante} />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate(`/material/${seleccionado.id}`)}>
                  Ver en bodega y detalle completo
                </button>
                <button className="btn btn-outline" onClick={() => setSeleccionado(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}

function DatoModal({ label, valor }) {
  return (
    <div>
      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{valor || '—'}</div>
    </div>
  );
}

function IconoSinFoto({ grande }) {
  const s = grande ? 44 : 28;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#9BB8B4" strokeWidth="1.5">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M21 16l-5-5-4 4-3-3-6 6" />
    </svg>
  );
}
