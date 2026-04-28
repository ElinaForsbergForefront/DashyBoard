import {
  useGetBlockedUsersQuery,
  useUnblockUserMutation,
} from '../../api/endpoints/friends';
import { SectionHeader, FriendRow, EmptyText } from './shared';

export function BlockedUsersSection() {
  const { data: blockedUsers = [] } = useGetBlockedUsersQuery();
  const [unblockUser] = useUnblockUserMutation();

  return (
    <section>
      <SectionHeader title={`Blocked (${blockedUsers.length})`} />
      <div className="space-y-2">
        {blockedUsers.length === 0 && <EmptyText text="No blocked users" />}
        {blockedUsers.map((user) => (
          <FriendRow key={user.username} username={user.username} displayName={user.displayName}>
            <button
              onClick={() => unblockUser(user.username)}
              className="rounded-lg bg-overlay px-3 py-1.5 text-xs font-medium text-foreground hover:bg-overlay/80"
            >
              Unblock
            </button>
          </FriendRow>
        ))}
      </div>
    </section>
  );
}
