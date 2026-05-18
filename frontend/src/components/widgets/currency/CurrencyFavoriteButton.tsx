import { Star } from 'lucide-react';
import { useCurrencyFavorites } from '../../../hooks/useCurrencyFavorites';

interface CurrencyFavoriteButtonProps {
  symbol: string;
  compact?: boolean;
  showLabel?: boolean;
}

export function CurrencyFavoriteButton({
  symbol,
  compact = false,
  showLabel = false,
}: CurrencyFavoriteButtonProps) {
  const { isFavorited, isAtLimit, isAdding, isRemoving, toggleFavorite, error } =
    useCurrencyFavorites(symbol);

  const isLoading = isAdding || isRemoving;

  const tooltipText = isFavorited
    ? `Remove ${symbol} from favorites`
    : isAtLimit
      ? 'Maximum favorites reached (5 limit)'
      : `Add ${symbol} to favorites`;

  const handleClick = async () => {
    try {
      await toggleFavorite(symbol);
    } catch (err) {
      // Error is logged in hook, silently handled here
      console.error('Error toggling favorite:', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading || (isAtLimit && !isFavorited)}
      title={tooltipText}
      aria-label={tooltipText}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition font-medium text-xs
        ${isFavorited ? 'bg-yellow-500/15 text-yellow-600 hover:bg-yellow-500/25' : 'bg-overlay text-muted hover:text-foreground hover:bg-overlay-hover'}
        ${isLoading || (isAtLimit && !isFavorited) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${compact ? 'px-1.5 py-1' : ''}`}
    >
      <Star
        size={compact ? 14 : 16}
        className={`transition ${isFavorited ? 'fill-current' : ''}`}
      />
      {showLabel && !compact && <span>{isFavorited ? 'Favorited' : 'Favorite'}</span>}
      {error && <span className="text-red-500">!</span>}
    </button>
  );
}
