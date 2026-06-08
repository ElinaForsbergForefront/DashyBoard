import {
  useGetBlockedUsersQuery,
  useUnblockUserMutation,
} from '../../api/endpoints/friends';
import { SectionHeader, FriendRow, SectionCard, EmptyText } from './shared';

export function BlockedUsersSection() {
  const { data: blockedUsers = [] } = useGetBlockedUsersQuery();
  const [unblockUser] = useUnblockUserMutation();

  return (
    <section>
      <SectionHeader title={`Blocked (${blockedUsers.length})`} />
      <SectionCard>
        {blockedUsers.length === 0 && <EmptyText text="No blocked users" />}
        {blockedUsers.map((user) => (
          <FriendRow key={user.username} username={user.username} displayName={user.displayName}>
            <button
              onClick={() => unblockUser(user.username)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-overlay transition-colors"
            >
              Unblock
            </button>
          </FriendRow>
        ))}
      </SectionCard>
    </section>
  );
}
