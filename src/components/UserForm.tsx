import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import type { FormEvent } from 'react';
import type { FormData } from '../types/form.types';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import CheckboxWithDate from './CheckboxWithDate';
import SimpleCheckbox from './SimpleCheckbox';
import FormButtons from './FormButtons';
import { DEPARTAMENTOS } from '../constants/departamentos';


export default function UserForm() {
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    nomeUsuario: '',
    email: '',
    departamento: '',
    temHeadset: false,
    headsetDesde: '',
    temMouse: false,
    mouseDesde: '',
    suporteNotebook: false,
    bolsa: false,
    cargo: '',
  });
  const [emailError, setEmailError] = useState<string | null>(null);
  // const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    if (!user) {
      alert('Você precisa estar logado para enviar o formulário.');
      return;
    }
    // Validação do email
    if (!formData.email.match(/^.+@grupomast\.com\.br$/i)) {
      setEmailError('Use um e-mail válido @grupomast.com.br');
      return;
    } else {
      setEmailError(null);
    }
    try {
      await addDoc(collection(db, 'ativos'), {
        ...formData,
        createdAt: Timestamp.now(),
      });
      alert('Formulário enviado e salvo no Firebase!');
      handleReset();
    } catch (error) {
      alert('Erro ao salvar no Firebase. Veja o console.');
      console.error(error);
    }
  };

  const handleReset = () => {
    setFormData({
      nomeUsuario: '',
      email: '',
      departamento: '',
      temHeadset: false,
      headsetDesde: '',
      temMouse: false,
      mouseDesde: '',
      suporteNotebook: false,
      bolsa: false,
      cargo: '',
    });
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Cadastro de Ativos</h1>
        <p>Preencha as informações do usuário e seus equipamentos</p>
      </div>

      {/* Seção para vídeo explicativo */}
      <div className="video-section" style={{ margin: '24px 0', padding: '16px', background: '#f8f8f8', borderRadius: '8px' }}>
        <h2>Como ver o nome da máquina</h2>
        <p>Assista o vídeo abaixo para aprender como encontrar o nome do seu computador no Windows:</p>
        {/* Adicione o vídeo aqui, por exemplo um iframe do YouTube */}
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <div style={{ background: '#ddd', height: 200, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#666' }}>
              [Vídeo explicativo aqui]
            </span>
          </div>
        </div>
        <p style={{ marginTop: 12, color: '#555', fontSize: 15 }}>
          Dica: basta acessar a barra de pesquisa do Windows e digitar <strong>sistema</strong> para visualizar o nome da máquina.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Email corporativo */}
          <FormInput
            id="email"
            label="E-mail corporativo"
            placeholder="nome@grupomast.com.br"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            required
            type="email"
          />
          {emailError && (
            <div style={{ color: 'red', marginBottom: 8 }}>{emailError}</div>
          )}

          {/* Nome do Usuário */}
          <FormInput
            id="nomeUsuario"
            label="Nome do Usuário"
            placeholder="Digite o nome completo"
            value={formData.nomeUsuario}
            onChange={(value) => setFormData({ ...formData, nomeUsuario: value })}
            required
          />

          {/* Departamento e Cargo */}
          <div className="form-row">
            <FormSelect
              id="departamento"
              label="Departamento"
              value={formData.departamento}
              onChange={(value) => setFormData({ ...formData, departamento: value })}
              options={DEPARTAMENTOS}
              required
            />

            <FormInput
              id="cargo"
              label="Cargo"
              placeholder="Ex: Analista, Gerente..."
              value={formData.cargo}
              onChange={(value) => setFormData({ ...formData, cargo: value })}
              required
            />
          </div>

          {/* Equipamentos */}
          <div className="checkbox-group">
            <label className="checkbox-label">Equipamentos</label>
            
            <CheckboxWithDate
              id="temHeadset"
              label="Tem Headset"
              checked={formData.temHeadset}
              onCheckedChange={(checked) => 
                setFormData({ 
                  ...formData, 
                  temHeadset: checked,
                  headsetDesde: checked ? formData.headsetDesde : ''
                })
              }
              dateValue={formData.headsetDesde}
              onDateChange={(date) => setFormData({ ...formData, headsetDesde: date })}
            />

            <CheckboxWithDate
              id="temMouse"
              label="Tem Mouse"
              checked={formData.temMouse}
              onCheckedChange={(checked) => 
                setFormData({ 
                  ...formData, 
                  temMouse: checked,
                  mouseDesde: checked ? formData.mouseDesde : ''
                })
              }
              dateValue={formData.mouseDesde}
              onDateChange={(date) => setFormData({ ...formData, mouseDesde: date })}
            />
          </div>

          {/* Outros Itens */}
          <div className="checkbox-group">
            <label className="checkbox-label">Outros Itens</label>
            
            <SimpleCheckbox
              id="suporteNotebook"
              label="Suporte de Notebook"
              checked={formData.suporteNotebook}
              onChange={(checked) => setFormData({ ...formData, suporteNotebook: checked })}
            />

            <SimpleCheckbox
              id="bolsa"
              label="Bolsa"
              checked={formData.bolsa}
              onChange={(checked) => setFormData({ ...formData, bolsa: checked })}
            />
          </div>
        </div>

        {/* Botões */}
        <FormButtons onReset={handleReset} />
      </form>
    </div>
  );
}
