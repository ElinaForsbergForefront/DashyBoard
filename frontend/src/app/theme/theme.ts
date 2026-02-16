import { createTheme } from '@mui/material/styles';

// Todo: Customize theme whenever design is completed
export const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", "sans-serif"',

    h1: {
      fontSize: '3rem',
      lineHeight: 1.166,
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontSize: '2.5rem',
      lineHeight: 1.2,
      fontWeight: 600,
      letterSpacing: '-0.005em',
    },
    h3: {
      fontSize: '2.0625rem',
      lineHeight: 1.21,
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.75rem',
      lineHeight: 1.28,
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.4375rem',
      lineHeight: 1.39,
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.1875rem',
      lineHeight: 1.47,
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
      fontWeight: 400,
      letterSpacing: '0.01em',
    },
  },
});
