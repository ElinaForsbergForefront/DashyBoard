import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from './components/layout/Navigation';
import { AuthGuard } from './components/auth/AuthGuard';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { getCurrentUser } from './api/users';

const REQUIRED_PROFILE_FIELDS = ['username', 'displayName', 'country', 'city'] as const;

function App() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const shouldShowNavigation = isAuthenticated;
  const isProfileFormRoute = location.pathname === '/complete-profile';

  useEffect(() => {
    const onProfileCompleted = () => setIsProfileComplete(true);
    window.addEventListener('profile-completed', onProfileCompleted);

    return () => {
      window.removeEventListener('profile-completed', onProfileCompleted);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadCurrentUser = async () => {
      setIsCheckingProfile(true);
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        });

        const currentUser = await getCurrentUser(token);
        const hasMissingFields = REQUIRED_PROFILE_FIELDS.some((field) => {
          const value = currentUser[field];
          return value == null || !value.trim();
        });

        setIsProfileComplete(!hasMissingFields);
      } catch (error) {
        console.error('Failed to load current user:', error);
        setIsProfileComplete(false);
      } finally {
        setIsCheckingProfile(false);
      }
    };

    loadCurrentUser();
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
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
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolut focus:top-2 focus:left-2 focus:z-100 focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded-md"
        >
          Skip to main content
        </a>
        {shouldShowNavigation && <Navigation disableInteractions={isProfileFormRoute} />}
        <main id="main-content">
          <Outlet />
        </main>
        <footer></footer>
      </div>
    </AuthGuard>
  );
}

export default App;


