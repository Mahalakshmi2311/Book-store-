import React, { useState } from 'react';
import {
  Heart,
  ShoppingBag,
  Share2,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  BookOpen,
  Calendar,
  Layers,
  Globe,
  Tag,
  Star,
  ThumbsUp,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookFormat } from '../types';
import { RatingStars } from '../components/common/RatingStars';
import { BookCard } from '../components/common/BookCard';

export const BookDetailsPage: React.FC = () => {
  const {
    books,
    pageParams,
    navigate,
    addToCart,
    toggleWishlist,
    isInWishlist,
    getBookReviews,
    addReview,
    currentUser,
    addToast,
    openAIAssistant,
  } = useApp();

  const bookId = pageParams.id || books[0]?.id;
  const book = books.find((b) => b.id === bookId) || books[0];

  const [selectedFormat, setSelectedFormat] = useState<BookFormat>(book.format || 'Paperback');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');
  const [added, setAdded] = useState(false);

  // Review Form State
  const [reviewName, setReviewName] = useState(currentUser?.name || '');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold mb-4">Book not found</h2>
        <button
          onClick={() => navigate('books')}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Return to Books Catalog
        </button>
      </div>
    );
  }

  const inWishlist = isInWishlist(book.id);
  const discountedPrice = book.discount > 0 ? book.price * (1 - book.discount / 100) : book.price;
  const isOutOfStock = book.stockStatus === 'Out of Stock';
  const reviews = getBookReviews(book.id);

  // Related books from same category
  const relatedBooks = books
    .filter((b) => b.category === book.category && b.id !== book.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(book, quantity, selectedFormat);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(book, quantity, selectedFormat);
    navigate('checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Link copied to clipboard!', 'info');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      addToast('Please enter both review headline and comments', 'error');
      return;
    }
    addReview({
      bookId: book.id,
      userName: reviewName.trim() || 'Anonymous Reader',
      rating: reviewRating,
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
      verifiedPurchase: true,
    });
    setReviewTitle('');
    setReviewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
        <button onClick={() => navigate('home')} className="hover:underline">
          Home
        </button>
        <span>/</span>
        <button
          onClick={() => navigate('books', { category: book.category })}
          className="hover:underline"
        >
          {book.category}
        </button>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">
          {book.title}
        </span>
      </nav>

      {/* Main Book Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
        {/* Left: Book Cover & Badges */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
            {book.discount > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md">
                -{book.discount}% OFF
              </span>
            )}
            {book.bestSeller && (
              <span className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md">
                BESTSELLER
              </span>
            )}
          </div>

          <div className="w-full max-w-sm mt-6 grid grid-cols-3 gap-2 text-center text-xs text-slate-600 dark:text-slate-400">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <Truck className="w-4 h-4 mx-auto text-blue-600 mb-1" />
              <span className="block font-semibold text-slate-900 dark:text-white">Fast Shipping</span>
              <span className="text-[10px] text-slate-400">Ships in 24h</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <RotateCcw className="w-4 h-4 mx-auto text-blue-600 mb-1" />
              <span className="block font-semibold text-slate-900 dark:text-white">Easy Returns</span>
              <span className="text-[10px] text-slate-400">30-day window</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <ShieldCheck className="w-4 h-4 mx-auto text-blue-600 mb-1" />
              <span className="block font-semibold text-slate-900 dark:text-white">100% Genuine</span>
              <span className="text-[10px] text-slate-400">Verified publisher</span>
            </div>
          </div>
        </div>

        {/* Right: Book Details & Actions */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex items-center justify-between gap-4 mb-2">
            <button
              onClick={() => navigate('books', { category: book.category })}
              className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:underline"
            >
              {book.category}
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(book.id)}
                className={`p-2 rounded-full border transition-colors ${
                  inWishlist
                    ? 'border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950/40'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
              </button>
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
            {book.title}
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            by <strong className="text-slate-900 dark:text-white font-semibold">{book.author}</strong> (Author)
          </p>

          <button
            type="button"
            onClick={() =>
              openAIAssistant(
                `Recommend books similar to "${book.title}" by ${book.author} in the ${book.category} genre`
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/60 dark:to-indigo-950/60 hover:from-blue-100 hover:to-indigo-100 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold border border-blue-200 dark:border-blue-800 transition-colors w-fit mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Ask AI for books similar to this &rarr;</span>
          </button>

          {/* Rating & Reviews summary */}
          <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
            <RatingStars rating={book.rating} count={book.reviewCount} size="md" />
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <button
              onClick={() => setActiveTab('reviews')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Read Customer Reviews ({reviews.length})
            </button>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                ${discountedPrice.toFixed(2)}
              </span>
              {book.discount > 0 && (
                <>
                  <span className="text-sm text-slate-400 line-through">
                    ${book.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded">
                    Save ${(book.price - discountedPrice).toFixed(2)} ({book.discount}% off)
                  </span>
                </>
              )}
            </div>

            {/* Stock status */}
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOutOfStock
                    ? 'bg-rose-500'
                    : book.stockStatus === 'Low Stock'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />
              <span
                className={`text-xs font-semibold ${
                  isOutOfStock
                    ? 'text-rose-600'
                    : book.stockStatus === 'Low Stock'
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {book.stockStatus}
                {book.stockStatus !== 'Out of Stock' && ` (${book.stockQuantity} copies remaining)`}
              </span>
            </div>
          </div>

          {/* Book Format selection */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Format Edition
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['Paperback', 'Hardcover', 'E-Book', 'Audiobook'] as BookFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setSelectedFormat(fmt)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedFormat === fmt
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 ring-2 ring-blue-600/20'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">{fmt}</div>
                  <div className="text-[11px] text-slate-500">
                    {fmt === 'E-Book'
                      ? '$9.99 instant'
                      : fmt === 'Audiobook'
                      ? '$14.99 audio'
                      : `$${discountedPrice.toFixed(2)}`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Cart Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
              >
                -
              </button>
              <span className="px-4 text-xs font-bold text-slate-900 dark:text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(book.stockQuantity, q + 1))}
                className="px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
              >
                +
              </button>
            </div>

            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-6 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isOutOfStock
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : added
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
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
                  <span>Add to Cart · ${(discountedPrice * quantity).toFixed(2)}</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              className="py-3 px-6 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm disabled:opacity-50"
            >
              Buy Now
            </button>
          </div>

          {/* Quick specs pill */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs text-slate-600 dark:text-slate-400">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Pages</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{book.pages}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Language</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{book.language}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Published</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{book.publishedYear}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Publisher</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                {book.publisher}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Overview, Specifications, Customer Reviews */}
      <div className="mb-16">
        <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-bold transition-colors relative ${
              activeTab === 'overview'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Synopsis &amp; Overview
            {activeTab === 'overview' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm font-bold transition-colors relative ${
              activeTab === 'specs'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Product Details
            {activeTab === 'specs' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm font-bold transition-colors relative ${
              activeTab === 'reviews'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Reader Reviews ({reviews.length})
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
              About &ldquo;{book.title}&rdquo;
            </h3>
            <p>{book.description}</p>
            <p>
              Carefully formatted and printed on acid-free paper, this volume has been preserved for longevity. Whether you are adding this to your personal library or gifting it to an eager mind, this edition stands out for its clarity and editorial craftsmanship.
            </p>
          </div>
        )}

        {/* Tab 2: Specs */}
        {activeTab === 'specs' && (
          <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="flex py-3 px-4">
              <span className="w-1/3 text-slate-500">ISBN-13</span>
              <span className="w-2/3 font-medium text-slate-900 dark:text-white">{book.isbn}</span>
            </div>
            <div className="flex py-3 px-4">
              <span className="w-1/3 text-slate-500">Publisher</span>
              <span className="w-2/3 font-medium text-slate-900 dark:text-white">{book.publisher}</span>
            </div>
            <div className="flex py-3 px-4">
              <span className="w-1/3 text-slate-500">Publication Year</span>
              <span className="w-2/3 font-medium text-slate-900 dark:text-white">{book.publishedYear}</span>
            </div>
            <div className="flex py-3 px-4">
              <span className="w-1/3 text-slate-500">Print Length</span>
              <span className="w-2/3 font-medium text-slate-900 dark:text-white">{book.pages} pages</span>
            </div>
            <div className="flex py-3 px-4">
              <span className="w-1/3 text-slate-500">Language</span>
              <span className="w-2/3 font-medium text-slate-900 dark:text-white">{book.language}</span>
            </div>
            <div className="flex py-3 px-4">
              <span className="w-1/3 text-slate-500">Selected Format</span>
              <span className="w-2/3 font-medium text-slate-900 dark:text-white">{selectedFormat}</span>
            </div>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                Customer Ratings &amp; Thoughts ({reviews.length})
              </h3>

              {reviews.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  No reviews yet for this title. Be the first to share your thoughts!
                </div>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        {rev.userAvatar ? (
                          <img
                            src={rev.userAvatar}
                            alt={rev.userName}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                            {rev.userName[0]}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {rev.userName}
                          </div>
                          {rev.verifiedPurchase && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                    </div>

                    <div className="mb-1.5">
                      <RatingStars rating={rev.rating} size="sm" showScore={false} />
                    </div>

                    <h4 className="font-semibold text-xs text-slate-900 dark:text-white mb-1">
                      {rev.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Write a review form */}
            <div className="lg:col-span-5">
              <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <h4 className="font-serif text-base font-bold text-slate-900 dark:text-white mb-1">
                  Write a Customer Review
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Share your genuine opinion with fellow book enthusiasts.
                </p>

                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Your Rating
                    </label>
                    <RatingStars
                      rating={reviewRating}
                      size="md"
                      interactive={true}
                      onRatingChange={setReviewRating}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Maya S."
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="What is the most important thing to know?"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Review Comments
                    </label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write your review here..."
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Books in same Category */}
      {relatedBooks.length > 0 && (
        <section className="pt-10 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                More in {book.category}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Readers who enjoyed this book also explored these titles
              </p>
            </div>
            <button
              onClick={() => navigate('books', { category: book.category })}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View full shelf</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedBooks.map((relBook) => (
              <BookCard key={relBook.id} book={relBook} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
