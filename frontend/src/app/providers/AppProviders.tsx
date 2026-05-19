import type { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { AuthTokenInjector } from '../../api/AuthTokenInjector';
import { ThemeProvider } from '../../context/ThemeContext';
import { ActiveMirrorProvider } from '../../context/ActiveMirrorContext';
import { ToastProvider } from './ToastProvider';
import { FriendRealtimeProvider } from './FriendRealtimeProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <ToastProvider>
          <AuthTokenInjector />
          <FriendRealtimeProvider>
            <ActiveMirrorProvider>{children}</ActiveMirrorProvider>
          </FriendRealtimeProvider>
        </ToastProvider>
      </Provider>
    </ThemeProvider>
  );
}
