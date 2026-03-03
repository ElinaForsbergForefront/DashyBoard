interface SubmitButtonProps {
  label?: string;
}

export const SubmitButton = ({ label = 'Submit' }: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      className="px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {label}
    </button>
  );
};
