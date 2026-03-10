import type { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { AuthTokenInjector } from '../../api/AuthTokenInjector';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <AuthTokenInjector />
      {children}
    </Provider>
  );
}
