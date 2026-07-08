import { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import BotonAccion from '../../components/BotonAccion.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../api/client.js';

const IC = {
  editar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>,
  guardar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>,
  cancelar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>,
  eliminar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" /></svg>,
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ nombre: '', correo: '', password: '', rol: 'consulta' });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [edit, setEdit] = useState({ nombre: '', correo: '', rol: 'consulta' });
  const { notificar } = useToast();
  const { usuario: yo } = useAuth();

  async function cargar() {
    const { data } = await api.get('/auth/usuarios');
    setUsuarios(data);
  }
  useEffect(() => { cargar(); }, []);

  async function crear(e) {
    e.preventDefault();
    setGuardando(true); setError('');
    try {
      await api.post('/auth/usuarios', form);
      notificar({ tipo: 'exito', titulo: 'Usuario creado', mensaje: `${form.nombre} ya puede entrar a la app.` });
      setForm({ nombre: '', correo: '', password: '', rol: 'consulta' });
      cargar();
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudo crear el usuario';
      setError(msg);
      notificar({ tipo: 'error', titulo: 'No se pudo crear', mensaje: msg });
    } finally {
      setGuardando(false);
    }
  }

  function abrirEdicion(u) {
    setEditandoId(u.id);
    setEdit({ nombre: u.nombre, correo: u.correo, rol: u.rol });
  }

  async function guardarEdicion(id) {
    try {
      await api.put(`/auth/usuarios/${id}`, edit);
      notificar({ tipo: 'exito', titulo: 'Usuario actualizado' });
      setEditandoId(null);
      cargar();
    } catch (err) {
      notificar({ tipo: 'error', titulo: 'No se pudo guardar', mensaje: err.response?.data?.error || 'Intenta de nuevo.' });
    }
  }

  async function alternarActivo(id, activo) {
    await api.patch(`/auth/usuarios/${id}`, { activo: !activo });
    cargar();
  }

  async function eliminarUsuario(u) {
    const ok = confirm(`¿Eliminar a "${u.nombre}"? Ya no va a poder entrar a la app ni recibir notificaciones.`);
    if (!ok) return;
    try {
      await api.delete(`/auth/usuarios/${u.id}`);
      notificar({ tipo: 'exito', titulo: 'Usuario eliminado', mensaje: `${u.nombre} ya no tiene acceso.` });
      cargar();
    } catch (err) {
      notificar({ tipo: 'error', titulo: 'No se pudo eliminar', mensaje: err.response?.data?.error || 'Intenta de nuevo.' });
    }
  }

  return (
    <Layout>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Usuarios</h1>

      <div className="card" style={{ marginBottom: 24, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase' }}>
              <th style={{ padding: '8px 6px' }}>Nombre</th>
              <th style={{ padding: '8px 6px' }}>Correo</th>
              <th style={{ padding: '8px 6px' }}>Rol</th>
              <th style={{ padding: '8px 6px' }}>Estado</th>
              <th style={{ padding: '8px 6px' }}></th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} style={{ borderTop: '1px solid var(--border)' }}>
                {editandoId === u.id ? (
                  <>
                    <td style={{ padding: '10px 6px' }}>
                      <input value={edit.nombre} onChange={(e) => setEdit({ ...edit, nombre: e.target.value })} style={{ width: 130 }} />
                    </td>
                    <td style={{ padding: '10px 6px' }}>
                      <input value={edit.correo} onChange={(e) => setEdit({ ...edit, correo: e.target.value })} style={{ width: 170 }} />
                    </td>
                    <td style={{ padding: '10px 6px' }}>
                      <select value={edit.rol} onChange={(e) => setEdit({ ...edit, rol: e.target.value })}>
                        <option value="administrador">Administrador</option>
                        <option value="editor">Editor</option>
                        <option value="consulta">Consulta</option>
                      </select>
                    </td>
                    <td style={{ padding: '10px 6px' }} colSpan={2}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <BotonAccion icono={IC.guardar} label="Guardar" color="var(--green)" onClick={() => guardarEdicion(u.id)} />
                        <BotonAccion icono={IC.cancelar} label="Cancelar" color="var(--text-muted)" onClick={() => setEditandoId(null)} />
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: '10px 6px' }}>{u.nombre}</td>
                    <td style={{ padding: '10px 6px', color: 'var(--text-muted)' }}>{u.correo}</td>
                    <td style={{ padding: '10px 6px', textTransform: 'capitalize' }}>{u.rol}</td>
                    <td style={{ padding: '10px 6px' }}>
                      <button className={`btn ${u.activo ? 'btn-outline' : 'btn-danger'}`} style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => alternarActivo(u.id, u.activo)}>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td style={{ padding: '10px 6px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <BotonAccion icono={IC.editar} label="Editar" color="var(--aqua-dark)" onClick={() => abrirEdicion(u)} />
                        {String(u.id) !== String(yo?.id) && (
                          <BotonAccion icono={IC.eliminar} label="Eliminar" color="var(--red)" onClick={() => eliminarUsuario(u)} />
                        )}
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ maxWidth: 420 }}>
        <h3 style={{ fontSize: 15, marginBottom: 14 }}>Agregar usuario</h3>
        <form onSubmit={crear}>
          <div className="field">
            <label>Nombre</label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          </div>
          <div className="field">
            <label>Correo</label>
            <input type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} required />
          </div>
          <div className="field">
            <label>Contraseña temporal</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div className="field">
            <label>Rol</label>
            <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
              <option value="administrador">Administrador — control total</option>
              <option value="editor">Editor — altas, bajas y edición</option>
              <option value="consulta">Consulta — solo lectura</option>
            </select>
          </div>
          {error && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <button className="btn btn-primary" disabled={guardando}>{guardando ? 'Creando…' : 'Crear usuario'}</button>
        </form>
      </div>
    </Layout>
  );
}
