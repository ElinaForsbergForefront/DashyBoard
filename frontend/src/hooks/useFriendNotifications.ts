import { useGetFriendRequestsQuery, useGetPokesQuery } from '../api/endpoints/friends';

export function useFriendNotifications() {
  const { data: requests = [] } = useGetFriendRequestsQuery();
  const { data: pokes = [] } = useGetPokesQuery();

  const pendingRequests = requests.length;
  const activePokes = pokes.filter((p) => p.isActive).length;
  const total = pendingRequests + activePokes;

  return { total, pendingRequests, activePokes };
}
