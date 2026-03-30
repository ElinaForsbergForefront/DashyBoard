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
  <select id={id} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className={className}>
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
