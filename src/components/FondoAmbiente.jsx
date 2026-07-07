const ICONOS_AMBIENTE = [
  { left: '6%', size: 20, delay: '0s', duration: '26s', tipo: 'chip' },
  { left: '22%', size: 16, delay: '9s', duration: '22s', tipo: 'monitor' },
  { left: '40%', size: 18, delay: '4s', duration: '28s', tipo: 'laptop' },
  { left: '58%', size: 15, delay: '15s', duration: '24s', tipo: 'servidor' },
  { left: '74%', size: 19, delay: '7s', duration: '30s', tipo: 'chip' },
  { left: '90%', size: 16, delay: '18s', duration: '25s', tipo: 'monitor' },
];

function IconoAmbiente({ tipo, ...p }) {
  const comun = { fill: 'none', stroke: 'var(--aqua)', strokeWidth: 1.6 };
  if (tipo === 'laptop') return <svg {...p} viewBox="0 0 24 24" {...comun}><rect x="4" y="4" width="16" height="11" rx="1.5" /><path d="M2 18h20l-2 2H4l-2-2Z" /></svg>;
  if (tipo === 'servidor') return <svg {...p} viewBox="0 0 24 24" {...comun}><rect x="4" y="3" width="16" height="6" rx="1.2" /><rect x="4" y="11" width="16" height="6" rx="1.2" /></svg>;
  if (tipo === 'chip') return <svg {...p} viewBox="0 0 24 24" {...comun}><rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" /></svg>;
  return <svg {...p} viewBox="0 0 24 24" {...comun}><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M9 20h6M12 16v4" /></svg>;
}

export default function FondoAmbiente() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <style>{`
        @keyframes auroraFlotar1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(4%, 6%) scale(1.08); }
        }
        @keyframes auroraFlotar2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-5%, -4%) scale(1.05); }
        }
        @keyframes iconoAmbienteCae {
          0% { transform: translateY(-6vh) rotate(0deg); opacity: 0; }
          8% { opacity: 0.32; }
          92% { opacity: 0.32; }
          100% { transform: translateY(106vh) rotate(20deg); opacity: 0; }
        }
      `}</style>

      {/* Auroras difuminadas */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-8%', width: '46vw', height: '46vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(15,184,166,0.22), transparent 70%)',
        filter: 'blur(50px)', animation: 'auroraFlotar1 22s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute', bottom: '-14%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(231,169,76,0.2), transparent 70%)',
        filter: 'blur(60px)', animation: 'auroraFlotar2 26s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute', top: '35%', left: '40%', width: '30vw', height: '30vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(15,184,166,0.16), transparent 70%)',
        filter: 'blur(70px)', animation: 'auroraFlotar1 30s ease-in-out infinite reverse'
      }} />

      {/* Lluvia de iconos, sutil pero visible */}
      {ICONOS_AMBIENTE.map((it, i) => (
        <IconoAmbiente
          key={i}
          tipo={it.tipo}
          width={it.size}
          height={it.size}
          style={{
            position: 'absolute', top: 0, left: it.left,
            animation: `iconoAmbienteCae ${it.duration} linear ${it.delay} infinite`
          }}
        />
      ))}
    </div>
  );
}
