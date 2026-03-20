import { Outlet } from 'react-router-dom';
import { Navigation } from './components/layout/Navigation';
import { AuthGuard } from './components/auth/AuthGuard';
import { useAuth0 } from '@auth0/auth0-react';
import { useGetCurrentUserQuery } from './api/endpoints/user';
import { useProfileGuard } from './hooks/useProfileGuard';
import { Form } from './components/layout/form/Form';

function App() {
  const { isAuthenticated } = useAuth0();
  const { data: user, isSuccess } = useGetCurrentUserQuery(undefined, { skip: !isAuthenticated });
  const isProfileComplete = useProfileGuard(user);

  const showProfileModal = isAuthenticated && isSuccess && !isProfileComplete;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolut focus:top-2 focus:left-2 focus:z-100 focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded-md"
        >
          Skip to main content
        </a>
        {isAuthenticated && isProfileComplete && <Navigation />}
        <main id="main-content" className="flex-1 flex flex-col">
          <Outlet />
        </main>
        {showProfileModal && <Form />}
      </div>
    </AuthGuard>
  );
}

export default App;
