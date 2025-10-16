import { useState } from 'react';
import type { FormEvent } from 'react';
import type { FormData } from '../types/form.types';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import CheckboxWithDate from './CheckboxWithDate';
import SimpleCheckbox from './SimpleCheckbox';
import FormButtons from './FormButtons';
import { DEPARTAMENTOS } from '../constants/departamentos';

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
