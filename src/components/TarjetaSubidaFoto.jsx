import { useRef, useState } from 'react';

let estilosInyectados = false;
function inyectarEstilos() {
  if (estilosInyectados) return;
  estilosInyectados = true;
  const style = document.createElement('style');
  style.textContent = `
    .tarjeta-subida {
      position: relative; width: 100%; aspect-ratio: 4 / 3;
      background-color: var(--surface-2); border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden; perspective: 1000px; cursor: pointer;
      border: 1px solid var(--border);
      box-shadow: 0 0 0 4px var(--surface);
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      -webkit-tap-highlight-color: transparent; -webkit-touch-callout: none;
    }
    .tarjeta-subida:hover { transform: scale(1.015); box-shadow: var(--shadow-lg); }
    .tarjeta-subida__icono {
      width: 40px; height: 40px; color: var(--aqua-dark);
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .tarjeta-subida__preview {
      position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
    }
    .tarjeta-subida__contenido {
      position: absolute; inset: 0; padding: 16px; box-sizing: border-box;
      background: rgba(11,43,41,0.82); backdrop-filter: blur(2px);
      display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
      transform: rotateX(-90deg); transform-origin: bottom;
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .tarjeta-subida__titulo { margin: 0; font-size: 14px; font-weight: 700; color: #fff; font-family: var(--font-display); }
    .tarjeta-subida__desc { margin: 6px 0 0; font-size: 12px; color: rgba(255,255,255,0.85); line-height: 1.4; }

    @media (hover: hover) {
      .tarjeta-subida:hover .tarjeta-subida__icono { transform: scale(0); opacity: 0; }
      .tarjeta-subida:hover .tarjeta-subida__contenido { transform: rotateX(0deg); }
    }
    @media (hover: none) {
      .tarjeta-subida__desc { display: block; }
      .tarjeta-subida.presionando .tarjeta-subida__icono { transform: scale(0); opacity: 0; }
      .tarjeta-subida.presionando .tarjeta-subida__contenido { transform: rotateX(0deg); }
    }
  `;
  document.head.appendChild(style);
}

export default function TarjetaSubidaFoto({ titulo, descripcion, previewUrl, onArchivo, capture }) {
  inyectarEstilos();
  const inputRef = useRef(null);
  const [presionando, setPresionando] = useState(false);
  const temporizador = useRef(null);
  const seMovio = useRef(false);

  function manejarCambio(e) {
    const file = e.target.files?.[0];
    if (file) onArchivo(file);
  }

  function iniciarPresion() {
    seMovio.current = false;
    temporizador.current = setTimeout(() => setPresionando(true), 280);
  }
  function cancelarPresion() {
    clearTimeout(temporizador.current);
  }
  function soltar() {
    clearTimeout(temporizador.current);
    if (presionando) {
      // Si ya se estaba mostrando la descripción, este toque solo la cierra
      setPresionando(false);
    } else if (!seMovio.current) {
      // Toque normal y corto: abre selector de archivo
      inputRef.current?.click();
    }
  }

  return (
    <div
      className={`tarjeta-subida${presionando ? ' presionando' : ''}`}
      onClick={(e) => {
        // En dispositivos con mouse real, el click normal sigue abriendo el selector
        if (window.matchMedia('(hover: hover)').matches) inputRef.current?.click();
      }}
      onTouchStart={iniciarPresion}
      onTouchMove={() => { seMovio.current = true; cancelarPresion(); }}
      onTouchEnd={soltar}
      onTouchCancel={cancelarPresion}
    >
      <img
        src={previewUrl || undefined}
        alt=""
        className="tarjeta-subida__preview"
        style={{ display: previewUrl ? 'block' : 'none' }}
      />

      {!previewUrl && (
        <svg className="tarjeta-subida__icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
          <circle cx="12" cy="14" r="3.5" />
        </svg>
      )}

      <div className="tarjeta-subida__contenido">
        <p className="tarjeta-subida__titulo">{titulo}</p>
        <p className="tarjeta-subida__desc">{descripcion}</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture={capture}
        onChange={manejarCambio}
        style={{ display: 'none' }}
      />
    </div>
  );
}
