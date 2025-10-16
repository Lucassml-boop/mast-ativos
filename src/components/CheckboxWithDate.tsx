import FormInput from './FormInput';
import type { CheckboxWithDateProps } from '../types/form.types';

export default function CheckboxWithDate({
  id,
  label,
  checked,
  onCheckedChange,
  dateValue = '',
  onDateChange,
  showDateField = true,
}: CheckboxWithDateProps) {
  return (
    <>
      <div className="checkbox-item">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
        />
        <label htmlFor={id}>{label}</label>
      </div>

      {checked && showDateField && onDateChange && (
        <div style={{ marginLeft: '30px' }}>
          <FormInput
            id={`${id}Desde`}
            label="Desde"
            type="date"
            value={dateValue}
            onChange={onDateChange}
          />
        </div>
      )}
    </>
  );
}
