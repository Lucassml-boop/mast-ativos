import { useState } from 'react';
import type { FormEvent } from 'react';

interface FormData {
  nomeUsuario: string;
  departamento: string;
  temHeadset: boolean;
  headsetDesde: string;
  temMouse: boolean;
  mouseDesde: string;
  suporteNotebook: boolean;
  bolsa: boolean;
  cargo: string;
}

export default function UserForm() {
  const [formData, setFormData] = useState<FormData>({
    nomeUsuario: '',
    departamento: '',
    temHeadset: false,
    headsetDesde: '',
    temMouse: false,
    mouseDesde: '',
    suporteNotebook: false,
    bolsa: false,
    cargo: '',
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
    alert('Formulário enviado com sucesso! Veja o console para os dados.');
  };

  const handleReset = () => {
    setFormData({
      nomeUsuario: '',
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

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Nome do Usuário */}
          <div className="form-group">
            <label htmlFor="nomeUsuario">
              Nome do Usuário
              <span className="required">*</span>
            </label>
            <input
              type="text"
              id="nomeUsuario"
              placeholder="Digite o nome completo"
              value={formData.nomeUsuario}
              onChange={(e) => setFormData({ ...formData, nomeUsuario: e.target.value })}
              required
            />
          </div>

          {/* Departamento e Cargo */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="departamento">
                Departamento
                <span className="required">*</span>
              </label>
              <select
                id="departamento"
                value={formData.departamento}
                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                required
              >
                <option value="">Selecione...</option>
                <option value="TI">Tecnologia da Informação</option>
                <option value="RH">Recursos Humanos</option>
                <option value="Financeiro">Financeiro</option>
                <option value="Comercial">Comercial</option>
                <option value="Operações">Operações</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cargo">
                Cargo
                <span className="required">*</span>
              </label>
              <input
                type="text"
                id="cargo"
                placeholder="Ex: Analista, Gerente..."
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Headset */}
          <div className="checkbox-group">
            <label className="checkbox-label">Equipamentos</label>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="temHeadset"
                checked={formData.temHeadset}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  temHeadset: e.target.checked,
                  headsetDesde: e.target.checked ? formData.headsetDesde : ''
                })}
              />
              <label htmlFor="temHeadset">Tem Headset</label>
            </div>

            {formData.temHeadset && (
              <div className="form-group" style={{ marginLeft: '30px' }}>
                <label htmlFor="headsetDesde">Desde</label>
                <div className="date-input-wrapper">
                  <input
                    type="date"
                    id="headsetDesde"
                    value={formData.headsetDesde}
                    onChange={(e) => setFormData({ ...formData, headsetDesde: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="checkbox-item">
              <input
                type="checkbox"
                id="temMouse"
                checked={formData.temMouse}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  temMouse: e.target.checked,
                  mouseDesde: e.target.checked ? formData.mouseDesde : ''
                })}
              />
              <label htmlFor="temMouse">Tem Mouse</label>
            </div>

            {formData.temMouse && (
              <div className="form-group" style={{ marginLeft: '30px' }}>
                <label htmlFor="mouseDesde">Desde</label>
                <div className="date-input-wrapper">
                  <input
                    type="date"
                    id="mouseDesde"
                    value={formData.mouseDesde}
                    onChange={(e) => setFormData({ ...formData, mouseDesde: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Outros Itens */}
          <div className="checkbox-group">
            <label className="checkbox-label">Outros Itens</label>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="suporteNotebook"
                checked={formData.suporteNotebook}
                onChange={(e) => setFormData({ ...formData, suporteNotebook: e.target.checked })}
              />
              <label htmlFor="suporteNotebook">Suporte de Notebook</label>
            </div>

            <div className="checkbox-item">
              <input
                type="checkbox"
                id="bolsa"
                checked={formData.bolsa}
                onChange={(e) => setFormData({ ...formData, bolsa: e.target.checked })}
              />
              <label htmlFor="bolsa">Bolsa</label>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Limpar
          </button>
          <button type="submit" className="btn btn-primary">
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}
