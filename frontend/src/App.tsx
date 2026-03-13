import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from './components/layout/Navigation';
import { AuthGuard } from './components/auth/AuthGuard';
import { useAuth0 } from '@auth0/auth0-react';
import { useGetCurrentUserQuery } from './api/endpoints/user';

function App() {
  const { isAuthenticated } = useAuth0();

  useGetCurrentUserQuery(undefined, { skip: !isAuthenticated });

  /*   useEffect(() => {
    if (!isAuthenticated || isCheckingProfile || isProfileComplete === null) return;

    const isFormRoute = location.pathname === '/complete-profile';

    if (!isProfileComplete && !isFormRoute) {
      navigate('/complete-profile', { replace: true });
      return;
    }

    if (isProfileComplete && isFormRoute) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isCheckingProfile, isProfileComplete, location.pathname, navigate]);

  if (isAuthenticated && (isCheckingProfile || isProfileComplete === null)) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block">
              <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-lg">Loading profile...</p>
          </div>
        </div>
      </AuthGuard>
    );
  } */

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolut focus:top-2 focus:left-2 focus:z-100 focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded-md"
        >
          Skip to main content
        </a>
        {isAuthenticated && <Navigation />}
        <main id="main-content" className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>
    </AuthGuard>
  );
}

export default App;
