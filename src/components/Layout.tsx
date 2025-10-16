import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.scss';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout-root">
      <Header />
      <div className="layout-main">
        <Sidebar />
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
}
