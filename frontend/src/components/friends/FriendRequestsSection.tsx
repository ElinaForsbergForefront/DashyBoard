import {
  useGetFriendRequestsQuery,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
} from '../../api/endpoints/friends';
import { SectionHeader, FriendRow, IconButton, EmptyText } from './shared';

export function FriendRequestsSection() {
  const { data: requests = [] } = useGetFriendRequestsQuery();
  const [acceptFriendRequest] = useAcceptFriendRequestMutation();
  const [rejectFriendRequest] = useRejectFriendRequestMutation();

  return (
    <section>
      <SectionHeader title={`Requests (${requests.length})`} />
      <div className="space-y-2">
        {requests.length === 0 && <EmptyText text="No friend requests" />}
        {requests.map((request) => (
          <FriendRow key={request.username} username={request.username} displayName={request.displayName}>
            <button
              onClick={() => acceptFriendRequest(request.username)}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-on-primary hover:bg-primary-hover"
            >
              Accept
            </button>
            <IconButton onClick={() => rejectFriendRequest(request.username)}>✕</IconButton>
          </FriendRow>
        ))}
      </div>
    </section>
  );
}
