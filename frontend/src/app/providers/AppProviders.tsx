import type { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { AuthTokenInjector } from '../../api/AuthTokenInjector';
import { ThemeProvider } from '../../context/ThemeContext';
import { ActiveMirrorProvider } from '../../context/ActiveMirrorContext';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <AuthTokenInjector />
        <ActiveMirrorProvider>
          {children}
        </ActiveMirrorProvider>
      </Provider>
    </ThemeProvider>
  );
}
