import { FiBell, FiSettings } from 'react-icons/fi';
import './Header.scss';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import exportAtivosToExcel from '../utils/exportExcel';
import AuthBox from './AuthBox';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function Header() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function checkAdmin() {
      if (!user) {
        if (mounted) setIsAdmin(false);
        return;
      }
      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (mounted && snap.exists()) {
          const data = snap.data() as any;
          setIsAdmin(!!data.isAdmin);
        } else {
          if (mounted) setIsAdmin(false);
        }
      } catch (e) {
        console.error('Erro ao checar admin', e);
        if (mounted) setIsAdmin(false);
      }
    }
    checkAdmin();
    return () => { mounted = false; };
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Erro ao sair', e);
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <span className="logo">Mast Ativos</span>
        </div>
        <div className="header-center">
          <input
            type="text"
            className="search-input"
            placeholder="Pesquisar..."
          />
        </div>
        <div className="header-right">
          <FiBell className="header-icon" />
          <FiSettings className="header-icon" />
          {/* Mostrar botão de exportação apenas para admins */}
          {!loading && isAdmin && (
            <button
              className="btn btn-export"
              onClick={() => exportAtivosToExcel('ativos.xlsx')}
              style={{ marginRight: 12 }}
            >
              Exportar Excel
            </button>
          )}

          {/* Login / Logout */}
          {!loading && !user && (
            <button className="btn btn-primary" onClick={() => setAuthOpen(true)} style={{ marginRight: 12 }}>
              Entrar
            </button>
          )}

          {!loading && user && (
            <button className="btn btn-secondary" onClick={handleLogout} style={{ marginRight: 12 }}>
              Sair
            </button>
          )}

          <div className="avatar-wrapper">
            <img
              src="https://i.pravatar.cc/40?img=3"
              alt="Avatar"
              className="avatar"
            />
          </div>
        </div>
      </header>

      <AuthBox open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
