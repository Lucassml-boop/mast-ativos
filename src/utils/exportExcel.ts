import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

type AtivoDoc = Record<string, any>;

export async function exportAtivosToExcel(filename = 'ativos.xlsx') {
  // Busca todos os documentos da coleção 'ativos'
  let snapshot;
  try {
    snapshot = await getDocs(collection(db, 'ativos'));
  } catch (err: any) {
    console.error('Erro ao buscar ativos:', err);
    // Mostra mensagem amigável para erros de permissão
    if (err?.code === 'permission-denied' || /permission/i.test(err?.message || '')) {
      // Try diagnostic checks: auth user, users/{uid}, and backend health
      let diagMsg = 'Você não tem permissão para exportar os ativos. Apenas administradores podem exportar.\n\nDiagnóstico:\n';

      try {
        const current = auth.currentUser;
        if (!current) {
          diagMsg += '- Usuário não autenticado no cliente. Faça login e tente novamente.\n';
        } else {
          diagMsg += `- Usuário autenticado: ${current.email} (uid: ${current.uid})\n`;
          // check users/{uid}
          try {
            const userRef = doc(db, 'users', current.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const data = userSnap.data() as any;
              diagMsg += `- users/${current.uid} encontrado. isAdmin: ${!!data.isAdmin} \n`;
            } else {
              diagMsg += `- users/${current.uid} NÃO encontrado. Crie o documento com isAdmin: true para permitir export.\n`;
            }
          } catch (eUser) {
            console.error('Erro ao checar users/{uid}:', eUser);
            diagMsg += '- Erro ao ler users/{uid} (veja console).\n';
          }
        }

        // Check backend health endpoints
        const backendUrls = ['http://localhost:3000/health', 'http://localhost:3000/api/ping', 'http://localhost:3000/'];
        let backendOk = false;
        for (const url of backendUrls) {
          try {
            const r = await fetch(url, { method: 'GET' });
            if (r.ok) {
              backendOk = true;
              diagMsg += `- Backend respondeu em ${url} (status ${r.status}).\n`;
              break;
            } else {
              diagMsg += `- Backend respondeu em ${url} com status ${r.status}.\n`;
            }
          } catch (eFetch) {
            diagMsg += `- Não foi possível conectar em ${url}: ${(eFetch as any).message}\n`;
          }
        }
        if (!backendOk) {
          diagMsg += '- Backend não encontrado em http://localhost:3000 (verifique se está rodando).\n';
        }
      } catch (diagErr) {
        console.error('Erro no diagnóstico:', diagErr);
        diagMsg += '- Erro ao executar diagnóstico (veja console).\n';
      }

  // print diagnostic message to console for copy/paste and show short alert
  console.group('Diagnóstico exportAtivosToExcel');
  console.log(diagMsg);
  console.groupEnd();
  alert('Você não tem permissão para exportar os ativos. Verifique o console do navegador (Console) para o diagnóstico detalhado.');
      return;
    }
    alert('Erro ao buscar os ativos. Veja o console para detalhes.');
    return;
  }
  const rows: AtivoDoc[] = [];

  snapshot.forEach((doc) => {
    rows.push({ id: doc.id, ...doc.data() });
  });

  // Mapear para as colunas desejadas
  const mapped = rows.map((r) => ({
    'E-mail corporativo': r.email || '',
    'Nome do Usuário': r.nomeUsuario || '',
    'Departamento': r.departamento || '',
    'Cargo': r.cargo || '',
    'Equipamentos e datas': (() => {
      const items: string[] = [];
      if (r.temHeadset) items.push(`Headset (${r.headsetDesde || 'sem data'})`);
      if (r.temMouse) items.push(`Mouse (${r.mouseDesde || 'sem data'})`);
      return items.join('; ');
    })(),
    'Outros Itens e datas': (() => {
      const items: string[] = [];
      if (r.suporteNotebook) items.push('Suporte de Notebook');
      if (r.bolsa) items.push('Bolsa');
      return items.join('; ');
    })(),
  }));

  // Criar worksheet e workbook
  const ws = XLSX.utils.json_to_sheet(mapped);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Ativos');

  // Gerar buffer e salvar
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, filename);
}

export default exportAtivosToExcel;
