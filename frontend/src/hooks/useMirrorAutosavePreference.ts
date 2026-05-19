import { useState } from 'react';

const STORAGE_KEY = 'mirrorAutosaveEnabled';

function getInitialMirrorAutosaveEnabled(): boolean {
  if (typeof window === 'undefined') return true;

  const storedValue = localStorage.getItem(STORAGE_KEY);

  if (storedValue === null) {
    return true;
  }

  return storedValue === 'true';
}

export function useMirrorAutosavePreference(initialValue?: boolean) {
  const [isAutosaveEnabled, setIsAutosaveEnabled] = useState<boolean>(
    () => initialValue ?? getInitialMirrorAutosaveEnabled(),
  );

  const updateAutosaveEnabled = (nextValue: boolean) => {
    setIsAutosaveEnabled(nextValue);

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(nextValue));
    }
  };

  const toggleAutosave = () => {
    setIsAutosaveEnabled((currentValue) => {
      const nextValue = !currentValue;

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, String(nextValue));
      }

      return nextValue;
    });
  };

  return {
    isAutosaveEnabled,
    setIsAutosaveEnabled: updateAutosaveEnabled,
    toggleAutosave,
  };
}
