import { useAuth0 } from '@auth0/auth0-react';

export const LoginModal = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-8 max-w-md w-full shadow-lg border border-border">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Authentication Required</h2>
        <p className="text-foreground/80 mb-6">You need to sign in to access DashyBoard</p>
        <button
          onClick={() => loginWithRedirect()}
          disabled={isLoading}
          className="cursor-pointer w-full bg-primary text-on-primary py-3 px-4 rounded-md font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign In with Auth0'}
        </button>
      </div>
    </div>
  );
};
