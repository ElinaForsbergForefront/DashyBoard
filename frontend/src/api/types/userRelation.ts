export interface UserRelationDto {
  id: string;

  user1Id: string;
  user2Id: string;

  username: string;        // den andra personen (det du visar i UI)
  displayName?: string;

  status: 'Pending' | 'Accepted' | 'Blocked';

  requestedByUserId: string;

  createdAtUtc: string;
  respondedAtUtc?: string;
  blockedAtUtc?: string;
}