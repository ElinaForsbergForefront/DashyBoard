import type { ReactNode, ElementType } from 'react';

type GlassCardInteractiveProps<T extends ElementType = 'div'> = {
  as?: T;
  children: ReactNode;
  className?: string;
  clickable?: boolean;
  onClickHandler?: () => void;
} & React.ComponentPropsWithoutRef<T>;

export function GlassCardInteractive<T extends ElementType = 'div'>({
  as,
  children,
  className,
  clickable,
  onClickHandler,
  ...props
}: GlassCardInteractiveProps<T>) {
  const Component = as || 'div';

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (clickable && onClickHandler && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClickHandler();
    }
  };

  return (
    <Component
      className={className ? `glass ${className}` : 'glass'}
      {...(clickable && { role: 'button', tabIndex: 0 })}
      onClick={clickable ? onClickHandler : undefined}
      onKeyDown={clickable ? handleKeyDown : undefined}
      {...props}
    >
      <div className="glass-content">{children}</div>
    </Component>
  );
}
