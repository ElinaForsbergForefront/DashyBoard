import { createContext, useContext } from 'react';
import { useEditMode } from '../hooks/useEditMode';

type EditModeContextType = ReturnType<typeof useEditMode>;

const EditModeContext = createContext<EditModeContextType | null>(null);

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const editMode = useEditMode();
  return <EditModeContext.Provider value={editMode}>{children}</EditModeContext.Provider>;
}

export function useEditModeContext() {
  const ctx = useContext(EditModeContext);
  if (!ctx) throw new Error('useEditModeContext must be used within EditModeProvider');
  return ctx;
}
