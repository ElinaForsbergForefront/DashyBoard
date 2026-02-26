import { Outlet } from 'react-router-dom';
import { Navigation } from './components/layout/Navigation';

function App() {
  return (
    <>
      <Navigation />
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
}

export default App;
