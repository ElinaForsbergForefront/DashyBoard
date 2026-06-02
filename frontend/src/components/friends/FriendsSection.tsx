import {
  useGetFriendListQuery,
  useGetPokesQuery,
  useGetSentPokesQuery,
  useBlockUserMutation,
  useRemoveFriendMutation,
  useSendPokeMutation,
  useDismissPokeMutation,
} from '../../api/endpoints/friends';
import { SectionHeader, FriendRow, SectionCard, IconButton, EmptyText } from './shared';

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
      <SectionCard>
        {friends.length === 0 && <EmptyText text="No friends yet" />}
        {friends.map((friend) => {
          const incomingPoke = pokes.find((p) => p.fromUsername === friend.username && p.isActive);
          const outgoingPoke = sentPokes.find((p) => p.toUsername === friend.username && p.isActive);

          return (
            <FriendRow
              key={friend.username}
              username={friend.username}
              displayName={friend.displayName}
              indicator={incomingPoke ? '👋' : undefined}
            >
              {incomingPoke ? (
                <button
                  onClick={() => handlePokeBack(incomingPoke.id, incomingPoke.fromUsername)}
                  className="rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                >
                  Poke back 👋
                </button>
              ) : outgoingPoke ? (
                <span className="px-2.5 py-1.5 text-xs text-muted">Poked ✓</span>
              ) : (
                <button
                  onClick={() => handlePoke(friend.username)}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted hover:text-foreground hover:bg-overlay transition-colors"
                >
                  👋 Poke
                </button>
              )}
              <IconButton onClick={() => blockUser(friend.username)}>Block</IconButton>
              <IconButton variant="destructive" onClick={() => removeFriend(friend.username)}>Remove</IconButton>
            </FriendRow>
          );
        })}
      </SectionCard>
    </section>
  );
}

