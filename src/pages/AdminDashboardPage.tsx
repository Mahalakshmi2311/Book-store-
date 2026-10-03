import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookPlus,
  Edit,
  Trash2,
  FolderTree,
  ShoppingBag,
  Users,
  Search,
  Plus,
  X,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Package,
  Layers,
  Eye,
  Shield,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Book, BookCategory, BookFormat, CategoryInfo, OrderStatus, StockStatus } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const {
    books,
    categories,
    orders,
    users,
    addBook,
    updateBook,
    deleteBook,
    addCategory,
    updateCategory,
    updateOrderStatus,
    navigate,
    addToast,
  } = useApp();

  // Active Admin Section Tab
  const [activeSection, setActiveSection] = useState<
    'dashboard' | 'books' | 'categories' | 'orders' | 'users'
  >('dashboard');

  // Book Modal (Add / Edit) State
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [bookForm, setBookForm] = useState<{
    title: string;
    author: string;
    category: BookCategory;
    price: number;
    discount: number;
    rating: number;
    description: string;
    coverImage: string;
    stockStatus: StockStatus;
    stockQuantity: number;
    isbn: string;
    publisher: string;
    publishedYear: number;
    pages: number;
    language: string;
    format: BookFormat;
    featured: boolean;
    bestSeller: boolean;
  }>({
    title: '',
    author: '',
    category: 'Fiction',
    price: 19.99,
    discount: 0,
    rating: 4.8,
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80',
    stockStatus: 'In Stock',
    stockQuantity: 25,
    isbn: '978-0123456789',
    publisher: 'BookNest Publishing',
    publishedYear: 2024,
    pages: 320,
    language: 'English',
    format: 'Paperback',
    featured: false,
    bestSeller: false,
  });

  // Category Modal State
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catForm, setCatForm] = useState<{
    name: BookCategory;
    slug: string;
    description: string;
    image: string;
    iconName: string;
  }>({
    name: 'Fiction',
    slug: 'fiction',
    description: '',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    iconName: 'BookOpen',
  });

  // Search & Filter in Admin tables
  const [bookSearch, setBookSearch] = useState('');
  const [bookCategoryFilter, setBookCategoryFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // KPI Metrics Calculation
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalOrders = orders.length;
  const totalBooks = books.length;
  const totalUsers = users.length;
  const lowStockBooks = books.filter((b) => b.stockQuantity < 5);

  // Open Book Modal for Creating New Book
  const handleOpenAddBook = () => {
    setEditingBookId(null);
    setBookForm({
      title: '',
      author: '',
      category: 'Fiction',
      price: 19.99,
      discount: 0,
      rating: 4.8,
      description: '',
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80',
      stockStatus: 'In Stock',
      stockQuantity: 30,
      isbn: `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      publisher: 'Penguin Classics',
      publishedYear: 2024,
      pages: 350,
      language: 'English',
      format: 'Paperback',
      featured: false,
      bestSeller: false,
    });
    setBookModalOpen(true);
  };

  // Open Book Modal for Editing
  const handleOpenEditBook = (book: Book) => {
    setEditingBookId(book.id);
    setBookForm({
      title: book.title,
      author: book.author,
      category: book.category,
      price: book.price,
      discount: book.discount,
      rating: book.rating,
      description: book.description,
      coverImage: book.coverImage,
      stockStatus: book.stockStatus,
      stockQuantity: book.stockQuantity,
      isbn: book.isbn,
      publisher: book.publisher,
      publishedYear: book.publishedYear,
      pages: book.pages,
      language: book.language,
      format: book.format,
      featured: Boolean(book.featured),
      bestSeller: Boolean(book.bestSeller),
    });
    setBookModalOpen(true);
  };

  // Save Book (Add or Edit)
  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.title.trim() || !bookForm.author.trim()) {
      addToast('Please provide both book title and author', 'error');
      return;
    }

    const calculatedStockStatus: StockStatus =
      bookForm.stockQuantity <= 0
        ? 'Out of Stock'
        : bookForm.stockQuantity < 5
        ? 'Low Stock'
        : 'In Stock';

    if (editingBookId) {
      updateBook(editingBookId, {
        ...bookForm,
        stockStatus: calculatedStockStatus,
      });
    } else {
      addBook({
        ...bookForm,
        reviewCount: 0,
        stockStatus: calculatedStockStatus,
      });
    }
    setBookModalOpen(false);
  };

  // Delete Book handler
  const handleDeleteBook = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}" from catalog?`)) {
      deleteBook(id);
    }
  };

  // Save Category handler
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCatId) {
      updateCategory(editingCatId, catForm);
    } else {
      addCategory(catForm);
    }
    setCatModalOpen(false);
  };

  // Filtered Books in Admin Table
  const adminBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.isbn.includes(bookSearch);
    const matchesCategory =
      bookCategoryFilter === 'all' || b.category === bookCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders in Admin Table
  const adminOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Shield className="w-5 h-5" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              BookNest Admin Central
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Manage books, categories, inventory, customer orders, and user permissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAddBook}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Book</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('books')}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold"
          >
            View Live Store
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveSection('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeSection === 'dashboard'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('books')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeSection === 'books'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <BookPlus className="w-4 h-4" />
          <span>Manage Books ({books.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeSection === 'categories'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Manage Categories ({categories.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeSection === 'orders'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Manage Orders ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeSection === 'users'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manage Users ({users.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. SECTION: DASHBOARD OVERVIEW */}
      {/* ======================================================== */}
      {activeSection === 'dashboard' && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Sales Volume
                </span>
                <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <div className="font-serif text-3xl font-extrabold text-slate-900 dark:text-white">
                ${totalRevenue.toFixed(2)}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                +18.4% from last period
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Orders
                </span>
                <span className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600">
                  <Package className="w-4 h-4" />
                </span>
              </div>
              <div className="font-serif text-3xl font-extrabold text-slate-900 dark:text-white">
                {totalOrders}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                100% fulfill rate recorded
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Catalog Titles
                </span>
                <span className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600">
                  <Layers className="w-4 h-4" />
                </span>
              </div>
              <div className="font-serif text-3xl font-extrabold text-slate-900 dark:text-white">
                {totalBooks}
              </div>
              <span className="text-[11px] text-purple-600 font-semibold mt-1 block">
                Across 8 distinct shelves
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Registered Readers
                </span>
                <span className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="font-serif text-3xl font-extrabold text-slate-900 dark:text-white">
                {totalUsers}
              </div>
              <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
                Active customer network
              </span>
            </div>
          </div>

          {/* Low Stock Alerts */}
          {lowStockBooks.length > 0 && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Low Stock Alert ({lowStockBooks.length} titles)
                  </h4>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300">
                    Some popular editions have 4 or fewer copies remaining in the warehouse.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('books')}
                className="text-xs font-bold text-amber-900 dark:text-amber-200 underline"
              >
                Review Inventory
              </button>
            </div>
          )}

          {/* Recent Orders Overview */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                  Recent Customer Orders
                </h3>
                <p className="text-xs text-slate-500">Latest transactions through the storefront</p>
              </div>
              <button
                onClick={() => setActiveSection('orders')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Manage All Orders &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                        #{order.id}
                      </td>
                      <td className="p-3 font-medium">{order.shippingAddress.fullName}</td>
                      <td className="p-3 text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">{order.items.length} titles</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'Processing'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SECTION: MANAGE BOOKS (CRUD) */}
      {/* ======================================================== */}
      {activeSection === 'books' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <input
                  type="text"
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  placeholder="Search books by title, author, or ISBN..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              <select
                value={bookCategoryFilter}
                onChange={(e) => setBookCategoryFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs py-1.5 px-2.5 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleOpenAddBook}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Book</span>
            </button>
          </div>

          {/* Books Management Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="p-3.5">Cover &amp; Title</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price / Disc.</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5">Rating</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {adminBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-9 h-12 object-cover rounded shadow-xs shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="font-semibold text-slate-900 dark:text-white truncate">
                              {book.title}
                            </div>
                            <div className="text-[11px] text-slate-400">by {book.author}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {book.category}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">
                          ${book.price.toFixed(2)}
                        </div>
                        {book.discount > 0 && (
                          <span className="text-[10px] text-rose-600 font-bold">
                            {book.discount}% OFF
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            book.stockQuantity === 0
                              ? 'bg-rose-100 text-rose-800'
                              : book.stockQuantity < 5
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {book.stockQuantity} in stock
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold">{book.rating}★</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditBook(book)}
                            className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50"
                            aria-label="Edit book"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBook(book.id, book.title)}
                            className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50"
                            aria-label="Delete book"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. SECTION: MANAGE CATEGORIES */}
      {/* ======================================================== */}
      {activeSection === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                Book Categories ({categories.length})
              </h3>
              <p className="text-xs text-slate-500">All active shelves available across BookNest</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingCatId(null);
                setCatForm({
                  name: 'Fiction',
                  slug: 'new-category',
                  description: '',
                  image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
                  iconName: 'BookOpen',
                });
                setCatModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const bookCount = books.filter((b) => b.category === cat.name).length;
              return (
                <div
                  key={cat.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div className="h-32 relative bg-slate-100 dark:bg-slate-800">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[11px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                      {bookCount} books
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base text-slate-900 dark:text-white mb-1">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                        {cat.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => navigate('books', { category: cat.name })}
                        className="text-xs text-blue-600 hover:underline font-semibold"
                      >
                        View Books
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCatId(cat.id);
                          setCatForm({
                            name: cat.name,
                            slug: cat.slug,
                            description: cat.description,
                            image: cat.image,
                            iconName: cat.iconName,
                          });
                          setCatModalOpen(true);
                        }}
                        className="text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center gap-1 font-medium"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. SECTION: MANAGE ORDERS */}
      {/* ======================================================== */}
      {activeSection === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                Orders Management ({orders.length})
              </h3>
              <p className="text-xs text-slate-500">Track and update delivery progress</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Status Filter:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs py-1.5 px-3 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="p-3.5">Order ID</th>
                    <th className="p-3.5">Customer &amp; Address</th>
                    <th className="p-3.5">Ordered Books</th>
                    <th className="p-3.5">Total Paid</th>
                    <th className="p-3.5">Current Status</th>
                    <th className="p-3.5 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {adminOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                        #{order.id}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {order.shippingAddress.fullName}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">
                          {order.shippingAddress.city}, {order.shippingAddress.state} ({order.shippingAddress.phone})
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {order.items.length} titles
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-xs">
                          {order.items.map((i) => i.title).join(', ')}
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'Processing'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value as OrderStatus)
                          }
                          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs py-1 px-2 font-medium focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. SECTION: MANAGE USERS */}
      {/* ======================================================== */}
      {activeSection === 'users' && (
        <div className="space-y-6">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
              Registered Accounts ({users.length})
            </h3>
            <p className="text-xs text-slate-500">Customer profiles and administrative personnel</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Orders Placed</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map((u) => {
                    const userOrderCount = orders.filter((o) => o.userId === u.id).length;
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            {u.avatar ? (
                              <img
                                src={u.avatar}
                                alt={u.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                {u.name[0]}
                              </div>
                            )}
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {u.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300">{u.email}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.role === 'admin'
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                                : 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                            }`}
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold">{userOrderCount} orders</td>
                        <td className="p-3.5">
                          <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT BOOK */}
      {/* ======================================================== */}
      {bookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setBookModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white mb-1">
              {editingBookId ? 'Edit Book Information' : 'Add New Book to Catalog'}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Enter complete details for pricing, category, and inventory tracking.
            </p>

            <form onSubmit={handleSaveBook} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Book Title *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.title}
                    onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Author Name *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Category Shelf *</label>
                  <select
                    value={bookForm.category}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, category: e.target.value as BookCategory })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Format</label>
                  <select
                    value={bookForm.format}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, format: e.target.value as BookFormat })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                  >
                    <option value="Paperback">Paperback</option>
                    <option value="Hardcover">Hardcover</option>
                    <option value="E-Book">E-Book</option>
                    <option value="Audiobook">Audiobook</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">List Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={bookForm.price}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Discount % (0-90)</label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={bookForm.discount}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, discount: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={bookForm.stockQuantity}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, stockQuantity: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">ISBN-13</label>
                  <input
                    type="text"
                    value={bookForm.isbn}
                    onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={bookForm.coverImage}
                    onChange={(e) => setBookForm({ ...bookForm, coverImage: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Synopsis &amp; Description</label>
                  <textarea
                    rows={3}
                    value={bookForm.description}
                    onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bookForm.featured}
                    onChange={(e) => setBookForm({ ...bookForm, featured: e.target.checked })}
                    className="accent-blue-600 rounded"
                  />
                  <span>Mark as Featured Selection</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bookForm.bestSeller}
                    onChange={(e) => setBookForm({ ...bookForm, bestSeller: e.target.checked })}
                    className="accent-blue-600 rounded"
                  />
                  <span>Mark as Bestseller</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBookModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT CATEGORY */}
      {/* ======================================================== */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <button
              onClick={() => setCatModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-4">
              {editingCatId ? 'Edit Category' : 'Add New Category'}
            </h2>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value as BookCategory })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={catForm.image}
                  onChange={(e) => setCatForm({ ...catForm, image: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Category Description</label>
                <textarea
                  rows={3}
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
