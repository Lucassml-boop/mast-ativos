import type { SimpleCheckboxProps } from '../types/form.types';

export default function SimpleCheckbox({
  id,
  label,
  checked,
  onChange,
}: SimpleCheckboxProps) {
  return (
    <div className="checkbox-item">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
