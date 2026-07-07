import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeToggle({ size = 40 }) {
  const { esOscuro, alternarTema } = useTheme();
  const inner = size - 8; // deja 4px de margen por lado

  return (
    <button
      type="button"
      role="switch"
      aria-checked={esOscuro}
      aria-label="Cambiar modo claro / oscuro"
      onClick={alternarTema}
      style={{
        width: size, height: size, borderRadius: '50%', position: 'relative',
        background: esOscuro ? '#10b981' : '#fb7185',
        boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
        border: 'none', padding: 0, cursor: 'pointer',
        transition: 'background-color 0.3s ease', flexShrink: 0
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
    </button>
  );
}
