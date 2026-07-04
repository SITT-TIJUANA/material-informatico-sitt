import Sidebar from './Sidebar.jsx';

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '28px 36px', maxWidth: 1200 }}>{children}</main>
    </div>
  );
}
