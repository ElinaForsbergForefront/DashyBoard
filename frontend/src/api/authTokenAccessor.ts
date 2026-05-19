type GetAccessTokenSilently = (options?: {
  authorizationParams?: { audience?: string };
}) => Promise<string>;

let _getAccessTokenSilently: GetAccessTokenSilently | null = null;

export function injectGetAccessTokenSilently(fn: GetAccessTokenSilently): void {
  _getAccessTokenSilently = fn;
}

export async function getApiAccessToken(): Promise<string> {
  if (!_getAccessTokenSilently) {
    throw new Error('Auth token accessor has not been initialized yet.');
  }

  return _getAccessTokenSilently({
    authorizationParams: {
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    },
  });
}
