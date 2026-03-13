import { GlassTestPage } from './src/app/GlassTestPage';
import { createBrowserRouter } from 'react-router-dom';
import App from './src/App';
import { Form } from './src/components/layout/Form';
import { StyleGuide } from './src/pages/StyleGuide';
import { Mirrors } from './src/pages/Mirrors';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div>404 Not Found</div>,
    children: [
      {
        index: true,
        element: <Mirrors />,
      },
      {
        path: '/complete-profile',
        element: <Form />,
      },
      {
        path: '/style-guide',
        element: <StyleGuide />,
      },
      {
        path: '/glass-test',
        element: <GlassTestPage />,
      },
    ],
  },
]);
