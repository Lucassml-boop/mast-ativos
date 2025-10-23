import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    async function check() {
      if (!user) {
        if (mounted) setAllowed(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        const data = snap.exists() ? (snap.data() as any) : null;
        if (mounted) setAllowed(!!(data && data.isAdmin) || (user as any)?.admin === true);
      } catch (e) {
        console.error('ProtectedRoute check error', e);
        if (mounted) setAllowed(false);
      }
    }
    if (!loading) check();
    return () => { mounted = false; };
  }, [user, loading]);

  if (loading || allowed === null) return <div className="card">Verificando permissões...</div>;
  if (!allowed) return <Navigate to="/" replace />;
  return <>{children}</>;
}
