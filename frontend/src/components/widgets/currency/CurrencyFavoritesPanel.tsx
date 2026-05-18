import { X } from 'lucide-react';
import { useCurrencyFavorites } from '../../../hooks/useCurrencyFavorites';

interface CurrencyFavoritesPanelProps {
  onSelectFavorite: (symbol: string) => void;
}

export function CurrencyFavoritesPanel({ onSelectFavorite }: CurrencyFavoritesPanelProps) {
  const { favorites, isLoading, isRemoving, toggleFavorite } = useCurrencyFavorites();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="px-3 py-4 text-center">
        <p className="text-xs text-muted">No favorites yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="px-3 py-2 text-xs font-medium text-muted">Favorites ({favorites.length}/5)</p>
      <ul className="py-1 space-y-0.5">
        {favorites.map((favorite) => (
          <li key={favorite.symbol}>
            <div className="flex items-center gap-2 px-3 py-2 hover:bg-overlay rounded transition group">
              <button
                type="button"
                onClick={() => onSelectFavorite(favorite.symbol)}
                className="flex-1 text-left cursor-pointer"
              >
                <p className="text-xs font-medium text-foreground">{favorite.symbol}</p>
                <p className="text-[10px] text-muted">
                  {new Date(favorite.addedAt).toLocaleDateString()}
                </p>
              </button>
              <button
                type="button"
                onClick={() => toggleFavorite(favorite.symbol)}
                disabled={isRemoving}
                className="opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-destructive/10 text-destructive disabled:opacity-50"
                title="Remove from favorites"
              >
                <X size={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
