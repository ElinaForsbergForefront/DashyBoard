import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={{}}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
