import { useState } from 'react';

const STORAGE_KEY = 'editMode';

function getInitialEditMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export function useEditMode(initialEditMode?: boolean) {
  const [isEditMode, setIsEditMode] = useState<boolean>(
    () => (initialEditMode !== undefined ? initialEditMode : getInitialEditMode()),
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const enterEditMode = () => {
    setIsEditMode(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const saveEditMode = () => {
    setIsEditMode(false);
    setIsSidebarOpen(false);
    localStorage.setItem(STORAGE_KEY, 'false');
  };

  const discardEditMode = () => {
    setIsEditMode(false);
    setIsSidebarOpen(false);
    localStorage.setItem(STORAGE_KEY, 'false');
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return { isEditMode, enterEditMode, saveEditMode, discardEditMode, isSidebarOpen, toggleSidebar };
}
