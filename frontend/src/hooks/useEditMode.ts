import { useState } from 'react';

export function useEditMode(initialEditMode?: boolean) {
  const [isEditMode, setIsEditMode] = useState<boolean>(
    () => initialEditMode ?? false,
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const enterEditMode = () => {
    setIsEditMode(true);
  };

  const saveEditMode = () => {
    setIsEditMode(false);
    setIsSidebarOpen(false);
  };

  const discardEditMode = () => {
    setIsEditMode(false);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return { isEditMode, enterEditMode, saveEditMode, discardEditMode, isSidebarOpen, toggleSidebar };
}
