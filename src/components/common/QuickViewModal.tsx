import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RatingStars } from './RatingStars';
import { BookFormat } from '../../types';

export const QuickViewModal: React.FC = () => {
  const { quickViewBook, setQuickViewBook, addToCart, toggleWishlist, isInWishlist, navigate } = useApp();
  const [selectedFormat, setSelectedFormat] = useState<BookFormat>('Paperback');
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);

  if (!quickViewBook) return null;

  const book = quickViewBook;
  const inWishlist = isInWishlist(book.id);
  const discountedPrice = book.discount > 0 ? book.price * (1 - book.discount / 100) : book.price;
  const isOutOfStock = book.stockStatus === 'Out of Stock';

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(book, quantity, selectedFormat);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleClose = () => {
    setQuickViewBook(null);
  };

  const handleGoToDetails = () => {
    handleClose();
    navigate('book-details', { id: book.id });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Book Image Column */}
        <div className="md:w-5/12 bg-slate-50 dark:bg-slate-800/40 p-6 flex flex-col items-center justify-center relative">
          <div className="w-48 sm:w-56 aspect-[3/4] rounded-lg overflow-hidden shadow-lg border border-slate-200/60 dark:border-slate-700">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Free over $35
            </span>
            <span className="flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              30-day return
            </span>
          </div>
        </div>

        {/* Content Column */}
        <div className="md:w-7/12 p-6 overflow-y-auto max-h-[60vh] md:max-h-[85vh] flex flex-col">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1.5">
            {book.category}
          </div>

          <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-1">
            {book.title}
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Author: <span className="font-medium text-slate-800 dark:text-slate-200">{book.author}</span>
          </p>

          <div className="flex items-center gap-3 mb-4">
            <RatingStars rating={book.rating} count={book.reviewCount} size="sm" />
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className={`text-xs font-medium ${
              isOutOfStock
                ? 'text-rose-600 dark:text-rose-400'
                : book.stockStatus === 'Low Stock'
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {book.stockStatus} ({book.stockQuantity} available)
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              ${discountedPrice.toFixed(2)}
            </span>
            {book.discount > 0 && (
              <>
                <span className="text-sm text-slate-400 line-through">
                  ${book.price.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  Save ${(book.price - discountedPrice).toFixed(2)} ({book.discount}% off)
                </span>
              </>
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
            {book.description}
          </p>

          {/* Format selection */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Available Formats
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Paperback', 'Hardcover', 'E-Book', 'Audiobook'] as BookFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    selectedFormat === fmt
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(book.stockQuantity, q + 1))}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-bold"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-colors ${
                  isOutOfStock
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart - ${(discountedPrice * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(book.id)}
                className={`p-2.5 rounded-lg border transition-colors ${
                  inWishlist
                    ? 'border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950/40'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleGoToDetails}
              className="text-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Full Product Details &amp; Reviews &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
