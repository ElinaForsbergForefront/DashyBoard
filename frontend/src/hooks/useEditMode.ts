import { useState } from 'react';

const STORAGE_KEY = 'editMode';

function getInitialEditMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export function useEditMode() {
  const [isEditMode, setIsEditMode] = useState<boolean>(getInitialEditMode);

  const enterEditMode = () => {
    setIsEditMode(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const saveEditMode = () => {
    setIsEditMode(false);
    localStorage.setItem(STORAGE_KEY, 'false');
  };

  const discardEditMode = () => {
    setIsEditMode(false);
    localStorage.setItem(STORAGE_KEY, 'false');
  };

  return { isEditMode, enterEditMode, saveEditMode, discardEditMode };
}
