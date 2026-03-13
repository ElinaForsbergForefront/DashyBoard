import type { FormField as FormFieldType } from '../../../hooks/types/form-fields';

interface FormFieldProps {
  field: FormFieldType;
  value: string;
  onChange: (id: string, value: string) => void;
  error?: string;
}

export const FormField = ({ field, value, onChange, error }: FormFieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={field.id} className="text-sm text-muted">
        {field.label}
      </label>
      <input
        type={field.type}
        id={field.id}
        value={value}
        onChange={(e) => onChange(field.id, e.target.value)}
        placeholder={field.placeholder}
        className={`px-3 py-2 rounded-md border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
          error ? 'border-destructive' : 'border-border'
        }`}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};
