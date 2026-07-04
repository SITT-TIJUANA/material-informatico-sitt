import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import MapaUbicacion from '../components/MapaUbicacion.jsx';
import { api } from '../api/client.js';

const CLASIFICACIONES = ['Cómputo', 'Red', 'Video', 'Audio', 'Comunicación', 'Electricidad', 'Herramienta', 'Acceso', 'Cable', 'Equipo'];

const VACIO = {
  numero: '', articulo: '', marca: '', modelo: '', no_serie: '', color: '',
  no_resguardo_interno: '', clasificacion: '', resguardo_anterior: '', descripcion: '',
  unidad: '1', observaciones: '', resguardante: '', condicion: 'Nuevo', bodega_id: ''
};

export default function MaterialForm() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();

  const [datos, setDatos] = useState(VACIO);
  const [bodegas, setBodegas] = useState([]);
  const [pin, setPin] = useState({ x: null, y: null });
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [fotoActualUrl, setFotoActualUrl] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/bodegas').then((r) => setBodegas(r.data));
    if (editando) {
      api.get(`/materiales/${id}`).then(({ data }) => {
        setDatos({ ...VACIO, ...data, bodega_id: data.bodega_id || '' });
        setPin({ x: data.pos_x, y: data.pos_y });
        setFotoActualUrl(data.foto_material_url);
      });
    }
  }, [id]);

  const bodegaSeleccionada = bodegas.find((b) => String(b.id) === String(datos.bodega_id));

  function actualizar(campo, valor) {
    setDatos((d) => ({ ...d, [campo]: valor }));
  }

  function manejarArchivo(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFoto(file);
    setFotoPreview(URL.createObjectURL(file));
  }

  async function manejarSubmit(e) {
    e.preventDefault();
    if (!datos.articulo.trim()) { setError('El nombre del artículo es obligatorio'); return; }
    setGuardando(true); setError('');

    const form = new FormData();
    Object.entries(datos).forEach(([k, v]) => form.append(k, v ?? ''));
    if (pin.x != null) form.append('pos_x', pin.x);
    if (pin.y != null) form.append('pos_y', pin.y);
    if (foto) form.append('foto', foto);

    try {
      if (editando) {
        await api.put(`/materiales/${id}`, form);
        navigate(`/material/${id}`);
      } else {
        const { data } = await api.post('/materiales', form);
        navigate(`/material/${data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo guardar el material');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Layout>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>{editando ? 'Editar material' : 'Dar de alta un material'}</h1>

      <form onSubmit={manejarSubmit}>
        <div className="g2" style={{ marginBottom: 16 }}>
          <div className="card">
            <h3 style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Foto del material</h3>
            <div style={{
              aspectRatio: '4/3', borderRadius: 8, overflow: 'hidden', background: 'var(--surface-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, border: '1px solid var(--border)'
            }}>
              {(fotoPreview || fotoActualUrl)
                ? <img src={fotoPreview || fotoActualUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Sin foto</span>}
            </div>
            <label className="btn btn-outline" style={{ cursor: 'pointer', display: 'inline-flex' }}>
              Tomar / subir foto
              <input type="file" accept="image/*" capture="environment" onChange={manejarArchivo} style={{ display: 'none' }} />
            </label>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ubicación en bodega</h3>
            <div className="field" style={{ marginBottom: 12 }}>
              <select value={datos.bodega_id} onChange={(e) => { actualizar('bodega_id', e.target.value); setPin({ x: null, y: null }); }}>
                <option value="">Selecciona una bodega</option>
                {bodegas.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
              </select>
            </div>
            {bodegaSeleccionada && (
              <MapaUbicacion
                fotoUrl={bodegaSeleccionada.foto_url}
                x={pin.x} y={pin.y}
                editable
                onChange={(p) => setPin(p)}
                nombreBodega={bodegaSeleccionada.nombre}
              />
            )}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Datos del resguardo</h3>
          <div className="g3">
            <Campo label="Artículo *" valor={datos.articulo} onChange={(v) => actualizar('articulo', v)} />
            <Campo label="Número" valor={datos.numero} onChange={(v) => actualizar('numero', v)} />
            <Campo label="Marca" valor={datos.marca} onChange={(v) => actualizar('marca', v)} />
            <Campo label="Modelo" valor={datos.modelo} onChange={(v) => actualizar('modelo', v)} />
            <Campo label="No. Serie" valor={datos.no_serie} onChange={(v) => actualizar('no_serie', v)} />
            <Campo label="Color" valor={datos.color} onChange={(v) => actualizar('color', v)} />
            <Campo label="No. Resguardo interno" valor={datos.no_resguardo_interno} onChange={(v) => actualizar('no_resguardo_interno', v)} />
            <Campo label="Resguardo anterior" valor={datos.resguardo_anterior} onChange={(v) => actualizar('resguardo_anterior', v)} />
            <Campo label="Resguardante" valor={datos.resguardante} onChange={(v) => actualizar('resguardante', v)} />
            <Campo label="Unidad" valor={datos.unidad} onChange={(v) => actualizar('unidad', v)} />

            <div className="field">
              <label>Clasificación</label>
              <select value={datos.clasificacion} onChange={(e) => actualizar('clasificacion', e.target.value)}>
                <option value="">Selecciona…</option>
                {CLASIFICACIONES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Condición</label>
              <select value={datos.condicion} onChange={(e) => actualizar('condicion', e.target.value)}>
                <option value="Nuevo">Nuevo</option>
                <option value="Usado">Usado</option>
                <option value="Dañado">Dañado</option>
              </select>
            </div>
          </div>

          <div className="field" style={{ marginTop: 4 }}>
            <label>Descripción</label>
            <textarea rows={2} value={datos.descripcion} onChange={(e) => actualizar('descripcion', e.target.value)} />
          </div>
          <div className="field">
            <label>Observaciones</label>
            <textarea rows={2} value={datos.observaciones} onChange={(e) => actualizar('observaciones', e.target.value)} />
          </div>
        </div>

        {error && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 14 }}>{error}</div>}

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" disabled={guardando}>{guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Dar de alta'}</button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </form>
    </Layout>
  );
}

function Campo({ label, valor, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input value={valor || ''} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
