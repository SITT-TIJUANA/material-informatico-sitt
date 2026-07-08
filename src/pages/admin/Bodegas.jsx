import { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import TarjetaSubidaFoto from '../../components/TarjetaSubidaFoto.jsx';
import { api } from '../../api/client.js';

export default function Bodegas() {
  const [bodegas, setBodegas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [edit, setEdit] = useState({ nombre: '', descripcion: '' });

  async function cargar() {
    const { data } = await api.get('/bodegas');
    setBodegas(data);
  }
  useEffect(() => { cargar(); }, []);

  async function crear(e) {
    e.preventDefault();
    if (!nombre.trim()) return;
    setGuardando(true);
    const form = new FormData();
    form.append('nombre', nombre);
    form.append('descripcion', descripcion);
    if (foto) form.append('foto', foto);
    await api.post('/bodegas', form);
    setNombre(''); setDescripcion(''); setFoto(null); setFotoPreview(null);
    await cargar();
    setGuardando(false);
  }

  async function actualizarFoto(bodegaId, file) {
    const form = new FormData();
    form.append('foto', file);
    await api.put(`/bodegas/${bodegaId}`, form);
    cargar();
  }

  function abrirEdicion(b) {
    setEditandoId(b.id);
    setEdit({ nombre: b.nombre, descripcion: b.descripcion || '' });
  }

  async function guardarEdicion(bodegaId) {
    const form = new FormData();
    form.append('nombre', edit.nombre);
    form.append('descripcion', edit.descripcion);
    await api.put(`/bodegas/${bodegaId}`, form);
    setEditandoId(null);
    cargar();
  }

  async function eliminarBodega(b) {
    const ok = confirm(
      `¿Eliminar la bodega "${b.nombre}"? Los materiales que estaban ahí no se borran, solo quedan sin bodega asignada.`
    );
    if (!ok) return;
    await api.delete(`/bodegas/${b.id}`);
    cargar();
  }

  return (
    <Layout>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Bodegas</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))', gap: 16, marginBottom: 24 }}>
        {bodegas.map((b) => (
          <div key={b.id} className="card">
            <div style={{ marginBottom: 12 }}>
              <TarjetaSubidaFoto
                titulo={b.foto_url ? 'Reemplazar foto' : 'Subir foto general'}
                descripcion="Foto completa de la bodega, tomada de frente — sobre esta imagen se marcará después la ubicación exacta de cada material."
                previewUrl={b.foto_url}
                onArchivo={(file) => actualizarFoto(b.id, file)}
              />
            </div>

            {editandoId === b.id ? (
              <div>
                <div className="field" style={{ marginBottom: 8 }}>
                  <label>Nombre</label>
                  <input value={edit.nombre} onChange={(e) => setEdit({ ...edit, nombre: e.target.value })} />
                </div>
                <div className="field" style={{ marginBottom: 10 }}>
                  <label>Descripción</label>
                  <input value={edit.descripcion} onChange={(e) => setEdit({ ...edit, descripcion: e.target.value })} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => guardarEdicion(b.id)}>Guardar</button>
                  <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setEditandoId(null)}>Cancelar</button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{b.nombre}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>{b.descripcion || 'Sin descripción'}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-outline" style={{ fontSize: 13 }} onClick={() => abrirEdicion(b)}>Editar</button>
                  <button className="btn btn-danger" style={{ fontSize: 13 }} onClick={() => eliminarBodega(b)}>Eliminar</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card" style={{ maxWidth: 480 }}>
        <h3 style={{ fontSize: 15, marginBottom: 14 }}>Agregar bodega</h3>
        <form onSubmit={crear}>
          <div className="field">
            <label>Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Bodega Principal" />
          </div>
          <div className="field">
            <label>Descripción (opcional)</label>
            <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </div>
          <div className="field">
            <label>Foto general de la bodega</label>
            <TarjetaSubidaFoto
              titulo="Foto de la bodega"
              descripcion="Foto completa del espacio, tomada de frente — sobre ella vas a poder marcar después dónde está cada material."
              previewUrl={fotoPreview}
              onArchivo={(file) => { setFoto(file); setFotoPreview(URL.createObjectURL(file)); }}
            />
          </div>
          <button className="btn btn-primary" disabled={guardando} style={{ marginTop: 4 }}>{guardando ? 'Guardando…' : 'Agregar bodega'}</button>
        </form>
      </div>
    </Layout>
  );
}
