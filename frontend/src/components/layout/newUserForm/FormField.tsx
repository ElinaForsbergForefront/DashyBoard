import type { FormField as FormFieldType } from '../../../hooks/types/form-fields';
import { SelectField } from './SelectField';
import { InputField } from './InputField';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FormFieldProps {
  field: FormFieldType;
  value: string;
  onChange: (id: string, value: string) => void;
  error?: string;
  options?: FieldOption[];
  disabled?: boolean;
  helperText?: string;
  listId?: string;
}

export const FormField = ({ field, value, onChange, error, options, disabled, helperText, listId }: FormFieldProps) => {
  const className = `px-3 py-2 rounded-md border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
    error ? 'border-destructive' : 'border-border'
  } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={field.id} className="text-sm text-muted">
        {field.label}
      </label>
      {field.type === 'select' ? (
        <SelectField
          id={field.id}
          value={value}
          placeholder={field.placeholder}
          options={options ?? []}
          disabled={disabled}
          className={className}
          onChange={(v) => onChange(field.id, v)}
        />
      ) : (
        <InputField
          id={field.id}
          type={field.type}
          value={value}
          placeholder={field.placeholder}
          disabled={disabled}
          className={className}
          listId={listId}
          options={options}
          onChange={(v) => onChange(field.id, v)}
        />
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
      {!error && helperText && <p className="text-xs text-muted">{helperText}</p>}
    </div>
  );
};
