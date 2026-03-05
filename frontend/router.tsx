import { createBrowserRouter } from 'react-router-dom';
import App from './src/App';
import { ColorPalette } from './src/ColorPalette';
import { Form } from './src/components/layout/Form';
import { Dashboard } from './src/pages/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div>404 Not Found</div>,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/complete-profile',
        element: <Form />,
      },
      {
        path: '/style-guide',
        element: <ColorPalette />,
      },
    ],
  },
]);
