import type { ReactNode, FormEvent } from 'react';

interface FormCardProps {
  children: ReactNode;
  className?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export function FormCard({ children, className, onSubmit }: FormCardProps) {
  const base = 'rounded-lg border border-border bg-surface p-3 space-y-3';

  return (
    <form
      onSubmit={onSubmit}
      className={className ? `${base} ${className}` : base}
    >
      {children}
    </form>
  );
}
