import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Modal from './Modal.jsx';

export default function QRConectar({ abierto, onCerrar }) {
  const [imagen, setImagen] = useState(null);
  const url = window.location.origin + import.meta.env.BASE_URL;

  useEffect(() => {
    if (!abierto) return;
    QRCode.toDataURL(url, {
      width: 260, margin: 1,
      color: { dark: '#0B2B29', light: '#FFFFFF' }
    }).then(setImagen);
  }, [abierto]);

  return (
    <Modal abierto={abierto} onCerrar={onCerrar} ancho={380}>
      <div style={{ padding: 28, textAlign: 'center' }}>
        <h3 style={{ fontSize: 18, marginBottom: 6 }}>Conectar mi teléfono</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 13.5, marginBottom: 20 }}>
          Escanea este código desde la cámara de tu celular para abrir la app y, si quieres, instalarla en tu pantalla de inicio.
        </p>

        <div style={{
          display: 'inline-flex', padding: 16, borderRadius: 16, background: 'var(--surface-2)',
          border: '1px solid var(--border)', marginBottom: 18
        }}>
          {imagen
            ? <img src={imagen} alt="Código QR para abrir la app" width={220} height={220} style={{ display: 'block', borderRadius: 8 }} />
            : <div style={{ width: 220, height: 220 }} />}
        </div>

        <div style={{
          fontSize: 12.5, color: 'var(--text-muted)', wordBreak: 'break-all',
          background: 'var(--surface-2)', padding: '8px 12px', borderRadius: 10, marginBottom: 16
        }}>
          {url}
        </div>

        <button className="btn btn-outline" style={{ width: '100%' }} onClick={onCerrar}>Cerrar</button>
      </div>
    </Modal>
  );
}
