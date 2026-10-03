import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookCard } from '../components/common/BookCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, books, removeFromWishlist, moveWishlistToCart, navigate } = useApp();

  const savedBooks = books.filter((b) => wishlist.includes(b.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
              My Reading Wishlist ({savedBooks.length})
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Keep track of volumes you plan to read, study, or gift
          </p>
        </div>

        {savedBooks.length > 0 && (
          <button
            type="button"
            onClick={moveWishlistToCart}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Move All Items to Cart</span>
          </button>
        )}
      </div>

      {savedBooks.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 max-w-xl mx-auto">
          <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mb-3">
            <Heart className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white mb-2">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            Whenever you find a title you'd like to read later, click the heart icon on any book card to save it here!
          </p>
          <button
            type="button"
            onClick={() => navigate('books')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
          >
            Browse Bookstore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {savedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};
