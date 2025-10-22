import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { getAuth } from 'firebase/auth';

type UserRecord = {
  id: string;
  email?: string;
  isAdmin?: boolean;
};

export default function AdminUsers() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [accessAllowed, setAccessAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;

    async function init() {
      // check current user's isAdmin
      if (!user) {
        setAccessAllowed(false);
        return;
      }
      try {
        const myRef = doc(db, 'users', user.uid);
        const mySnap = await getDoc(myRef);
        const myData = mySnap.exists() ? (mySnap.data() as any) : null;
        if (!myData || !myData.isAdmin) {
          setAccessAllowed(false);
          return;
        }

        setAccessAllowed(true);

        // now load users list
        setLoadingUsers(true);
        const snap = await getDocs(collection(db, 'users'));
        const arr: UserRecord[] = [];
        snap.forEach((d) => arr.push({ id: d.id, ...(d.data() as any) }));
        setUsers(arr);
      } catch (e) {
        console.error('Erro carregando users', e);
        setAccessAllowed(false);
      } finally {
        setLoadingUsers(false);
      }
    }

    init();
  }, [loading, user]);

  const toggleAdmin = async (u: UserRecord) => {
    // open confirmation modal
    setPendingUser(u);
    setPendingAction(u.isAdmin ? 'remove' : 'make');
  };

  // modal confirm handler
  const [pendingUser, setPendingUser] = useState<UserRecord | null>(null);
  const [pendingAction, setPendingAction] = useState<'make' | 'remove' | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const confirmToggle = async () => {
    if (!pendingUser || !pendingAction) return;
    try {
      setActionLoading(true);
      // get id token from firebase auth
      const auth = getAuth();
      const current = auth.currentUser;
      if (!current) throw new Error('Usuário não autenticado');
      const idToken = await current.getIdToken();

      const res = await fetch('http://localhost:3000/api/promote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ uid: pendingUser.id, makeAdmin: pendingAction === 'make' }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Erro no servidor');
      }

      setUsers((prev) => prev.map((p) => (p.id === pendingUser.id ? { ...p, isAdmin: pendingAction === 'make' } : p)));
    } catch (e) {
      console.error('Erro ao atualizar admin via function', e);
      alert('Erro ao atualizar usuário. Verifique se o caller tem permissão. ' + (e as any).message);
    } finally {
      setPendingUser(null);
      setPendingAction(null);
      setActionLoading(false);
    }
  };

  const cancelConfirm = () => {
    setPendingUser(null);
    setPendingAction(null);
  };

  if (accessAllowed === null) {
    return <div className="card">Verificando permissões...</div>;
  }

  if (!accessAllowed) {
    return (
      <div className="card">
        <h2>Acesso negado</h2>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Administração de Usuários</h2>
      <p>Marque usuários como admin para permitir exportação de Excel.</p>

      {loadingUsers ? (
        <div>Carregando usuários...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: 8 }}>E-mail</th>
              <th style={{ padding: 8 }}>Admin</th>
              <th style={{ padding: 8 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #fafafa' }}>
                <td style={{ padding: 8 }}>{u.email}</td>
                <td style={{ padding: 8 }}>{u.isAdmin ? 'Sim' : 'Não'}</td>
                <td style={{ padding: 8 }}>
                  <button className="btn" onClick={() => toggleAdmin(u)}>
                    {u.isAdmin ? 'Remover admin' : 'Tornar admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Confirmation modal */}
      {pendingUser && (
        <div className="authbox-backdrop" style={{ zIndex: 3000 }} onClick={cancelConfirm}>
          <div className="authbox" onClick={(e) => e.stopPropagation()} style={{ width: 420 }}>
            <h3>Confirmação</h3>
            <p>
              Tem certeza que deseja {pendingAction === 'make' ? 'tornar' : 'remover'} admin o usuário <strong>{pendingUser.email}</strong>?
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <button className="btn btn-secondary" onClick={cancelConfirm} disabled={actionLoading}>Cancelar</button>
              <button className="btn btn-primary" onClick={confirmToggle} disabled={actionLoading}>{actionLoading ? 'Processando...' : (pendingAction === 'make' ? 'Tornar admin' : 'Remover admin')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
