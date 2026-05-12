import { createContext, useContext, useState } from 'react';
import type { PropsWithChildren } from 'react';

interface ActiveMirrorContextValue {
  activeMirrorId: string | null;
  setActiveMirrorId: (id: string | null) => void;
}

const ActiveMirrorContext = createContext<ActiveMirrorContextValue | null>(null);

export function ActiveMirrorProvider({ children }: PropsWithChildren) {
  const [activeMirrorId, setActiveMirrorId] = useState<string | null>(null);

  return (
    <ActiveMirrorContext.Provider value={{ activeMirrorId, setActiveMirrorId }}>
      {children}
    </ActiveMirrorContext.Provider>
  );
}

export function useActiveMirror() {
  const ctx = useContext(ActiveMirrorContext);
  if (!ctx) throw new Error('useActiveMirror must be used within ActiveMirrorProvider');
  return ctx;
}
