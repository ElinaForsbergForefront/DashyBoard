import { useAuth0 } from '@auth0/auth0-react';

export const LogoutButton = () => {
  const { logout, isLoading } = useAuth0();

  return (
    <button
      type="button"
      onClick={() =>
        logout({
          logoutParams: {
            returnTo: window.location.origin,
          },
        })
      }
      disabled={isLoading}
      className="px-3 py-2 text-sm font-medium rounded-md border border-border text-muted hover:text-foreground hover:bg-overlay cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed transition"
      aria-label="Logout"
    >
      Logout
    </button>
  );
};
