import type { FormField as FormFieldType } from './form-fields';

interface FormFieldProps {
  field: FormFieldType;
}

export const FormField = ({ field }: FormFieldProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={field.id} className="block text-sm font-medium mb-1">
        {field.label}
      </label>
      <input
        type={field.type}
        id={field.id}
        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder={field.placeholder}
      />
    </div>
  );
};
