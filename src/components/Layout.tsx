import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.scss';
import { useEffect, useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // initialize sidebar state from localStorage for desktop
  useEffect(() => {
    try {
      const raw = localStorage.getItem('mast-sidebar-open');
      if (raw !== null) {
        setSidebarOpen(raw === '1');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // persist when changes
  useEffect(() => {
    try {
      localStorage.setItem('mast-sidebar-open', sidebarOpen ? '1' : '0');
    } catch (e) {
      // ignore
    }
  }, [sidebarOpen]);

  // track whether viewport is mobile (matches CSS breakpoint)
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth <= 900 : false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', onResize);
    // ensure initial state
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="layout-root">
      <Header onToggleSidebar={() => setSidebarOpen((s) => !s)} />
      <div className="layout-main">
        <Sidebar
          open={sidebarOpen}
          onNavigate={() => { if (isMobile) setSidebarOpen(false); }}
          onEnsureOpen={() => setSidebarOpen(true)}
        />
        {/* Backdrop for mobile drawer (only render on small screens) */}
        {sidebarOpen && isMobile && (
          <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
        )}
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
}
