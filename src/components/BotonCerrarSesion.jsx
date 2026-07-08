let estilosInyectados = false;
function inyectarEstilos() {
  if (estilosInyectados) return;
  estilosInyectados = true;
  const style = document.createElement('style');
  style.textContent = `
    .btn-cerrar-sesion {
      display: flex; align-items: center; justify-content: flex-start;
      width: 46px; height: 46px; border: none; border-radius: 50%; cursor: pointer;
      position: relative; overflow: hidden; transition-duration: .3s;
      box-shadow: 2px 2px 10px rgba(0,0,0,0.18);
      background-color: var(--red);
    }
    .btn-cerrar-sesion .bcs-icono {
      width: 100%; transition-duration: .3s; display: flex; align-items: center; justify-content: center;
    }
    .btn-cerrar-sesion .bcs-icono svg { width: 18px; height: 18px; }
    .btn-cerrar-sesion .bcs-texto {
      position: absolute; right: 0; width: 0; opacity: 0; color: #fff;
      font-size: 14px; font-weight: 700; white-space: nowrap; transition-duration: .3s;
    }
    .btn-cerrar-sesion:hover { width: 156px; border-radius: 40px; }
    .btn-cerrar-sesion:hover .bcs-icono { width: 30%; padding-left: 18px; }
    .btn-cerrar-sesion:hover .bcs-texto { opacity: 1; width: 70%; padding-right: 10px; }
    .btn-cerrar-sesion:active { transform: translate(2px, 2px); }
  `;
  document.head.appendChild(style);
}

export default function BotonCerrarSesion({ onClick, texto = 'Cerrar sesión' }) {
  inyectarEstilos();
  return (
    <button className="btn-cerrar-sesion" onClick={onClick} aria-label={texto}>
      <span className="bcs-icono">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5M21 12H9" />
        </svg>
      </span>
      <span className="bcs-texto">{texto}</span>
    </button>
  );
}
