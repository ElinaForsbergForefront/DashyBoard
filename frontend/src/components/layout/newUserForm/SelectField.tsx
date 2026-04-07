import { InputField } from './InputField';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;
  value: string;
  placeholder: string;
  options: SelectOption[];
  disabled?: boolean;
  className: string;
  onChange: (value: string) => void;
}

export const SelectField = ({ id, value, placeholder, options, disabled, className, onChange }: SelectFieldProps) => (
  <InputField
    id={id}
    type="text"
    value={value}
    placeholder={placeholder}
    disabled={disabled}
    className={className}
    listId={`${id}-listbox`}
    options={options}
    onChange={onChange}
  />
);
