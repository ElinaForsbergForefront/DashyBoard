import { Outlet } from 'react-router-dom';
import { Navigation } from './components/layout/Navigation';
import { AuthGuard } from './components/auth/AuthGuard';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserDataSync } from './hooks/useUserDataSync';

function App() {
  const { isAuthenticated } = useAuth0();
  const { isSynced, isLoading: isSyncLoading } = useUserDataSync();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolut focus:top-2 focus:left-2 focus:z-100 focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded-md"
        >
          Skip to main content
        </a>
        {isAuthenticated && isSynced && <Navigation />}
        {isSyncLoading && (
          <div className="p-4 text-center text-sm text-muted-foreground">Syncing your data...</div>
        )}
        <main id="main-content" className="flex-1 flex flex-col">
          {isAuthenticated && isSynced && <Outlet />}
        </main>
      </div>
    </AuthGuard>
  );
}

export default App;
