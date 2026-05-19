import {
  useGetFriendListQuery,
  useGetPokesQuery,
  useGetSentPokesQuery,
  useBlockUserMutation,
  useRemoveFriendMutation,
  useSendPokeMutation,
  useDismissPokeMutation,
} from '../../api/endpoints/friends';
import { SectionHeader, IconButton, EmptyText } from './shared';

export function FriendsSection() {
  const { data: friends = [] } = useGetFriendListQuery();
  const { data: pokes = [] } = useGetPokesQuery();
  const { data: sentPokes = [] } = useGetSentPokesQuery();
  const [blockUser] = useBlockUserMutation();
  const [removeFriend] = useRemoveFriendMutation();
  const [sendPoke] = useSendPokeMutation();
  const [dismissPoke] = useDismissPokeMutation();

  const handlePoke = async (username: string) => {
    await sendPoke(username);
  };

  const handlePokeBack = async (pokeId: string, fromUsername: string) => {
    await dismissPoke(pokeId);
    await sendPoke(fromUsername);
  };

  return (
    <section>
      <SectionHeader title={`Friends (${friends.length})`} />
      <div className="space-y-2">
        {friends.length === 0 && <EmptyText text="No friends yet" />}
        {friends.map((friend) => {
          // Incoming: someone poked me (API returns pokes I received)
          const incomingPoke = pokes.find((p) => p.fromUsername === friend.username && p.isActive);
          // Outgoing: I poked this friend (matched by toUsername)
          const outgoingPoke = sentPokes.find((p) => p.toUsername === friend.username && p.isActive);

          return (
            <div key={friend.username} className="overflow-hidden rounded-xl border border-border">
              <div className="flex items-center justify-between bg-overlay px-3 py-2">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-bold text-foreground-secondary">
                      {(friend.displayName ?? friend.username).slice(0, 1).toUpperCase()}
                    </div>
                    {incomingPoke && (
                      <span className="absolute -right-1 -top-1 text-[11px] leading-none">👋</span>
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
                      onClick={() => handlePokeBack(incomingPoke.id, incomingPoke.fromUsername)}
                      className="rounded-lg bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/25"
                    >
                      Poke back 👋
                    </button>
                  ) : outgoingPoke ? (
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
  );
}
