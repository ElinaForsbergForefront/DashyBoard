import { createBrowserRouter } from 'react-router-dom';
import App from './src/App';
import { StyleGuide } from './src/pages/StyleGuide';
import { Mirrors } from './src/pages/Mirrors';
import { Widgets } from './src/pages/Widgets';
import { Friends } from './src/pages/Friends';

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
        path: '/widgets',
        element: <Widgets />,
      },
      {
        path: '/friends',
        element: <Friends />,
      },
      {
        path: '/style-guide',
        element: <StyleGuide />,
      },
    ],
  },
]);
