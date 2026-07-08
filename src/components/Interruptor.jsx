export default function Interruptor({ activo, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      onClick={() => !disabled && onChange(!activo)}
      disabled={disabled}
      style={{
        width: 40, height: 22, borderRadius: 100, border: 'none', padding: 2,
        background: activo ? 'var(--aqua)' : 'var(--border)', cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', transition: 'background-color .2s ease',
        opacity: disabled ? 0.5 : 1, flexShrink: 0
      }}
    >
      <span style={{
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transform: activo ? 'translateX(18px)' : 'translateX(0)',
        transition: 'transform .2s ease'
      }} />
    </button>
  );
}
