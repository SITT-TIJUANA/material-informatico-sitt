import Sidebar from './Sidebar.jsx';
import BottomNav from './BottomNav.jsx';

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div className="sidebar-desktop">
        <Sidebar />
      </div>
      <main className="app-main" style={{ flex: 1, maxWidth: 1200 }}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
