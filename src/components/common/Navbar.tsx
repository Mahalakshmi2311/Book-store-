import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  Search,
  ShoppingCart,
  Heart,
  User,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Shield,
  LogOut,
  Package,
  Layers,
  Sparkles,
  Phone,
  Tag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookCategory } from '../../types';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    navigate,
    darkMode,
    toggleDarkMode,
    cartCount,
    cartSubtotal,
    wishlist,
    currentUser,
    logout,
    isAdmin,
    categories,
    books,
    searchQuery,
    setSearchQuery,
    openAIAssistant,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchFocused(false);
      }
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(e.target as Node)
      ) {
        setCategoriesDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter matching books for live search suggestions
  const searchResults = searchQuery.trim()
    ? books
        .filter(
          (b) =>
            b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('books', { search: searchQuery.trim() });
      setSearchFocused(false);
    }
  };

  const handleSelectBook = (bookId: string) => {
    navigate('book-details', { id: bookId });
    setSearchFocused(false);
    setSearchQuery('');
  };

  const handleCategoryClick = (categoryName: BookCategory) => {
    navigate('books', { category: categoryName });
    setCategoriesDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      {/* Top micro announcement bar */}
      <div className="bg-slate-900 text-slate-200 dark:bg-slate-950 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-blue-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Free shipping on orders over $35
            </span>
            <span className="text-slate-400">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Tag className="w-3 h-3 text-rose-400" />
              Use code <strong className="text-white bg-slate-800 px-1.5 py-0.5 rounded ml-1">NEST15</strong> for 15% off
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer" onClick={() => navigate('contact')}>
              <Phone className="w-3 h-3" />
              24/7 Reader Support
            </span>
            <span>·</span>
            <button
              onClick={() => navigate('about')}
              className="hover:text-white transition-colors"
            >
              Our Story
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          onClick={() => navigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Book<span className="text-blue-600 dark:text-blue-400">Nest</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-300 -mt-1 font-semibold">
              Curated Bookstore
            </span>
          </div>
        </div>

        {/* Categories Dropdown button (Desktop) */}
        <div className="relative hidden lg:block" ref={categoriesDropdownRef}>
          <button
            type="button"
            onClick={() => setCategoriesDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Categories</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {categoriesDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Browse by Category
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between transition-colors"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {books.filter((b) => b.category === cat.name).length} books
                    </span>
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100 dark:border-slate-800 mt-1">
                <button
                  onClick={() => {
                    setCategoriesDropdownOpen(false);
                    navigate('categories');
                  }}
                  className="w-full py-1.5 text-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All Categories &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search Bar with Live Preview */}
        <div className="flex-1 max-w-xl relative" ref={searchContainerRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search by book title, author, or category..."
              className="w-full pl-10 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Autocomplete Dropdown */}
          {searchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
              {searchResults.length > 0 ? (
                <div>
                  <div className="px-3.5 py-2 text-[11px] font-semibold text-slate-400 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    Search Results ({searchResults.length})
                  </div>
                  {searchResults.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => handleSelectBook(book.id)}
                      className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-b-0 transition-colors"
                    >
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-9 h-12 object-cover rounded shadow-xs"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs text-slate-900 dark:text-white truncate">
                          {book.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          by {book.author} · <span className="text-blue-600 dark:text-blue-400">{book.category}</span>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        ${(book.discount > 0 ? book.price * (1 - book.discount / 100) : book.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/60 text-center">
                    <button
                      onClick={handleSearchSubmit}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      See all results for &ldquo;{searchQuery}&rdquo; &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  No books found matching &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Wishlist */}
          <button
            type="button"
            onClick={() => navigate('wishlist')}
            aria-label="Wishlist"
            className={`relative p-2 rounded-lg transition-colors ${
              currentPage === 'wishlist'
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            type="button"
            onClick={() => navigate('cart')}
            aria-label="Cart"
            className={`flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-lg transition-colors ${
              currentPage === 'cart'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Cart</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                ${cartSubtotal.toFixed(2)}
              </span>
            </div>
          </button>

          {/* User Account / Admin Menu */}
          <div className="relative" ref={userDropdownRef}>
            {currentUser ? (
              <button
                type="button"
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.name[0]}
                  </div>
                )}
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden md:inline max-w-[100px] truncate">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:inline" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* User Dropdown */}
            {userDropdownOpen && currentUser && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                  {isAdmin && (
                    <span className="inline-block mt-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded">
                      Admin Access
                    </span>
                  )}
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      navigate('user-profile');
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    My Account &amp; Profile
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      navigate('user-profile', { tab: 'orders' });
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5"
                  >
                    <Package className="w-4 h-4 text-slate-400" />
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      navigate('admin-dashboard');
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 flex items-center gap-2.5"
                  >
                    <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Admin Dashboard
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2.5"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Open mobile menu"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Secondary desktop navigation link bar */}
      <nav className="hidden lg:block border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-7 py-2.5">
            <button
              onClick={() => navigate('home')}
              className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                currentPage === 'home'
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigate('books')}
              className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                currentPage === 'books'
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              All Books ({books.length})
            </button>
            <button
              onClick={() => navigate('categories')}
              className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                currentPage === 'categories'
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => navigate('books', { filter: 'bestseller' })}
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Bestsellers
            </button>
            <button
              onClick={() => navigate('books', { filter: 'deals' })}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1 font-bold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Deals of the Day
            </button>
            <button
              onClick={() => navigate('about')}
              className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                currentPage === 'about'
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              About
            </button>
            <button
              onClick={() => navigate('contact')}
              className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                currentPage === 'contact'
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Contact
            </button>
          </div>

          <div className="flex items-center gap-3 py-2.5">
            <button
              onClick={() => openAIAssistant()}
              className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-bold shadow-xs transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>AI Recommender</span>
            </button>
            <button
              onClick={() => navigate('admin-dashboard')}
              className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-top-4">
          <div className="flex flex-col gap-2 font-medium text-sm text-slate-800 dark:text-slate-200">
            <button
              onClick={() => {
                navigate('home');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate('books');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              All Books ({books.length})
            </button>
            <button
              onClick={() => {
                navigate('categories');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Categories
            </button>

            {/* Categories list in mobile */}
            <div className="pl-4 py-1 flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-400 border-l-2 border-slate-200 dark:border-slate-800 my-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCategoryClick(c.name)}
                  className="text-left py-1 hover:text-blue-600"
                >
                  {c.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                navigate('wishlist');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span>Wishlist</span>
              <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                {wishlist.length}
              </span>
            </button>
            <button
              onClick={() => {
                navigate('cart');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span>Shopping Cart</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                {cartCount} items · ${cartSubtotal.toFixed(2)}
              </span>
            </button>
            <button
              onClick={() => {
                navigate('about');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              About BookNest
            </button>
            <button
              onClick={() => {
                navigate('contact');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Contact Support
            </button>
            <button
              onClick={() => {
                openAIAssistant();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Ask AI Book Assistant</span>
            </button>
            <button
              onClick={() => {
                navigate('admin-dashboard');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Admin Dashboard
            </button>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 mt-2">
              {currentUser ? (
                <div className="flex items-center justify-between px-3">
                  <div>
                    <div className="font-semibold text-xs">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-rose-600 font-semibold"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigate('login');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-2 text-center text-xs font-semibold bg-blue-600 text-white rounded-lg"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      navigate('register');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-2 text-center text-xs font-semibold border border-slate-300 dark:border-slate-700 rounded-lg"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
