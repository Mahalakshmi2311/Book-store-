import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingBag,
  Eye,
  Check,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Book, BookCategory, BookFormat } from '../types';
import { BookCard } from '../components/common/BookCard';
import { RatingStars } from '../components/common/RatingStars';

export const BooksPage: React.FC = () => {
  const {
    books,
    categories,
    pageParams,
    navigate,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewBook,
    openAIAssistant,
  } = useApp();

  // Filters State
  const [search, setSearch] = useState<string>(pageParams.search || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    pageParams.category || 'all'
  );
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(150);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(
    pageParams.filter === 'deals'
  );
  const [onlyBestsellers, setOnlyBestsellers] = useState<boolean>(
    pageParams.filter === 'bestseller'
  );
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(
    pageParams.filter === 'featured'
  );

  // Sorting & Layout
  const [sortBy, setSortBy] = useState<
    'featured' | 'price-asc' | 'price-desc' | 'rating-desc' | 'discount-desc' | 'newest'
  >('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // React to pageParams changes (e.g. from navbar category click or search)
  useEffect(() => {
    if (pageParams.category) {
      setSelectedCategory(pageParams.category);
    }
    if (pageParams.search !== undefined) {
      setSearch(pageParams.search);
    }
    if (pageParams.filter === 'deals') {
      setOnSaleOnly(true);
    }
    if (pageParams.filter === 'bestseller') {
      setOnlyBestsellers(true);
    }
    if (pageParams.filter === 'featured') {
      setOnlyFeatured(true);
    }
    setCurrentPage(1);
  }, [pageParams]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedFormat('all');
    setMinRating(0);
    setMaxPrice(150);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setOnlyBestsellers(false);
    setOnlyFeatured(false);
    setSortBy('featured');
    setCurrentPage(1);
  };

  // Filtered & Sorted books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesTitle = book.title.toLowerCase().includes(query);
        const matchesAuthor = book.author.toLowerCase().includes(query);
        const matchesCat = book.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAuthor && !matchesCat) return false;
      }

      // Category
      if (selectedCategory !== 'all' && book.category !== selectedCategory) {
        return false;
      }

      // Format
      if (selectedFormat !== 'all' && book.format !== selectedFormat) {
        return false;
      }

      // Price (considering discount)
      const effectivePrice =
        book.discount > 0 ? book.price * (1 - book.discount / 100) : book.price;
      if (effectivePrice > maxPrice) {
        return false;
      }

      // Rating
      if (minRating > 0 && book.rating < minRating) {
        return false;
      }

      // Stock
      if (inStockOnly && book.stockStatus === 'Out of Stock') {
        return false;
      }

      // On Sale
      if (onSaleOnly && book.discount <= 0) {
        return false;
      }

      // Bestseller
      if (onlyBestsellers && !book.bestSeller) {
        return false;
      }

      // Featured
      if (onlyFeatured && !book.featured) {
        return false;
      }

      return true;
    });
  }, [
    books,
    search,
    selectedCategory,
    selectedFormat,
    maxPrice,
    minRating,
    inStockOnly,
    onSaleOnly,
    onlyBestsellers,
    onlyFeatured,
  ]);

  const sortedBooks = useMemo(() => {
    const list = [...filteredBooks];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => {
          const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
          return priceA - priceB;
        });
      case 'price-desc':
        return list.sort((a, b) => {
          const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
          return priceB - priceA;
        });
      case 'rating-desc':
        return list.sort((a, b) => b.rating - a.rating);
      case 'discount-desc':
        return list.sort((a, b) => b.discount - a.discount);
      case 'newest':
        return list.sort((a, b) => b.publishedYear - a.publishedYear);
      case 'featured':
      default:
        return list.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
    }
  }, [filteredBooks, sortBy]);

  // Paginated books
  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);
  const paginatedBooks = sortedBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Active filters count
  const hasActiveFilters =
    search !== '' ||
    selectedCategory !== 'all' ||
    selectedFormat !== 'all' ||
    minRating > 0 ||
    maxPrice < 150 ||
    inStockOnly ||
    onSaleOnly ||
    onlyBestsellers ||
    onlyFeatured;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb & Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
          <button onClick={() => navigate('home')} className="hover:underline">
            Home
          </button>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-medium">All Books</span>
          {selectedCategory !== 'all' && (
            <>
              <span>/</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {selectedCategory}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
              {selectedCategory === 'all' ? 'All Books & Catalog' : selectedCategory}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Showing {sortedBooks.length} titles available for instant dispatch
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                openAIAssistant(
                  selectedCategory !== 'all'
                    ? `Recommend the best books in the ${selectedCategory} category`
                    : undefined
                )
              }
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Ask AI for Recommendations</span>
            </button>

            {/* Mobile Filter toggle button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen((prev) => !prev)}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <Filter className="w-4 h-4" />
              <span>Filters {hasActiveFilters ? '(Active)' : ''}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters Desktop */}
        <aside
          className={`${
            mobileFilterOpen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-900 p-6 overflow-y-auto' : 'hidden lg:block'
          } lg:relative lg:w-64 shrink-0`}
        >
          {mobileFilterOpen && (
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800 lg:hidden">
              <h2 className="font-serif text-lg font-bold">Filter Books</h2>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          )}

          <div className="space-y-6">
            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}

            {/* Categories */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Categories
              </h3>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setCurrentPage(1);
                  }}
                  className={`w-full flex items-center justify-between text-xs py-1 px-2 rounded-md text-left transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[10px] text-slate-400">{books.length}</span>
                </button>
                {categories.map((cat) => {
                  const count = books.filter((b) => b.category === cat.name).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setCurrentPage(1);
                      }}
                      className={`w-full flex items-center justify-between text-xs py-1 px-2 rounded-md text-left transition-colors ${
                        selectedCategory === cat.name
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-400">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Max Price
                </h3>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  ${maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>$10</span>
                <span>$75</span>
                <span>$150</span>
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2.5">
                Rating
              </h3>
              <div className="space-y-1.5">
                {[0, 4.5, 4.0, 3.5].map((val) => (
                  <label
                    key={val}
                    className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="minRating"
                      checked={minRating === val}
                      onChange={() => {
                        setMinRating(val);
                        setCurrentPage(1);
                      }}
                      className="accent-blue-600"
                    />
                    {val === 0 ? (
                      <span>All Ratings</span>
                    ) : (
                      <span className="flex items-center gap-1">
                        {val}★ &amp; above
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Formats */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2.5">
                Format
              </h3>
              <div className="space-y-1.5">
                {(['all', 'Paperback', 'Hardcover', 'E-Book', 'Audiobook'] as const).map(
                  (fmt) => (
                    <label
                      key={fmt}
                      className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="format"
                        checked={selectedFormat === fmt}
                        onChange={() => {
                          setSelectedFormat(fmt);
                          setCurrentPage(1);
                        }}
                        className="accent-blue-600"
                      />
                      <span className="capitalize">{fmt === 'all' ? 'All Formats' : fmt}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Stock & Specials */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2.5">
                Availability &amp; Offers
              </h3>
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
                />
                <span>In Stock Only</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onSaleOnly}
                  onChange={(e) => {
                    setOnSaleOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
                />
                <span>On Sale / Discounted</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyBestsellers}
                  onChange={(e) => {
                    setOnlyBestsellers(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
                />
                <span>Bestsellers Only</span>
              </label>
            </div>

            {mobileFilterOpen && (
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold lg:hidden"
              >
                Apply Filters ({sortedBooks.length} results)
              </button>
            )}
          </div>
        </aside>

        {/* Catalog Main Content */}
        <main className="flex-1">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 mb-6">
            {/* Search within page */}
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Filter catalog by keyword..."
                className="w-full pl-8 pr-8 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Sort & View Mode */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs py-1.5 px-2.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="featured">Featured / Curated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="discount-desc">Biggest Discount</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active filter tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">Active Filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md font-medium">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}>
                    <X className="w-3 h-3 hover:text-rose-500" />
                  </button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-medium">
                  Search: &ldquo;{search}&rdquo;
                  <button onClick={() => setSearch('')}>
                    <X className="w-3 h-3 hover:text-rose-500" />
                  </button>
                </span>
              )}
              {maxPrice < 150 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-medium">
                  Under ${maxPrice}
                  <button onClick={() => setMaxPrice(150)}>
                    <X className="w-3 h-3 hover:text-rose-500" />
                  </button>
                </span>
              )}
              {minRating > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-medium">
                  Rating &ge; {minRating}★
                  <button onClick={() => setMinRating(0)}>
                    <X className="w-3 h-3 hover:text-rose-500" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-md font-medium">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="w-3 h-3 hover:text-rose-500" />
                  </button>
                </span>
              )}
              {onSaleOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-md font-medium">
                  On Sale
                  <button onClick={() => setOnSaleOnly(false)}>
                    <X className="w-3 h-3 hover:text-rose-500" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:underline font-semibold ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Books List or Grid */}
          {sortedBooks.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-1">
                No matching books found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                We couldn't find any books matching your specific filters. Try expanding your price range, clearing keywords, or selecting all categories.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="flex flex-col gap-4">
              {paginatedBooks.map((book) => {
                const discountedPrice =
                  book.discount > 0 ? book.price * (1 - book.discount / 100) : book.price;
                const inWishlist = isInWishlist(book.id);
                return (
                  <div
                    key={book.id}
                    onClick={() => navigate('book-details', { id: book.id })}
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-24 sm:w-28 aspect-[3/4] object-cover rounded-lg shadow-xs shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                          <span className="font-medium text-blue-600 dark:text-blue-400">
                            {book.category}
                          </span>
                          <span>·</span>
                          <span>{book.format}</span>
                          {book.discount > 0 && (
                            <span className="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              Save {book.discount}%
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                          by <span className="font-medium">{book.author}</span>
                        </p>

                        <div className="mb-2">
                          <RatingStars rating={book.rating} count={book.reviewCount} size="sm" />
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {book.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-slate-900 dark:text-white">
                            ${discountedPrice.toFixed(2)}
                          </span>
                          {book.discount > 0 && (
                            <span className="text-xs text-slate-400 line-through">
                              ${book.price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(book.id)}
                            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600"
                            aria-label="Wishlist"
                          >
                            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>
                          <button
                            type="button"
                            onClick={() => addToCart(book, 1, book.format)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNumber = idx + 1;
                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => {
                      setCurrentPage(pageNumber);
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                    className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
