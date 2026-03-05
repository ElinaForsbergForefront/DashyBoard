interface SubmitButtonProps {
  label?: string;
  disabled?: boolean;
}

export const SubmitButton = ({ label = 'Submit', disabled = false }: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-opacity ${
        disabled
          ? 'bg-primary text-on-primary opacity-50 cursor-not-allowed'
          : 'bg-primary text-on-primary hover:bg-primary-dark'
      }`}
    >
      {label}
    </button>
  );
};
