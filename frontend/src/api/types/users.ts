export interface UserDto {
  id: string;
  email: string | null;
  username: string | null;
  displayName: string | null;
  country: string | null;
  city: string | null;
  authSub: string | null;
  isPremium: boolean;
}

export interface UpdateUserBySubCommand {
  username: string | null;
  displayName: string | null;
  country: string | null;
  city: string | null;
}

export interface UpdateUserByIdCommand {
  id: string;
  username: string | null;
  displayName: string | null;
  country: string | null;
  city: string | null;
}
