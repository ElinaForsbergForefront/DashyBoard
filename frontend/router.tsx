import { createBrowserRouter } from 'react-router-dom';
import App from './src/App';
import { ColorPalette } from './src/ColorPalette';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div>404 Not Found</div>,
    children: [
      {
        index: true,
        element: <div>Welcome to the Dashboard!</div>,
      },
      {
        path: '/style-guide',
        element: <ColorPalette />,
      },
    ],
  },
]);
