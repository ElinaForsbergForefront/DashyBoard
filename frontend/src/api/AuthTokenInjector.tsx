import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { injectGetAccessTokenSilently } from './BaseQuery';

export function AuthTokenInjector() {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    injectGetAccessTokenSilently(getAccessTokenSilently);
  }, [getAccessTokenSilently]);

  return null;
}
