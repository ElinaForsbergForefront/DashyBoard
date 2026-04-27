import { useState, useRef, useEffect } from 'react';
import { GlassCard } from '../ui/glass-card';
import type { PokeDto } from '../../api/types/poke';
import { useLazySearchUsersQuery } from '../../api/endpoints/user';
import {
  useGetFriendRequestsQuery,
  useGetFriendListQuery,
  useGetBlockedUsersQuery,
  useGetPokesQuery,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useRemoveFriendMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
  useSendFriendRequestMutation,
  useSendPokeMutation,
  useDismissPokeMutation,
} from '../../api/endpoints/friends';

export function FriendsPanel() {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [pokedUsers, setPokedUsers] = useState<Set<string>>(new Set());
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [searchUsers, { data: searchResults = [], isFetching: isSearching }] = useLazySearchUsersQuery();

  const { data: requests = [], isLoading: requestsLoading } = useGetFriendRequestsQuery();
  const { data: friends = [], isLoading: friendsLoading } = useGetFriendListQuery();
  const { data: blockedUsers = [], isLoading: blockedLoading } = useGetBlockedUsersQuery();
  const { data: pokes = [], isLoading: pokesLoading } = useGetPokesQuery();

  const [sendFriendRequest, { isLoading: isSendingRequest }] = useSendFriendRequestMutation();
  const [acceptFriendRequest] = useAcceptFriendRequestMutation();
  const [rejectFriendRequest] = useRejectFriendRequestMutation();
  const [removeFriend] = useRemoveFriendMutation();
  const [blockUser] = useBlockUserMutation();
  const [unblockUser] = useUnblockUserMutation();
  const [sendPoke] = useSendPokeMutation();
  const [dismissPoke] = useDismissPokeMutation();

  const isLoading = requestsLoading || friendsLoading || blockedLoading || pokesLoading;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setShowDropdown(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length >= 1) {
      debounceRef.current = setTimeout(() => searchUsers(value.trim()), 300);
    }
  };

  const handleSelectUser = async (username: string) => {
    setRequestError(null);
    try {
      await sendFriendRequest(username).unwrap();
      setSentRequests((prev) => new Set(prev).add(username));
    } catch (err: unknown) {
      const error = err as { status?: string; data?: unknown };
      let msg = 'Could not send friend request.';

      if (error.status === 'PARSING_ERROR' && typeof error.data === 'string') {
        // Plain text från backend — plocka ut exception-meddelandet efter sista ": "
        const firstLine = error.data.split('\n')[0].replace('\r', '');
        const colonIdx = firstLine.lastIndexOf(': ');
        msg = colonIdx >= 0 ? firstLine.slice(colonIdx + 2) : firstLine;
      } else if (typeof error.data === 'object' && error.data !== null) {
        const dataObj = error.data as { message?: string };
        if (typeof dataObj.message === 'string') msg = dataObj.message;
      } else if (typeof error.data === 'string') {
        msg = error.data;
      }

      setRequestError(msg);
    }
  };

  const handlePoke = async (username: string) => {
    await sendPoke(username);
    setPokedUsers((prev) => new Set(prev).add(username));
  };

  const handlePokeBack = async (poke: PokeDto) => {
    await dismissPoke(poke.id);
    await sendPoke(poke.fromUsername);
    setPokedUsers((prev) => new Set(prev).add(poke.fromUsername));
  };

  if (isLoading) {
    return (
      <GlassCard className="mx-auto mt-10 w-full max-w-md p-5">
        <p className="text-sm text-muted">Loading friends...</p>
      </GlassCard>
    );
  }

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
        <div className="relative" ref={containerRef}>
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => query.trim().length >= 1 && setShowDropdown(true)}
              placeholder="Search users..."
              className="min-w-0 flex-1 rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary/70"
            />
            <button
              disabled={isSendingRequest}
              className="rounded-xl bg-primary px-3 py-2 text-sm font-medium text-on-primary opacity-40 cursor-not-allowed"
              tabIndex={-1}
            >
              Add
            </button>
          </div>

          {requestError && (
            <p className="mt-1.5 text-xs text-destructive">{requestError}</p>
          )}

          {showDropdown && query.trim().length >= 1 && (
            <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-border bg-elevated shadow-lg">
              {isSearching && (
                <p className="px-3 py-2 text-xs text-muted">Searching...</p>
              )}
              {!isSearching && searchResults.length === 0 && (
                <p className="px-3 py-2 text-xs text-muted">No users found</p>
              )}
              {!isSearching && searchResults
                .filter((user) =>
                  !requests.some((r) => r.username === user.username) &&
                  !friends.some((f) => f.username === user.username) &&
                  !blockedUsers.some((b) => b.username === user.username),
                )
                .map((user) => {
                  const alreadySent = sentRequests.has(user.username!);
                  return (
                    <div
                      key={user.id}
                      className="flex w-full items-center justify-between gap-3 px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-bold text-foreground-secondary">
                          {(user.displayName ?? user.username)?.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {user.displayName ?? user.username}
                          </p>
                          {user.displayName && (
                            <p className="text-xs text-muted">{user.username}</p>
                          )}
                        </div>
                      </div>
                      {alreadySent ? (
                        <span className="shrink-0 rounded-lg bg-success-subtle px-3 py-1.5 text-xs font-medium text-success">
                          Request sent ✓
                        </span>
                      ) : (
                        <button
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelectUser(user.username!)}
                          className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-on-primary hover:bg-primary-hover"
                        >
                          Add friend
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>

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

        <section>
          <SectionHeader title={`Friends (${friends.length})`} />
          <div className="space-y-2">
            {friends.length === 0 && <EmptyText text="No friends yet" />}
            {friends.map((friend) => {
              const incomingPoke = pokes.find(
                (p) => p.fromUsername === friend.username && p.isActive,
              );
              const alreadyPoked = pokedUsers.has(friend.username);

              return (
                <div
                  key={friend.username}
                  className="overflow-hidden rounded-xl border border-border"
                >
                  <div className="flex items-center justify-between bg-overlay px-3 py-2">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-bold text-foreground-secondary">
                          {(friend.displayName ?? friend.username).slice(0, 1).toUpperCase()}
                        </div>
                        {incomingPoke && (
                          <span className="absolute -right-1 -top-1 text-[11px] leading-none">
                            👋
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {friend.displayName ?? friend.username}
                        </p>
                        {friend.displayName && (
                          <p className="text-xs text-muted">{friend.username}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {incomingPoke ? (
                        <button
                          onClick={() => handlePokeBack(incomingPoke)}
                          className="rounded-lg bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/25"
                        >
                          Poke back 👋
                        </button>
                      ) : alreadyPoked ? (
                        <span className="rounded-lg bg-overlay px-3 py-1.5 text-xs font-medium text-muted">
                          Poked ✓
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePoke(friend.username)}
                          className="rounded-lg bg-overlay px-3 py-1.5 text-xs font-medium text-foreground hover:bg-overlay/80"
                        >
                          👋 Poke
                        </button>
                      )}
                      <IconButton onClick={() => blockUser(friend.username)}>Block</IconButton>
                      <IconButton onClick={() => removeFriend(friend.username)}>Remove</IconButton>
                    </div>
                  </div>


                </div>
              );
            })}
          </div>
        </section>

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
      </div>
    </GlassCard>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <h2 className="text-sm font-semibold text-foreground-secondary">{title}</h2>
    </div>
  );
}

function FriendRow({
  username,
  displayName,
  children,
}: {
  username: string;
  displayName?: string | null;
  children: React.ReactNode;
}) {
  const label = displayName ?? username;
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-overlay px-3 py-2">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-bold text-foreground-secondary">
          {label.slice(0, 1).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          {displayName && <p className="text-xs text-muted">{username}</p>}
        </div>
      </div>
      <div className="flex items-center gap-1">{children}</div>
    </div>
  );
}

function IconButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg bg-overlay px-2 py-1.5 text-xs text-muted hover:bg-overlay/80 hover:text-foreground"
    >
      {children}
    </button>
  );
}

function EmptyText({ text }: { text: string }) {
  return <p className="rounded-xl bg-overlay px-3 py-3 text-sm text-muted">{text}</p>;
}