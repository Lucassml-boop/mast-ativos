import type { FormInputProps } from '../types/form.types';

export default function FormInput({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
}: FormInputProps) {
  return (
    <div className="form-group">
      <label htmlFor={id}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}
