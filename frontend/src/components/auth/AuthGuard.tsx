import { useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isLoading, isAuthenticated, loginWithRedirect, error } = useAuth0();

  const attemptedRedirectModeRef = useRef<'default' | 'prompt-login' | null>(null);

  const redirectMode =
    error && typeof error === 'object' && 'error' in error && error.error === 'access_denied'
      ? 'prompt-login'
      : 'default';

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isAuthenticated) {
      attemptedRedirectModeRef.current = null;
      return;
    }

    if (attemptedRedirectModeRef.current === redirectMode) {
      return;
    }

    attemptedRedirectModeRef.current = redirectMode;

    void loginWithRedirect(
      redirectMode === 'prompt-login'
        ? {
            authorizationParams: {
              prompt: 'login',
            },
          }
        : undefined,
    ).catch(() => {
      attemptedRedirectModeRef.current = null;
    });
  }, [isAuthenticated, isLoading, loginWithRedirect, redirectMode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-lg">
            {redirectMode === 'prompt-login'
              ? 'Redirecting to login form...'
              : 'Redirecting to login...'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
