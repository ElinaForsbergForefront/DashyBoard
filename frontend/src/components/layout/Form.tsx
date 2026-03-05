import { FORM_FIELDS } from './form/form-fields';
import { FormField } from './form/FormField';
import { SubmitButton } from './form/SubmitButton';
import { useUserForm } from './form/useUserForm';

export const Form = () => {
  const { values, errors, isSubmitDisabled, handleChange, handleSubmit } = useUserForm();

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-6 p-6 bg-surface rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Användarinformation</h2>

      {FORM_FIELDS.map((field) => (
        <FormField
          key={field.id}
          field={field}
          value={values[field.id]}
          onChange={handleChange}
          error={errors[field.id]}
        />
      ))}

      <SubmitButton label="Submit" disabled={isSubmitDisabled} />
    </form>
  );
};