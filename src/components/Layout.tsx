import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.scss';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout-root">
      <Header onToggleSidebar={() => setSidebarOpen((s) => !s)} />
      <div className="layout-main">
        <Sidebar open={sidebarOpen} />
        {/* Backdrop for mobile drawer */}
        {sidebarOpen && (
          <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
        )}
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
}
