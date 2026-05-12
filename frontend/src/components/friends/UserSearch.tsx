import { useState, useRef, useEffect } from 'react';
import { useLazySearchUsersQuery } from '../../api/endpoints/user';
import {
  useGetFriendRequestsQuery,
  useGetFriendListQuery,
  useGetBlockedUsersQuery,
  useSendFriendRequestMutation,
} from '../../api/endpoints/friends';

export function UserSearch() {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [searchUsers, { data: searchResults = [], isFetching: isSearching }] = useLazySearchUsersQuery();
  const [sendFriendRequest, { isLoading: isSendingRequest }] = useSendFriendRequestMutation();
  const { data: requests = [] } = useGetFriendRequestsQuery();
  const { data: friends = [] } = useGetFriendListQuery();
  const { data: blockedUsers = [] } = useGetBlockedUsersQuery();

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

  const filteredResults = searchResults.filter(
    (user) =>
      !requests.some((r) => r.username === user.username) &&
      !friends.some((f) => f.username === user.username) &&
      !blockedUsers.some((b) => b.username === user.username),
  );

  return (
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

      {requestError && <p className="mt-1.5 text-xs text-destructive">{requestError}</p>}

      {showDropdown && query.trim().length >= 1 && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-border bg-elevated shadow-lg">
          {isSearching && <p className="px-3 py-2 text-xs text-muted">Searching...</p>}
          {!isSearching && filteredResults.length === 0 && (
            <p className="px-3 py-2 text-xs text-muted">No users found</p>
          )}
          {!isSearching &&
            filteredResults.map((user) => {
              const alreadySent = sentRequests.has(user.username!);
              return (
                <div key={user.id} className="flex w-full items-center justify-between gap-3 px-3 py-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-bold text-foreground-secondary">
                      {(user.displayName ?? user.username)?.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {user.displayName ?? user.username}
                      </p>
                      {user.displayName && <p className="text-xs text-muted">{user.username}</p>}
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
  );
}
