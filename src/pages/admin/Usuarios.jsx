import { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import { api } from '../../api/client.js';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ nombre: '', correo: '', password: '', rol: 'consulta' });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

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
      setForm({ nombre: '', correo: '', password: '', rol: 'consulta' });
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo crear el usuario');
    } finally {
      setGuardando(false);
    }
  }

  async function cambiarRol(id, rol) {
    await api.patch(`/auth/usuarios/${id}`, { rol });
    cargar();
  }
  async function alternarActivo(id, activo) {
    await api.patch(`/auth/usuarios/${id}`, { activo: !activo });
    cargar();
  }

  return (
    <Layout>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Usuarios</h1>

      <div className="card" style={{ marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase' }}>
              <th style={{ padding: '8px 6px' }}>Nombre</th>
              <th style={{ padding: '8px 6px' }}>Correo</th>
              <th style={{ padding: '8px 6px' }}>Rol</th>
              <th style={{ padding: '8px 6px' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 6px' }}>{u.nombre}</td>
                <td style={{ padding: '10px 6px', color: 'var(--text-muted)' }}>{u.correo}</td>
                <td style={{ padding: '10px 6px' }}>
                  <select value={u.rol} onChange={(e) => cambiarRol(u.id, e.target.value)}>
                    <option value="administrador">Administrador</option>
                    <option value="editor">Editor</option>
                    <option value="consulta">Consulta</option>
                  </select>
                </td>
                <td style={{ padding: '10px 6px' }}>
                  <button className={`btn ${u.activo ? 'btn-outline' : 'btn-danger'}`} style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => alternarActivo(u.id, u.activo)}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
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
