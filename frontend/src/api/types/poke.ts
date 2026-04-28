export interface PokeDto {
  id: string;

  fromUserId: string;
  toUserId: string;

  fromUsername: string;

  createdAtUtc: string;
  seenAtUtc?: string;

  isActive: boolean;
}