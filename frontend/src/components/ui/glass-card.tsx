import type { ReactNode, ElementType } from 'react';

type GlassCardProps<T extends ElementType = 'div'> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<T>;

export function GlassCard<T extends ElementType = 'div'>({
  as,
  children,
  className,
  ...props
}: GlassCardProps<T>) {
  const Component = as || 'div';

  return (
    <Component
      className={className ? `glass ${className}` : 'glass'}
      {...props}
    >
      <div className="glass-content">{children}</div>
    </Component>
  );
}