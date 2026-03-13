import { createPortal } from 'react-dom';
import { useUserForm } from '../../../hooks/useUserForm';
import { FORM_FIELDS } from '../../../hooks/types/form-fields';
import { FormField } from './FormField';

export const Form = () => {
  const { values, errors, isSubmitDisabled, handleChange, handleSubmit } = useUserForm();

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-surface border border-border rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="font-semibold text-foreground mb-4">Användarinformation</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {FORM_FIELDS.map((field) => (
            <FormField
              key={field.id}
              field={field}
              value={values[field.id]}
              onChange={handleChange}
              error={errors[field.id]}
            />
          ))}

          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-on-primary hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};
