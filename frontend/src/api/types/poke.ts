export interface PokeDto {
  id: string;

  fromUserId: string;
  toUserId: string;

  fromUsername: string;

  createdAtUtc: string;
  seenAtUtc?: string;

  isActive: boolean;
}

export interface SentPokeDto {
  id: string;

  fromUserId: string;
  toUserId: string;
  toUsername: string;

  createdAtUtc: string;

  isActive: boolean;
}