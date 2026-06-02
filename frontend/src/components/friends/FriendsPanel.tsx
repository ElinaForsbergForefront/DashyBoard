import { UserSearch } from './UserSearch';
import { FriendRequestsSection } from './FriendRequestsSection';
import { FriendsSection } from './FriendsSection';
import { BlockedUsersSection } from './BlockedUsersSection';

export function FriendsPanel() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Friends</h1>
        <p className="text-sm text-muted mt-1">Manage your connections, pokes and blocked users</p>
      </div>

      <UserSearch />

      <div className="space-y-6">
        <FriendRequestsSection />
        <FriendsSection />
        <BlockedUsersSection />
      </div>
    </div>
  );
}