interface InputOption {
  value: string;
}

interface InputFieldProps {
  id: string;
  type: string;
  value: string;
  placeholder: string;
  disabled?: boolean;
  className: string;
  listId?: string;
  options?: InputOption[];
  onChange: (value: string) => void;
}

export const InputField = ({ id, type, value, placeholder, disabled, className, listId, options, onChange }: InputFieldProps) => (
  <>
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      list={listId}
      autoComplete="off"
      className={className}
      onChange={(e) => onChange(e.target.value)}
    />
    {listId && options?.length ? (
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option.value} value={option.value} />
        ))}
      </datalist>
    ) : null}
  </>
);
