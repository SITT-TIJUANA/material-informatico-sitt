import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeToggle({ size = 40 }) {
  const { esOscuro, alternarTema } = useTheme();
  const inner = size - 8; // deja 4px de margen por lado, como el diseño original (w-12/h-12 con after w-10/h-10)

  return (
    <label
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <style>{`
        @keyframes girarInterruptor { from { transform: rotate(-180deg); } to { transform: rotate(0deg); } }
      `}</style>
      <input
        type="checkbox"
        checked={esOscuro}
        onChange={alternarTema}
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
      />
      <div
        onClick={alternarTema}
        style={{
          width: size, height: size, borderRadius: '50%', position: 'relative',
          background: esOscuro ? '#10b981' : '#fb7185',
          boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
          transition: 'background-color 0.3s ease'
        }}
      >
        <div
          style={{
            position: 'absolute', top: 4, left: 4, width: inner, height: inner, borderRadius: '50%',
            background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: inner * 0.42, lineHeight: 1,
            transform: esOscuro ? 'rotate(0deg)' : 'rotate(-180deg)',
            transition: 'transform 0.5s ease'
          }}
        >
          {esOscuro ? '🌙' : '☀️'}
        </div>
      </div>
    </label>
  );
}
