import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Modal from './Modal.jsx';
import { api } from '../api/client.js';

const DURACION_SEGUNDOS = 90;

export default function QRConectar({ abierto, onCerrar }) {
  const [imagen, setImagen] = useState(null);
  const [segundosRestantes, setSegundosRestantes] = useState(DURACION_SEGUNDOS);
  const [error, setError] = useState('');

  async function generar() {
    setError(''); setImagen(null);
    try {
      const { data } = await api.post('/auth/qr-sesion');
      const url = `${window.location.origin}${import.meta.env.BASE_URL}#/entrar-qr?t=${data.token}`;
      const dataUrl = await QRCode.toDataURL(url, {
        width: 260, margin: 1,
        color: { dark: '#0B2B29', light: '#FFFFFF' }
      });
      setImagen(dataUrl);
      setSegundosRestantes(DURACION_SEGUNDOS);
    } catch {
      setError('No se pudo generar el código. Intenta de nuevo.');
    }
  }

  useEffect(() => {
    if (!abierto) return;
    generar();
  }, [abierto]);

  useEffect(() => {
    if (!abierto || !imagen) return;
    const intervalo = setInterval(() => {
      setSegundosRestantes((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(intervalo);
  }, [abierto, imagen]);

  const expirado = segundosRestantes <= 0;

  return (
    <Modal abierto={abierto} onCerrar={onCerrar} ancho={380}>
      <div style={{ padding: 28, textAlign: 'center' }}>
        <h3 style={{ fontSize: 18, marginBottom: 6 }}>Conectar mi teléfono</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 13.5, marginBottom: 20 }}>
          Escanea este código con la cámara de tu celular — se abre la app y entra directo con tu misma cuenta, sin pedir correo ni contraseña.
        </p>

        <div style={{
          display: 'inline-flex', padding: 16, borderRadius: 16, background: 'var(--surface-2)',
          border: '1px solid var(--border)', marginBottom: 14, position: 'relative'
        }}>
          {imagen && !expirado && (
            <img src={imagen} alt="Código QR para entrar automáticamente" width={220} height={220} style={{ display: 'block', borderRadius: 8 }} />
          )}
          {imagen && expirado && (
            <div style={{
              width: 220, height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10
            }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Este código ya venció</p>
              <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={generar}>Generar uno nuevo</button>
            </div>
          )}
          {!imagen && !error && <div style={{ width: 220, height: 220 }} />}
        </div>

        {error && (
          <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 14 }}>
            {error} <button className="btn btn-ghost" style={{ fontSize: 13, padding: 0 }} onClick={generar}>Reintentar</button>
          </div>
        )}

        {imagen && !expirado && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
            Válido por {segundosRestantes} segundo{segundosRestantes === 1 ? '' : 's'} — por seguridad, solo sirve una vez.
          </p>
        )}

        <button className="btn btn-outline" style={{ width: '100%' }} onClick={onCerrar}>Cerrar</button>
      </div>
    </Modal>
  );
}
