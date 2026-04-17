import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useSyncUserToDatabaseMutation } from '../api/endpoints/user';

export interface UseUserDataSyncResult {
  isLoading: boolean;
  error: Error | null;
  isSynced: boolean;
}

const SYNC_COMPLETED_KEY = 'dashyboard_sync_completed';

export const useUserDataSync = (): UseUserDataSyncResult => {
  const { user } = useAuth0();
  const [syncUserToDatabase, { isLoading: isSyncing, error: syncError }] =
    useSyncUserToDatabaseMutation();
  const [isSynced, setIsSynced] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.sub) {
      setIsSynced(false);
      setError(null);
      sessionStorage.removeItem(SYNC_COMPLETED_KEY);
      return;
    }

    const syncData = async () => {
      try {
        // Check if already synced in this session for this user
        const syncedInSession = sessionStorage.getItem(`${SYNC_COMPLETED_KEY}_${user.sub}`);
        if (syncedInSession) {
          setIsSynced(true);
          setError(null);
          return;
        }

        // Check if user_data_stored flag is already set
        const appMetadata = user['https://api.dashyboard.se/app_metadata'] as
          | Record<string, unknown>
          | undefined;
        const isAlreadySynced = appMetadata?.user_data_stored === true;

        if (isAlreadySynced) {
          setIsSynced(true);
          setError(null);
          sessionStorage.setItem(`${SYNC_COMPLETED_KEY}_${user.sub}`, 'true');
          return;
        }

        // Extract user metadata
        const userMetadata = user['https://api.dashyboard.se/user_metadata'] as
          | Record<string, unknown>
          | undefined;

        if (!userMetadata) {
          setError(new Error('No user metadata available in Auth0'));
          setIsSynced(false);
          return;
        }

        // Sync to database
        await syncUserToDatabase({
          username: (userMetadata.username as string | null) || null,
          displayName: (userMetadata.display_name as string | null) || null,
          country: (userMetadata.country as string | null) || null,
          city: (userMetadata.city as string | null) || null,
        }).unwrap();

        setIsSynced(true);
        setError(null);
        sessionStorage.setItem(`${SYNC_COMPLETED_KEY}_${user.sub}`, 'true');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to sync user data';
        console.error('User data sync error:', errorMessage);
        setError(new Error(errorMessage));
        setIsSynced(false);
      }
    };

    syncData();
  }, [user?.sub, syncUserToDatabase]); // Add syncUserToDatabase back + use user?.sub

  return {
    isLoading: isSyncing,
    error: error || (syncError ? new Error(String(syncError)) : null),
    isSynced,
  };
};
