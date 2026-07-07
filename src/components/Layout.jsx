import Sidebar from './Sidebar.jsx';
import BottomNav from './BottomNav.jsx';
import FichaUsuario from './FichaUsuario.jsx';
import FondoAmbiente from './FondoAmbiente.jsx';

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <FondoAmbiente />
      <div className="sidebar-desktop">
        <Sidebar />
      </div>
      <main className="app-main" style={{ flex: 1, maxWidth: 1200 }}>
        {children}
      </main>
      <BottomNav />
      <FichaUsuario />
    </div>
  );
}
