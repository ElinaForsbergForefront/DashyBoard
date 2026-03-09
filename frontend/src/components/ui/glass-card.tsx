import type { ReactNode, ElementType } from 'react';
import { cn } from '../../lib/utils';

type GlassCardProps<T extends ElementType = 'div'> = {
  as?: T;
  children: ReactNode;
  className?: string;
  hover?: boolean;
} & React.ComponentPropsWithoutRef<T>;

export function GlassCard<T extends ElementType = 'div'>({
  as,
  children,
  className,
  hover = false,
  ...props
}: GlassCardProps<T>) {
  const Component = as || 'div';

  return (
    <Component
      className={cn('glass', hover && 'glass-hover', className)}
      {...props}
    >
      <div className="glass-content">{children}</div>
    </Component>
  );
}