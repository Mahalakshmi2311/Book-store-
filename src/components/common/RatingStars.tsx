import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showScore?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  count,
  size = 'sm',
  interactive = false,
  onRatingChange,
  showScore = true,
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const starSizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const currentVal = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const filled = currentVal >= starIndex;
          const half = !filled && currentVal >= starIndex - 0.5;

          return (
            <button
              key={starIndex}
              type="button"
              disabled={!interactive}
              onMouseEnter={() => interactive && setHoverRating(starIndex)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              onClick={() => interactive && onRatingChange && onRatingChange(starIndex)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none p-0.5`}
              aria-label={`${starIndex} star`}
            >
              <Star
                className={`${starSizeClasses[size]} ${
                  filled
                    ? 'fill-amber-400 text-amber-400'
                    : half
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'text-slate-300 dark:text-slate-600'
                } transition-colors`}
              />
            </button>
          );
        })}
      </div>

      {showScore && (
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {rating.toFixed(1)}
        </span>
      )}

      {count !== undefined && (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
};
