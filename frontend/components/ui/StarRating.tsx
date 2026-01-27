import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = 'md',
  showValue = false,
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const displayValue = hover !== null ? hover : value;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= displayValue;
          const halfFilled = !filled && star - 0.5 <= displayValue;

          return (
            <button
              key={star}
              type="button"
              disabled={readonly}
              onClick={() => handleClick(star)}
              onMouseEnter={() => !readonly && setHover(star)}
              onMouseLeave={() => !readonly && setHover(null)}
              className={`${sizeClasses[size]} ${
                readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
              } transition-transform`}
              aria-label={`Rate ${star} stars`}
            >
              {filled ? (
                <svg
                  className="fill-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ) : halfFilled ? (
                <svg
                  className="fill-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <linearGradient id={`half-${star}`}>
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="rgb(229, 231, 235)" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <path
                    fill={`url(#half-${star})`}
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  />
                </svg>
              ) : (
                <svg
                  className="fill-gray-300 dark:fill-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {displayValue.toFixed(1)}
        </span>
      )}
    </div>
  );
}
