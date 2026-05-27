import { useCallback, useMemo, useState } from 'react';
import { useBlocker, type BlockerFunction } from 'react-router-dom';

interface UseMirrorRouteGuardOptions {
  isEditMode: boolean;
  hasUnsavedChanges: () => boolean;
  isBusy: boolean;
  resetEditorState: () => void;
  discardEditMode: () => void;
  saveBeforeNavigate: () => Promise<boolean>;
}

function getNavigationLabel(pathname: string) {
  if (pathname.startsWith('/preview/')) {
    return 'Preview';
  }

  if (pathname === '/widgets') {
    return 'Widgets';
  }

  if (pathname === '/friends') {
    return 'Friends';
  }

  if (pathname === '/style-guide') {
    return 'Style Guide';
  }

  if (pathname === '/') {
    return 'Mirrors';
  }

  return 'the next page';
}

export function useMirrorRouteGuard({
  isEditMode,
  hasUnsavedChanges,
  isBusy,
  resetEditorState,
  discardEditMode,
  saveBeforeNavigate,
}: UseMirrorRouteGuardOptions) {
  const [isResolvingRouteChange, setIsResolvingRouteChange] = useState(false);

  const shouldBlockRouteChange = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) => {
      if (!isEditMode || !hasUnsavedChanges()) {
        return false;
      }

      return (
        currentLocation.pathname !== nextLocation.pathname ||
        currentLocation.search !== nextLocation.search ||
        currentLocation.hash !== nextLocation.hash
      );
    },
    [hasUnsavedChanges, isEditMode],
  );

  const blocker = useBlocker(shouldBlockRouteChange);

  const pendingRouteLabel = useMemo(() => {
    if (blocker.state !== 'blocked' || !blocker.location) {
      return null;
    }

    return getNavigationLabel(blocker.location.pathname);
  }, [blocker.location, blocker.state]);

  const handleClosePendingRoute = useCallback(() => {
    if (blocker.state !== 'blocked' || isResolvingRouteChange || isBusy) {
      return;
    }

    blocker.reset();
  }, [blocker, isBusy, isResolvingRouteChange]);

  const handleDiscardAndNavigate = useCallback(() => {
    if (blocker.state !== 'blocked' || isResolvingRouteChange || isBusy) {
      return;
    }

    resetEditorState();
    discardEditMode();
    blocker.proceed();
  }, [blocker, discardEditMode, isBusy, isResolvingRouteChange, resetEditorState]);

  const handleSaveAndNavigate = useCallback(async () => {
    if (blocker.state !== 'blocked' || isResolvingRouteChange || isBusy) {
      return;
    }

    setIsResolvingRouteChange(true);

    try {
      const didSave = await saveBeforeNavigate();

      if (!didSave) {
        return;
      }

      blocker.proceed();
    } finally {
      setIsResolvingRouteChange(false);
    }
  }, [blocker, isBusy, isResolvingRouteChange, saveBeforeNavigate]);

  return {
    pendingRouteLabel,
    isResolvingRouteChange,
    handleClosePendingRoute,
    handleDiscardAndNavigate,
    handleSaveAndNavigate,
  };
}
