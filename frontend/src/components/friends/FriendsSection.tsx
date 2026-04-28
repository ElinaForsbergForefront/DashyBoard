import { useState } from 'react';
import type { PokeDto } from '../../api/types/poke';
import {
  useGetFriendListQuery,
  useGetPokesQuery,
  useBlockUserMutation,
  useRemoveFriendMutation,
  useSendPokeMutation,
  useDismissPokeMutation,
} from '../../api/endpoints/friends';
import { SectionHeader, IconButton, EmptyText } from './shared';

export function FriendsSection() {
  const [pokedUsers, setPokedUsers] = useState<Set<string>>(new Set());
  const { data: friends = [] } = useGetFriendListQuery();
  const { data: pokes = [] } = useGetPokesQuery();
  const [blockUser] = useBlockUserMutation();
  const [removeFriend] = useRemoveFriendMutation();
  const [sendPoke] = useSendPokeMutation();
  const [dismissPoke] = useDismissPokeMutation();

  const handlePoke = async (username: string) => {
    await sendPoke(username);
    setPokedUsers((prev) => new Set(prev).add(username));
  };

  const handlePokeBack = async (poke: PokeDto) => {
    await dismissPoke(poke.id);
    await sendPoke(poke.fromUsername);
    setPokedUsers((prev) => new Set(prev).add(poke.fromUsername));
  };

  return (
    <section>
      <SectionHeader title={`Friends (${friends.length})`} />
      <div className="space-y-2">
        {friends.length === 0 && <EmptyText text="No friends yet" />}
        {friends.map((friend) => {
          const incomingPoke = pokes.find((p) => p.fromUsername === friend.username && p.isActive);
          const alreadyPoked = pokedUsers.has(friend.username);

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
  );
}
