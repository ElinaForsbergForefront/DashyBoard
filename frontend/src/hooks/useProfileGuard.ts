import type { UserDto } from '../api/types/users';

export const useProfileGuard = (user: UserDto | undefined): boolean => {
  if (!user) return false;
  return !!(
    user.username?.trim() &&
    user.displayName?.trim() &&
    user.country?.trim() &&
    user.city?.trim()
  );
};
