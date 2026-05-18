import { useCallback, useMemo } from 'react';
import {
  useGetUserFavoritesQuery,
  useCheckIfFavoritedQuery,
  useAddFavoriteCurrencyMutation,
  useRemoveFavoriteCurrencyMutation,
} from '../api/endpoints/currency';

export function useCurrencyFavorites(symbol?: string) {
  const {
    data: favorites = [],
    isLoading: favoritesLoading,
    error: favoritesError,
  } = useGetUserFavoritesQuery();

  const { data: checkData, isLoading: checkLoading } = useCheckIfFavoritedQuery(symbol || '', {
    skip: !symbol,
  });

  const [addFavorite, { isLoading: isAdding, error: addError }] = useAddFavoriteCurrencyMutation();
  const [removeFavorite, { isLoading: isRemoving, error: removeError }] =
    useRemoveFavoriteCurrencyMutation();

  const isFavorited = useMemo(() => {
    if (!symbol) return false;
    return favorites.some((fav) => fav.symbol === symbol);
  }, [favorites, symbol]);

  const isAtLimit = useMemo(() => favorites.length >= 5, [favorites.length]);

  const toggleFavorite = useCallback(
    async (sym: string) => {
      const favStatus = favorites.some((fav) => fav.symbol === sym);
      try {
        if (favStatus) {
          await removeFavorite(sym).unwrap();
        } else {
          if (isAtLimit) {
            throw new Error('Maximum favorites reached (5 limit)');
          }
          await addFavorite(sym).unwrap();
        }
      } catch (error) {
        console.error('Failed to toggle favorite:', error);
        throw error;
      }
    },
    [favorites, isAtLimit, addFavorite, removeFavorite],
  );

  return {
    favorites,
    isFavorited,
    isAtLimit,
    isLoading: favoritesLoading || checkLoading,
    isAdding,
    isRemoving,
    error: favoritesError || addError || removeError,
    toggleFavorite,
  };
}
