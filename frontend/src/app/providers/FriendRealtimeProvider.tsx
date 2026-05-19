import { useEffect, useEffectEvent, type PropsWithChildren } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useDispatch } from 'react-redux';
import { api } from '../../api/apiSlice';
import { getApiAccessToken } from '../../api/authTokenAccessor';
import {
  FRIEND_EVENT_METHOD,
  getFriendsHubUrl,
  getInvalidationTagsForFriendEvent,
  getToastMessage,
  type FriendRealtimeEvent,
} from '../../realtime/friendRealtime';
import { useToast } from './ToastProvider';

export function FriendRealtimeProvider({ children }: PropsWithChildren) {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useAuth0();
  const { showToast } = useToast();

  const handleFriendEvent = useEffectEvent((event: FriendRealtimeEvent) => {
    const tags = getInvalidationTagsForFriendEvent(event);

    if (tags.length > 0) {
      dispatch(api.util.invalidateTags(tags));
    }

    const toast = getToastMessage(event);

    if (toast) {
      showToast(toast);
    }
  });

  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    const connection = new HubConnectionBuilder()
      .withUrl(getFriendsHubUrl(), {
        accessTokenFactory: () => getApiAccessToken(),
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connection.on(FRIEND_EVENT_METHOD, (event: FriendRealtimeEvent) => {
      handleFriendEvent(event);
    });

    void connection.start().catch((error) => {
      console.error('Failed to start friends realtime connection.', error);
    });

    return () => {
      connection.off(FRIEND_EVENT_METHOD);
      void connection.stop();
    };
  }, [dispatch, isAuthenticated, isLoading]);

  return <>{children}</>;
}
