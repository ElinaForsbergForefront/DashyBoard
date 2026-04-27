import { useState } from 'react';
import { GlassCard } from '../ui/glass-card';
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
  useMarkPokeAsSeenMutation,
  useDismissPokeMutation,
} from '../../api/endpoints/friends';

export function FriendsPanel() {
  const [addUsername, setAddUsername] = useState('');

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
  const [markPokeAsSeen] = useMarkPokeAsSeenMutation();
  const [dismissPoke] = useDismissPokeMutation();

  const isLoading = requestsLoading || friendsLoading || blockedLoading || pokesLoading;

  const handleSendRequest = async () => {
    const trimmed = addUsername.trim();
    if (!trimmed) return;

    await sendFriendRequest(trimmed).unwrap();
    setAddUsername('');
  };

  if (isLoading) {
    return (
      <GlassCard className="mx-auto mt-10 w-full max-w-md p-5">
        <p className="text-sm text-slate-600 dark:text-slate-300">Loading friends...</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="mx-auto mt-10 w-full max-w-md overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Friends</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage requests, pokes and blocked users
          </p>
        </div>

        <button className="rounded-lg bg-black/5 px-2 py-1 text-sm text-slate-500 hover:bg-black/10 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15">
          ✕
        </button>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex gap-2">
          <input
            type="text"
            value={addUsername}
            onChange={(e) => setAddUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendRequest()}
            placeholder="Search users..."
            className="min-w-0 flex-1 rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-400/70 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-500"
          />

          <button
            onClick={handleSendRequest}
            disabled={isSendingRequest || !addUsername.trim()}
            className="rounded-xl bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add
          </button>
        </div>

        <section>
          <SectionHeader title={`Requests (${requests.length})`} />

          <div className="space-y-2">
            {requests.length === 0 && <EmptyText text="No friend requests" />}

            {requests.map((request) => (
              <FriendRow key={request.username} name={request.username}>
                <button
                  onClick={() => acceptFriendRequest(request.username)}
                  className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-400"
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
              const latestPoke = pokes.find((poke) => poke.fromUsername === friend.username);

              return (
                <div key={friend.username} className="space-y-1">
                  <FriendRow name={friend.username}>
                    <button
                      onClick={() => sendPoke(friend.username)}
                      className="rounded-lg bg-black/5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-black/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
                    >
                      Poke
                    </button>

                    <IconButton onClick={() => blockUser(friend.username)}>Block</IconButton>
                    <IconButton onClick={() => removeFriend(friend.username)}>Remove</IconButton>
                  </FriendRow>

                  {latestPoke && (
                    <div className="ml-9 flex items-center justify-between rounded-xl bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                      <span>Just poked you! 👋</span>

                      <div className="flex gap-2">
                        {!latestPoke.seenAtUtc && (
                          <button
                            onClick={() => markPokeAsSeen(latestPoke.id)}
                            className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                          >
                            Seen
                          </button>
                        )}

                        <button
                          onClick={() => dismissPoke(latestPoke.id)}
                          className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}
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
              <FriendRow key={user.username} name={user.username}>
                <button
                  onClick={() => unblockUser(user.username)}
                  className="rounded-lg bg-black/5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-black/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
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
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</h2>
      <button className="text-xs text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300">
        Filter
      </button>
    </div>
  );
}

function FriendRow({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-black/5 bg-black/5 px-3 py-2 hover:bg-black/10 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-100">
          {name.slice(0, 1).toUpperCase()}
        </div>

        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{name}</p>
      </div>

      <div className="flex items-center gap-1">{children}</div>
    </div>
  );
}

function IconButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg bg-black/5 px-2 py-1.5 text-xs text-slate-600 hover:bg-black/10 hover:text-slate-900 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15 dark:hover:text-white"
    >
      {children}
    </button>
  );
}

function EmptyText({ text }: { text: string }) {
  return (
    <p className="rounded-xl bg-black/5 px-3 py-3 text-sm text-slate-500 dark:bg-white/5 dark:text-slate-500">
      {text}
    </p>
  );
}