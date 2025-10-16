import type { FormButtonsProps } from '../types/form.types';

export default function FormButtons({
  onReset,
  onSubmit,
  submitText = 'Cadastrar',
  resetText = 'Limpar',
}: FormButtonsProps) {
  return (
    <div className="form-actions">
      <button type="button" className="btn btn-secondary" onClick={onReset}>
        {resetText}
      </button>
      <button type="submit" className="btn btn-primary" onClick={onSubmit}>
        {submitText}
      </button>
    </div>
  );
}
