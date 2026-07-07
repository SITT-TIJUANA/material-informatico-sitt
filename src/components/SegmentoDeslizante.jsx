// Control segmentado con una "pastilla" que se desliza entre opciones,
// con movimiento tipo líquido (rebote suave) y un brillo que la recorre.

export default function SegmentoDeslizante({ opciones, valor, onChange }) {
  const activo = Math.max(0, opciones.findIndex((o) => o.value === valor));
  const n = opciones.length;

  return (
    <div style={{ display: 'inline-block' }}>
      <style>{`
        @keyframes brilloSegmento {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
      <div
        style={{
          position: 'relative', display: 'flex', background: 'var(--surface-2)',
          borderRadius: 100, padding: 4, boxShadow: 'inset 0 1px 3px rgba(10,60,55,0.08)'
        }}
      >
        {/* Pastilla que se desliza */}
        <div
          style={{
            position: 'absolute', top: 4, left: 4, bottom: 4,
            width: `calc(${100 / n}% - 4px)`,
            transform: `translateX(calc(${activo * 100}% + ${activo * 4}px))`,
            transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            borderRadius: 100, pointerEvents: 'none'
          }}
        >
          <div style={{
            width: '100%', height: '100%', borderRadius: 100,
            background: 'linear-gradient(135deg, var(--aqua), var(--aqua-dark))',
            boxShadow: '0 4px 14px rgba(15,184,166,0.4), inset 0 1px 1px rgba(255,255,255,0.4)',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: 0, left: '10%', width: '80%', height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)',
              animation: 'brilloSegmento 2.4s ease-in-out infinite'
            }} />
          </div>
        </div>

        {opciones.map((o) => {
          const seleccionado = o.value === valor;
          return (
            <button
              key={o.value}
              onClick={() => onChange(o.value)}
              style={{
                position: 'relative', zIndex: 1, padding: '8px 18px', borderRadius: 100,
                border: 'none', background: 'transparent', fontSize: 13.5, fontWeight: 700,
                cursor: 'pointer', flex: 1, whiteSpace: 'nowrap',
                color: seleccionado ? '#fff' : 'var(--text-muted)',
                transition: 'color 0.3s ease'
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
