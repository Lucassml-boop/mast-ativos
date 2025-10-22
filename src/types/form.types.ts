export interface FormData {
  nomeUsuario: string;
  email: string;
  nomeMaquina?: string;
  departamento: string;
  temHeadset: boolean;
  headsetDesde: string;
  temMouse: boolean;
  mouseDesde: string;
  suporteNotebook: boolean;
  bolsa: boolean;
  cargo: string;
}

export interface FormInputProps {
  id: string;
  label: string;
  type?: 'text' | 'date' | 'email';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export interface FormSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
}

export interface CheckboxWithDateProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  dateValue?: string;
  onDateChange?: (date: string) => void;
  showDateField?: boolean;
}

export interface SimpleCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export interface FormButtonsProps {
  onReset: () => void;
  onSubmit?: () => void;
  submitText?: string;
  resetText?: string;
}
