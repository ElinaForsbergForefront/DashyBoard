import type { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { AuthTokenInjector } from '../../api/AuthTokenInjector';
import { ThemeProvider } from '../../context/ThemeContext';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <AuthTokenInjector />
        {children}
      </Provider>
    </ThemeProvider>
  );
}
