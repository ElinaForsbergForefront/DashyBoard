export interface UserRelationDto {
  id: string;

  user1Id: string;
  user2Id: string;

  username: string;        // den andra personen (det som visas i UI)
  displayName?: string;

  status: 'Pending' | 'Accepted' | 'Blocked';

  requestedByUserId: string;

  createdAtUtc: string;
  respondedAtUtc?: string;
  blockedAtUtc?: string;
}