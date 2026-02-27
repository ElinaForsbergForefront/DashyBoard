import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

export function usePermissions() {
  const { getAccessTokenSilently, isLoading } = useAuth0();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = await getAccessTokenSilently();
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userPermissions = payload.permissions || [];

        setPermissions(userPermissions);
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
        setPermissions([]);
      } finally {
        setIsLoadingPermissions(false);
      }
    };

    if (!isLoading) {
      fetchPermissions();
    }
  }, [isLoading, getAccessTokenSilently]);

  const hasPermission = (requiredRoles: string[]): boolean => {
    const hasAccess = requiredRoles.some((role) => permissions.includes(role));
    return hasAccess;
  };

  return { permissions, hasPermission, isLoadingPermissions };
}
