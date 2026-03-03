import { FORM_FIELDS } from './form/form-fields';
import { FormField } from './form/FormField';
import { SubmitButton } from './form/SubmitButton';

export const Form = () => {
  return (
    <form className="max-w-md mx-auto p-6 bg-surface rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Användarinformation</h2>

      {FORM_FIELDS.map((field) => (
        <FormField key={field.id} field={field} />
      ))}

      <SubmitButton label="Submit" />
    </form>
  );
};