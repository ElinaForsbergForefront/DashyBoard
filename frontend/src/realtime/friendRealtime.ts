export const FRIEND_EVENT_METHOD = 'FriendEventReceived';

export const FRIEND_EVENT_TYPES = {
  FRIEND_REQUEST_SENT: 'friend-request-sent',
  FRIEND_REQUEST_ACCEPTED: 'friend-request-accepted',
  FRIEND_REQUEST_REJECTED: 'friend-request-rejected',
  FRIEND_REMOVED: 'friend-removed',
  USER_BLOCKED: 'user-blocked',
  USER_UNBLOCKED: 'user-unblocked',
  POKE_SENT: 'poke-sent',
  POKE_SEEN: 'poke-seen',
  POKE_DISMISSED: 'poke-dismissed',
} as const;

export type FriendEventType = (typeof FRIEND_EVENT_TYPES)[keyof typeof FRIEND_EVENT_TYPES];
type FriendTagType = 'FriendRequests' | 'Friends' | 'Blocked' | 'Pokes';

export interface FriendRealtimeEvent {
  eventType: FriendEventType;
  actorUserId: string;
  actorUsername: string | null;
  actorDisplayName: string | null;
  otherUserId: string | null;
  otherUsername: string | null;
  pokeId: string | null;
  occurredAtUtc: string;
  shouldToast: boolean;
}

export function getFriendsHubUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL as string;
  return `${apiUrl.replace(/\/api\/?$/, '')}/hubs/friends`;
}

export function getInvalidationTagsForFriendEvent(
  event: FriendRealtimeEvent,
): Array<{ type: FriendTagType; id: 'LIST' }> {
  switch (event.eventType) {
    case FRIEND_EVENT_TYPES.FRIEND_REQUEST_SENT:
      return [{ type: 'FriendRequests', id: 'LIST' }];

    case FRIEND_EVENT_TYPES.FRIEND_REQUEST_ACCEPTED:
      return [
        { type: 'FriendRequests', id: 'LIST' },
        { type: 'Friends', id: 'LIST' },
      ];

    case FRIEND_EVENT_TYPES.FRIEND_REQUEST_REJECTED:
      return [{ type: 'FriendRequests', id: 'LIST' }];

    case FRIEND_EVENT_TYPES.FRIEND_REMOVED:
      return [{ type: 'Friends', id: 'LIST' }];

    case FRIEND_EVENT_TYPES.USER_BLOCKED:
    case FRIEND_EVENT_TYPES.USER_UNBLOCKED:
      return [
        { type: 'FriendRequests', id: 'LIST' },
        { type: 'Friends', id: 'LIST' },
        { type: 'Blocked', id: 'LIST' },
        { type: 'Pokes', id: 'LIST' },
      ];

    case FRIEND_EVENT_TYPES.POKE_SENT:
    case FRIEND_EVENT_TYPES.POKE_SEEN:
    case FRIEND_EVENT_TYPES.POKE_DISMISSED:
      return [{ type: 'Pokes', id: 'LIST' }];

    default:
      return [];
  }
}

export function getToastMessage(
  event: FriendRealtimeEvent,
): { title: string; description: string } | null {
  if (!event.shouldToast) {
    return null;
  }

  const actorName = event.actorDisplayName || event.actorUsername || 'A friend';

  switch (event.eventType) {
    case FRIEND_EVENT_TYPES.FRIEND_REQUEST_SENT:
      return {
        title: 'New friend request',
        description: `${actorName} sent you a friend request.`,
      };

    case FRIEND_EVENT_TYPES.FRIEND_REQUEST_ACCEPTED:
      return {
        title: 'Friend request accepted',
        description: `${actorName} accepted your friend request.`,
      };

    case FRIEND_EVENT_TYPES.FRIEND_REQUEST_REJECTED:
      return {
        title: 'Friend request declined',
        description: `${actorName} declined your friend request.`,
      };

    case FRIEND_EVENT_TYPES.FRIEND_REMOVED:
      return {
        title: 'Friend removed',
        description: `${actorName} removed you from friends.`,
      };

    case FRIEND_EVENT_TYPES.USER_BLOCKED:
      return {
        title: 'User blocked',
        description: `${actorName} blocked you.`,
      };

    case FRIEND_EVENT_TYPES.USER_UNBLOCKED:
      return {
        title: 'User unblocked',
        description: `${actorName} unblocked you.`,
      };

    case FRIEND_EVENT_TYPES.POKE_SENT:
      return {
        title: 'New poke',
        description: `${actorName} sent you a poke.`,
      };

    case FRIEND_EVENT_TYPES.POKE_SEEN:
      return {
        title: 'Poke seen',
        description: `${actorName} saw your poke.`,
      };

    case FRIEND_EVENT_TYPES.POKE_DISMISSED:
      return {
        title: 'Poke dismissed',
        description: `${actorName} dismissed your poke.`,
      };

    default:
      return null;
  }
}
