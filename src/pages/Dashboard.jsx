import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import Layout from '../components/Layout.jsx';
import { api } from '../api/client.js';

const COLORES = ['#0FB8A6', '#E7A94C', '#2FBE7F', '#E8615B', '#5E7B78', '#7C6FE0', '#5AC8E0'];

export default function Dashboard() {
  const [resumen, setResumen] = useState(null);
  const [sinMovimiento, setSinMovimiento] = useState(null);

  useEffect(() => {
    api.get('/dashboard/resumen').then((r) => setResumen(r.data));
    api.get('/dashboard/sin-movimiento').then((r) => setSinMovimiento(r.data));
  }, []);

  return (
    <Layout>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Panel general</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Estado actual del inventario informático</p>

      <div className="g3" style={{ marginBottom: 24 }}>
        <Tarjeta label="Materiales activos" valor={resumen?.total ?? '—'} color="var(--aqua)" />
        <Tarjeta label="Bajas registradas" valor={resumen?.bajas ?? '—'} color="var(--red)" />
        <Tarjeta label="Sin movimiento" valor={sinMovimiento?.materiales?.length ?? '—'} color="var(--gold)"
          nota={sinMovimiento ? `+${sinMovimiento.dias} días sin cambios` : ''} />
      </div>

      {sinMovimiento?.materiales?.length > 0 && (
        <div className="card" style={{ marginBottom: 24, borderColor: 'rgba(242,169,59,0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, color: 'var(--gold)' }}>Materiales sin movimiento reciente</h3>
            <span className="badge badge-usado">{sinMovimiento.materiales.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sinMovimiento.materiales.slice(0, 6).map((m) => (
              <Link key={m.id} to={`/material/${m.id}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 10px', borderRadius: 6, background: 'var(--surface-2)' }}>
                <span>{m.articulo}</span>
                <span style={{ color: 'var(--text-muted)' }} className="mono">{m.no_resguardo_interno || '—'}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="g-charts" style={{ marginBottom: 16 }}>
        <div className="card">
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Materiales por clasificación</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={resumen?.porClasificacion || []} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCEEEB" horizontal={false} />
              <XAxis type="number" stroke="#5E7B78" fontSize={12} />
              <YAxis type="category" dataKey="nombre" stroke="#5E7B78" fontSize={12} width={110} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #DCEEEB', boxShadow: '0 8px 24px rgba(10,60,55,0.12)', borderRadius: 8 }} />
              <Bar dataKey="total" fill="#0FB8A6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Condición del equipo</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={resumen?.porCondicion || []} dataKey="total" nameKey="nombre" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {(resumen?.porCondicion || []).map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #DCEEEB', boxShadow: '0 8px 24px rgba(10,60,55,0.12)', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 15, marginBottom: 16 }}>Altas por mes</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={resumen?.altasPorMes || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DCEEEB" vertical={false} />
            <XAxis dataKey="mes" stroke="#5E7B78" fontSize={12} />
            <YAxis stroke="#5E7B78" fontSize={12} allowDecimals={false} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #DCEEEB', boxShadow: '0 8px 24px rgba(10,60,55,0.12)', borderRadius: 8 }} />
            <Bar dataKey="total" fill="#E7A94C" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Layout>
  );
}

function Tarjeta({ label, valor, color, nota }) {
  return (
    <div className="card">
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color }}>{valor}</div>
      {nota && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{nota}</div>}
    </div>
  );
}
