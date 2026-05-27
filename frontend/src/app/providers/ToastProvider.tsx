import { createContext, useContext, useState, type PropsWithChildren } from 'react';

interface ToastOptions {
  title: string;
  description?: string;
  position?: 'top-right' | 'top-center';
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  showToast: (toast: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const topRightToasts = toasts.filter((toast) => (toast.position ?? 'top-right') === 'top-right');
  const topCenterToasts = toasts.filter(
    (toast) => (toast.position ?? 'top-right') === 'top-center',
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showToast = (toast: ToastOptions) => {
    const id = crypto.randomUUID();

    setToasts((prev) => [...prev, { id, ...toast }]);

    window.setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="pointer-events-none fixed left-1/2 top-4 z-50 flex w-full max-w-sm -translate-x-1/2 flex-col gap-3 px-4">
        {topCenterToasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto rounded-2xl border border-border bg-surface/95 px-4 py-3 shadow-xl backdrop-blur"
          >
            <p className="text-sm font-semibold text-foreground">{toast.title}</p>
            {toast.description && <p className="mt-1 text-xs text-muted">{toast.description}</p>}
          </div>
        ))}
      </div>

      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3 px-4">
        {topRightToasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto rounded-2xl border border-border bg-surface/95 px-4 py-3 shadow-xl backdrop-blur"
          >
            <p className="text-sm font-semibold text-foreground">{toast.title}</p>
            {toast.description && <p className="mt-1 text-xs text-muted">{toast.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider.');
  }

  return context;
}
