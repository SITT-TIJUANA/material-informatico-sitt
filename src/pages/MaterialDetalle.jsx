import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import MapaUbicacion from '../components/MapaUbicacion.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function MaterialDetalle() {
  const { id } = useParams();
  const [material, setMaterial] = useState(null);
  const [cargando, setCargando] = useState(true);
  const { puedeEditar, esAdmin } = useAuth();
  const navigate = useNavigate();

  async function cargar() {
    const { data } = await api.get(`/materiales/${id}`);
    setMaterial(data);
    setCargando(false);
  }
  useEffect(() => { cargar(); }, [id]);

  async function darDeBaja() {
    const motivo = prompt('Motivo de la baja (opcional):') || '';
    if (!confirm('¿Confirmas la baja de este material?')) return;
    await api.post(`/materiales/${id}/baja`, { motivo });
    cargar();
  }
  async function reactivar() {
    await api.post(`/materiales/${id}/reactivar`);
    cargar();
  }
  async function eliminar() {
    if (!confirm('Esto elimina el material permanentemente, incluyendo su historial. ¿Continuar?')) return;
    await api.delete(`/materiales/${id}`);
    navigate('/inventario');
  }

  if (cargando) return <Layout><p style={{ color: 'var(--text-muted)' }}>Cargando…</p></Layout>;
  if (!material) return <Layout><p>Material no encontrado.</p></Layout>;

  return (
    <Layout>
      <Link to="/inventario" style={{ color: 'var(--text-muted)', fontSize: 13 }}>← Volver al inventario</Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: '10px 0 20px' }}>
        <div>
          <h1 style={{ fontSize: 24 }}>{material.articulo}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{material.marca} {material.modelo}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className={`badge badge-${material.condicion?.toLowerCase()}`}>{material.condicion}</span>
          {!material.activo && <span className="badge badge-baja">Dado de baja</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="card">
          <h3 style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ubicación en {material.bodega_nombre || 'bodega'}</h3>
          <MapaUbicacion fotoUrl={material.bodega_foto_url} x={material.pos_x} y={material.pos_y} nombreBodega={material.bodega_nombre} />
        </div>
        <div className="card">
          <h3 style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Foto del material</h3>
          {material.foto_material_url ? (
            <img src={material.foto_material_url} alt={material.articulo} style={{ width: '100%', borderRadius: 8, border: '1px solid var(--border)' }} />
          ) : (
            <div style={{ aspectRatio: '4/3', borderRadius: 8, border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              Sin foto todavía
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Datos del resguardo</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <Dato label="Número" valor={material.numero} />
          <Dato label="No. Resguardo interno" valor={material.no_resguardo_interno} mono />
          <Dato label="Resguardo anterior" valor={material.resguardo_anterior} mono />
          <Dato label="No. Serie" valor={material.no_serie} mono />
          <Dato label="Color" valor={material.color} />
          <Dato label="Clasificación" valor={material.clasificacion} />
          <Dato label="Unidad" valor={material.unidad} />
          <Dato label="Resguardante" valor={material.resguardante} />
          <Dato label="Bodega" valor={material.bodega_nombre} />
        </div>
        {material.descripcion && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Descripción</div>
            <div style={{ fontSize: 14 }}>{material.descripcion}</div>
          </div>
        )}
        {material.observaciones && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Observaciones</div>
            <div style={{ fontSize: 14 }}>{material.observaciones}</div>
          </div>
        )}
      </div>

      {puedeEditar && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <Link to={`/material/${id}/editar`} className="btn btn-outline">Editar</Link>
          {material.activo
            ? <button className="btn btn-danger" onClick={darDeBaja}>Dar de baja</button>
            : <button className="btn btn-outline" onClick={reactivar}>Reactivar</button>}
          {esAdmin && <button className="btn btn-ghost" onClick={eliminar}>Eliminar definitivamente</button>}
        </div>
      )}

      <div className="card">
        <h3 style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Historial de movimientos</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {material.historial.map((h) => (
            <div key={h.id} style={{ display: 'flex', gap: 12, fontSize: 13 }}>
              <span className={`badge badge-${h.tipo === 'alta' ? 'nuevo' : h.tipo === 'baja' ? 'baja' : 'usado'}`} style={{ textTransform: 'capitalize', minWidth: 90, justifyContent: 'center' }}>{h.tipo}</span>
              <div>
                <div>{h.detalle}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{h.usuario_nombre} · {new Date(h.creado_en).toLocaleString('es-MX')}</div>
              </div>
            </div>
          ))}
          {material.historial.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Sin movimientos registrados.</p>}
        </div>
      </div>
    </Layout>
  );
}

function Dato({ label, valor, mono }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
      <div className={mono ? 'mono' : ''} style={{ fontSize: 14 }}>{valor || '—'}</div>
    </div>
  );
}
