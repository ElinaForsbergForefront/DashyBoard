import { GlassCard } from '../ui/glass-card';
import { UserSearch } from './UserSearch';
import { FriendRequestsSection } from './FriendRequestsSection';
import { FriendsSection } from './FriendsSection';
import { BlockedUsersSection } from './BlockedUsersSection';

export function FriendsPanel() {
  return (
    <GlassCard className="mx-auto mt-10 w-full max-w-md overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Friends</h1>
          <p className="text-xs text-muted">Manage requests, pokes and blocked users</p>
        </div>
        <button className="rounded-lg bg-overlay px-2 py-1 text-sm text-muted hover:bg-overlay/80">
          ✕
        </button>
      </div>

      <div className="space-y-5 p-5">
        <UserSearch />
        <FriendRequestsSection />
        <FriendsSection />
        <BlockedUsersSection />
      </div>
    </GlassCard>
  );
}