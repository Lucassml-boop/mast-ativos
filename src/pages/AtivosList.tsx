import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc, query, orderBy, limit, startAfter } from 'firebase/firestore';
import exportAtivosToExcel from '../utils/exportExcel';
import { DEPARTAMENTOS } from '../constants/departamentos';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

type AtivoRecord = {
  id: string;
  [key: string]: any;
};

export default function AtivosList() {
  const { user, loading } = useAuth();
  const [ativos, setAtivos] = useState<AtivoRecord[]>([]);
  const [loadingAtivos, setLoadingAtivos] = useState(false);
  const [pageSize] = useState(20);
  const [lastDoc, setLastDoc] = useState<any | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [accessAllowed, setAccessAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;

    async function init() {
      if (!user) { setAccessAllowed(false); return; }
      try {
        // verify admin by reading users/{uid}
        const myRef = doc(db, 'users', user.uid);
        const mySnap = await getDoc(myRef);
        const myData = mySnap.exists() ? (mySnap.data() as any) : null;
        if (!myData || !myData.isAdmin) {
          // also accept token claim admin (fast path)
          const tokenAdmin = (user as any)?.admin || false;
          if (!tokenAdmin) { setAccessAllowed(false); return; }
        }

  setAccessAllowed(true);
  setLoadingAtivos(true);
  // paginated query: order by createdAt desc
  const q = query(collection(db, 'ativos'), orderBy('createdAt', 'desc'), limit(pageSize));
  const snap = await getDocs(q);
  const arr: AtivoRecord[] = [];
  snap.forEach((d) => arr.push({ id: d.id, ...(d.data() as any) }));
  setAtivos(arr);
  setLastDoc(snap.docs[snap.docs.length - 1] || null);
  setHasMore(snap.docs.length === pageSize);
      } catch (e) {
        console.error('Erro carregando ativos', e);
        setAccessAllowed(false);
      } finally {
        setLoadingAtivos(false);
      }
    }

    init();
  }, [loading, user]);

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [editing, setEditing] = useState<AtivoRecord | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [filterDept, setFilterDept] = useState<string>('');
  const [filterFrom, setFilterFrom] = useState<string>('');
  const [filterTo, setFilterTo] = useState<string>('');

  const confirmDelete = (id: string) => {
    setPendingId(id);
  };

  const doDelete = async () => {
    if (!pendingId) return;
    try {
      setActionLoading(true);
      await deleteDoc(doc(db, 'ativos', pendingId));
      setAtivos((prev) => prev.filter((a) => a.id !== pendingId));
    } catch (e) {
      console.error('Erro ao deletar ativo', e);
      alert('Erro ao deletar. Verifique permissões.');
    } finally {
      setPendingId(null);
      setActionLoading(false);
    }
  };

  const loadMore = async () => {
    if (!hasMore || !lastDoc) return;
    try {
      setLoadingAtivos(true);
      const q = query(collection(db, 'ativos'), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(pageSize));
      const snap = await getDocs(q);
      const arr: AtivoRecord[] = [];
      snap.forEach((d) => arr.push({ id: d.id, ...(d.data() as any) }));
      setAtivos((prev) => [...prev, ...arr]);
      setLastDoc(snap.docs[snap.docs.length - 1] || lastDoc);
      setHasMore(snap.docs.length === pageSize);
    } catch (e) {
      console.error('Erro carregando mais ativos', e);
    } finally {
      setLoadingAtivos(false);
    }
  };

  if (accessAllowed === null) return <div className="card">Verificando permissões...</div>;
  if (!accessAllowed) return (
    <div className="card">
      <h2>Acesso negado</h2>
      <p>Você não tem permissão para acessar esta página.</p>
    </div>
  );

  return (
    <div className="card">
      <h2>Inventário de Ativos</h2>
      <p>Lista de envios de ativos. Administradores podem excluir ou editar entradas. Também é possível exportar todos os registros.</p>

      <div className="filters">
        <div className="filters-left">
          <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
            <option value="">Todos Departamentos</option>
            {DEPARTAMENTOS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
          <label>
            <span>De</span>
            <input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} />
          </label>
          <label>
            <span>Até</span>
            <input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} />
          </label>
        </div>

        <div className="filters-actions">
          <button className="btn" onClick={async () => {
            try {
              setExporting(true);
              const filters: any = {};
              if (filterDept) filters.departamento = filterDept;
              if (filterFrom) filters.from = new Date(filterFrom + 'T00:00:00');
              if (filterTo) filters.to = new Date(filterTo + 'T23:59:59');
              await exportAtivosToExcel('ativos-filtrados.xlsx', filters);
            } catch (e) {
              console.error('Erro exportando ativos', e);
              alert('Erro ao exportar. Veja console.');
            } finally {
              setExporting(false);
            }
          }} disabled={exporting}>{exporting ? 'Exportando...' : 'Exportar (XLSX)'}</button>
        </div>
      </div>

      {loadingAtivos ? (
        <div>Carregando ativos...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: 8 }}>E-mail</th>
              <th style={{ padding: 8 }}>Nome</th>
              <th style={{ padding: 8 }}>Nome da Máquina</th>
              <th style={{ padding: 8 }}>Criado em</th>
              <th style={{ padding: 8 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {ativos.map((a) => (
              <tr key={a.id} style={{ borderBottom: '1px solid #fafafa' }}>
                <td style={{ padding: 8 }}>{a.email}</td>
                <td style={{ padding: 8 }}>{a.nomeUsuario}</td>
                <td style={{ padding: 8 }}>{a.nomeMaquina || '-'}</td>
                <td style={{ padding: 8 }}>{a.createdAt?.toDate ? a.createdAt.toDate().toLocaleString() : (a.createdAt || '-')}</td>
                <td style={{ padding: 8 }}>
                    <button className="btn" onClick={() => setEditing(a)}>Editar</button>
                    <span style={{ width: 8, display: 'inline-block' }} />
                    <button className="btn" onClick={() => confirmDelete(a.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {hasMore && (
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <button className="btn" onClick={loadMore} disabled={loadingAtivos}>{loadingAtivos ? 'Carregando...' : 'Carregar mais'}</button>
        </div>
      )}

      {pendingId && (
        <div className="authbox-backdrop" style={{ zIndex: 3000 }} onClick={() => setPendingId(null)}>
          <div className="authbox" onClick={(e) => e.stopPropagation()} style={{ width: 420 }}>
            <h3>Confirmação</h3>
            <p>Tem certeza que deseja excluir este registro?</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <button className="btn btn-secondary" onClick={() => setPendingId(null)} disabled={actionLoading}>Cancelar</button>
              <button className="btn btn-primary" onClick={doDelete} disabled={actionLoading}>{actionLoading ? 'Processando...' : 'Excluir'}</button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="authbox-backdrop" style={{ zIndex: 3000 }} onClick={() => setEditing(null)}>
          <div className="authbox" onClick={(e) => e.stopPropagation()} style={{ width: 640 }}>
            <h3>Editar ativo</h3>
            <p>Modifique os campos abaixo e clique em salvar. O e-mail e createdAt não podem ser alterados pelo cliente.</p>
            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <label>E-mail</label>
                  <input value={editing.email || ''} disabled style={{ width: '100%' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Nome do Usuário</label>
                  <input value={editing.nomeUsuario || ''} onChange={(e) => setEditing({ ...editing, nomeUsuario: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <label>Nome da Máquina</label>
                  <input value={editing.nomeMaquina || ''} onChange={(e) => setEditing({ ...editing, nomeMaquina: e.target.value })} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Departamento</label>
                  <input value={editing.departamento || ''} onChange={(e) => setEditing({ ...editing, departamento: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <label>Cargo</label>
                  <input value={editing.cargo || ''} onChange={(e) => setEditing({ ...editing, cargo: e.target.value })} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Created At</label>
                  <input value={editing.createdAt?.toDate ? editing.createdAt.toDate().toLocaleString() : (editing.createdAt || '')} disabled style={{ width: '100%' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="checkbox" checked={!!editing.temHeadset} onChange={(e) => setEditing({ ...editing, temHeadset: e.target.checked })} /> Tem Headset
                </label>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="checkbox" checked={!!editing.temMouse} onChange={(e) => setEditing({ ...editing, temMouse: e.target.checked })} /> Tem Mouse
                </label>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="checkbox" checked={!!editing.suporteNotebook} onChange={(e) => setEditing({ ...editing, suporteNotebook: e.target.checked })} /> Suporte de Notebook
                </label>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="checkbox" checked={!!editing.bolsa} onChange={(e) => setEditing({ ...editing, bolsa: e.target.checked })} /> Bolsa
                </label>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <label>Headset Desde</label>
                  <input type="date" value={editing.headsetDesde || ''} onChange={(e) => setEditing({ ...editing, headsetDesde: e.target.value })} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Mouse Desde</label>
                  <input type="date" value={editing.mouseDesde || ''} onChange={(e) => setEditing({ ...editing, mouseDesde: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                <button className="btn btn-secondary" onClick={() => setEditing(null)} disabled={editLoading}>Cancelar</button>
                <button className="btn btn-primary" onClick={async () => {
                  if (!editing) return;
                  try {
                    setEditLoading(true);
                    // Build update payload excluding email and createdAt
                    const { id, email, createdAt, ...rest } = editing;
                    const toUpdate: any = {};
                    // Only include keys that exist in rest
                    Object.keys(rest).forEach((k) => { toUpdate[k] = (rest as any)[k]; });
                    await updateDoc(doc(db, 'ativos', editing.id), toUpdate);
                    // update local state
                    setAtivos((prev) => prev.map((p) => p.id === editing.id ? ({ ...p, ...toUpdate }) : p));
                    setEditing(null);
                  } catch (e) {
                    console.error('Erro ao salvar edição', e);
                    alert('Erro ao salvar alteração. Verifique permissões.');
                  } finally {
                    setEditLoading(false);
                  }
                }} disabled={editLoading}>{editLoading ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
