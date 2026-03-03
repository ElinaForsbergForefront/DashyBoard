import { Outlet } from 'react-router-dom';
import { Navigation } from './components/layout/Navigation';
import { AuthGuard } from './components/auth/AuthGuard';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';


function App() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) return;

    const syncUser = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE, // ✅ audience specificerat
          },
        });
        await fetch(`${import.meta.env.VITE_API_URL}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Failed to sync user:', error);
      }
    };

    syncUser();
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolut focus:top-2 focus:left-2 focus:z-100 focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded-md"
        >
          Skip to main content
        </a>
        {isAuthenticated && <Navigation />}
        <main id="main-content">
          <Outlet />
        </main>
        <footer></footer>
      </div>
    </AuthGuard>
  );
}

export default App;


