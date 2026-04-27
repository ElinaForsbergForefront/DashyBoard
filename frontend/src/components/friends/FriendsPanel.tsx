import { useState } from 'react';
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

  const [sendFriendRequest] = useSendFriendRequestMutation();
  const [acceptFriendRequest] = useAcceptFriendRequestMutation();
  const [rejectFriendRequest] = useRejectFriendRequestMutation();
  const [removeFriend] = useRemoveFriendMutation();
  const [blockUser] = useBlockUserMutation();
  const [unblockUser] = useUnblockUserMutation();
  const [sendPoke] = useSendPokeMutation();
  const [markPokeAsSeen] = useMarkPokeAsSeenMutation();
  const [dismissPoke] = useDismissPokeMutation();

  if (requestsLoading || friendsLoading || blockedLoading || pokesLoading) {
    return <div>Loading friends...</div>;
  }

  const handleSendRequest = async () => {
    const trimmed = addUsername.trim();
    if (!trimmed) return;
    await sendFriendRequest(trimmed);
    setAddUsername('');
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold">Add friend</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={addUsername}
            onChange={(e) => setAddUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendRequest()}
            placeholder="Username"
          />
          <button onClick={handleSendRequest}>Send request</button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Friend requests</h2>

        {requests.length === 0 && <p>No friend requests</p>}

        {requests.map((request) => (
          <div key={request.username} className="flex items-center gap-2">
            <span>{request.username}</span>

            <button onClick={() => acceptFriendRequest(request.username)}>
              Accept
            </button>

            <button onClick={() => rejectFriendRequest(request.username)}>
              Reject
            </button>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-lg font-semibold">Friends</h2>

        {friends.length === 0 && <p>No friends yet</p>}

        {friends.map((friend) => (
          <div key={friend.username} className="flex items-center gap-2">
            <span>{friend.username}</span>

            <button onClick={() => sendPoke(friend.username)}>
              Poke
            </button>

            <button onClick={() => removeFriend(friend.username)}>
              Remove
            </button>

            <button onClick={() => blockUser(friend.username)}>
              Block
            </button>
          </div>
        ))}
      </section>

      {pokes.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold">Pokes</h2>

          {pokes.map((poke) => (
            <div key={poke.id} className="flex items-center gap-2">
              <span>{poke.fromUsername} poked you</span>

              {!poke.seenAtUtc && (
                <button onClick={() => markPokeAsSeen(poke.id)}>
                  Mark as seen
                </button>
              )}

              <button onClick={() => dismissPoke(poke.id)}>
                Dismiss
              </button>
            </div>
          ))}
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold">Blocked users</h2>

        {blockedUsers.length === 0 && <p>No blocked users</p>}

        {blockedUsers.map((user) => (
          <div key={user.username} className="flex items-center gap-2">
            <span>{user.username}</span>

            <button onClick={() => unblockUser(user.username)}>
              Unblock
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}