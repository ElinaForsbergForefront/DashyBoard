import {
  useGetFriendRequestsQuery,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
} from '../../api/endpoints/friends';
import { SectionHeader, FriendRow, SectionCard, EmptyText } from './shared';

export function FriendRequestsSection() {
  const { data: requests = [] } = useGetFriendRequestsQuery();
  const [acceptFriendRequest] = useAcceptFriendRequestMutation();
  const [rejectFriendRequest] = useRejectFriendRequestMutation();

  return (
    <section>
      <SectionHeader title={`Requests (${requests.length})`} />
      <SectionCard>
        {requests.length === 0 && <EmptyText text="No friend requests" />}
        {requests.map((request) => (
          <FriendRow key={request.username} username={request.username} displayName={request.displayName}>
            <button
              onClick={() => acceptFriendRequest(request.username)}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-on-primary hover:bg-primary-hover transition-colors"
            >
              Accept
            </button>
            <button
              onClick={() => rejectFriendRequest(request.username)}
              aria-label="Decline request"
              className="rounded-lg p-1.5 text-muted hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </FriendRow>
        ))}
      </SectionCard>
    </section>
  );
}
