import { Outlet } from 'react-router-dom';
import { Navigation } from './components/layout/Navigation';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolut focus:top-2 focus:left-2 focus:z-100 focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded-md"
      >
        Skip to main content
      </a>
      <Navigation />
      <main id="main-content">
        <Outlet />
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
