import type { FormField as FormFieldType } from './form-fields';

interface FormFieldProps {
  field: FormFieldType;
  value: string;
  onChange: (id: string, value: string) => void;
  error?: string;
}

export const FormField = ({ field, value, onChange, error }: FormFieldProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={field.id} className="block text-sm font-medium mb-1">
        {field.label}
      </label>
      <input
        type={field.type}
        id={field.id}
        value={value}
        onChange={(e) => onChange(field.id, e.target.value)}
        className={`w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-border'
        } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
        placeholder={field.placeholder}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
