import { createBrowserRouter } from 'react-router-dom';
import App from './src/App';
import { ColorPalette } from './src/ColorPalette';
import { Form } from './src/components/layout/Form';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div>404 Not Found</div>,
    children: [
      {
        index: true,
        element: <Form />,
      },
      {
        path: '/style-guide',
        element: <ColorPalette />,
      },
    ],
  },
]);
