export const FAVORITES_MAX_COUNT = 5;

export const FAVORITES_ERROR_MESSAGES = {
  LIMIT_REACHED: `User has reached maximum of ${FAVORITES_MAX_COUNT} favorites.`,
  ALREADY_FAVORITED: 'Currency is already favorited.',
  INVALID_SYMBOL: 'Symbol cannot be empty.',
} as const;
