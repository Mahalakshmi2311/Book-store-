import React from 'react';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { Book } from '../../types';
import { useApp } from '../../context/AppContext';
import { RatingStars } from './RatingStars';

interface BookCardProps {
  book: Book;
  compact?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, compact = false }) => {
  const { navigate, addToCart, toggleWishlist, isInWishlist, setQuickViewBook } = useApp();
  const [justAdded, setJustAdded] = React.useState(false);

  const inWishlist = isInWishlist(book.id);
  const discountedPrice = book.discount > 0 ? book.price * (1 - book.discount / 100) : book.price;
  const isOutOfStock = book.stockStatus === 'Out of Stock';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(book, 1, book.format);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(book.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewBook(book);
  };

  return (
    <div
      onClick={() => navigate('book-details', { id: book.id })}
      className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900 cursor-pointer overflow-hidden"
    >
      {/* Top badges / discount */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5 pointer-events-none">
        {book.discount > 0 && (
          <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
            -{book.discount}%
          </span>
        )}
        {book.bestSeller && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
            Bestseller
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        type="button"
        onClick={handleToggleWishlist}
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-800 shadow-xs transition-colors"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            inWishlist ? 'fill-rose-500 text-rose-500' : ''
          }`}
        />
      </button>

      {/* Book Cover Image container */}
      <div className="relative w-full aspect-[3/4] mb-3.5 bg-slate-100 dark:bg-slate-800/60 rounded-lg overflow-hidden flex items-center justify-center">
        <img
          src={book.coverImage}
          alt={book.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover Quick View overlay */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 pointer-events-none group-hover:pointer-events-auto">
          <button
            type="button"
            onClick={handleQuickView}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg shadow-md hover:bg-blue-600 hover:text-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>

        {/* Out of Stock banner */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-900/80 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Metadata & Title */}
      <div className="flex flex-col flex-grow">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-medium text-blue-600 dark:text-blue-400">{book.category}</span>
          <span aria-hidden="true">·</span>
          <span>{book.format}</span>
        </div>

        <h3 className="font-serif font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
          {book.title}
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
          by <span className="font-medium text-slate-700 dark:text-slate-300">{book.author}</span>
        </p>

        {/* Ratings */}
        <div className="mb-3">
          <RatingStars rating={book.rating} count={book.reviewCount} size="sm" />
        </div>

        {/* Stock Status text */}
        {book.stockStatus === 'Low Stock' && (
          <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 mb-2">
            Only {book.stockQuantity} left in stock
          </p>
        )}

        {/* Price & Action */}
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                ${discountedPrice.toFixed(2)}
              </span>
              {book.discount > 0 && (
                <span className="text-xs text-slate-400 line-through">
                  ${book.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              isOutOfStock
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow-sm'
            }`}
            aria-label={`Add ${book.title} to cart`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
