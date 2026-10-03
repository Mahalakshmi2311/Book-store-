import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Book,
  BookCategory,
  BookFormat,
  BookReview,
  CartItem,
  CategoryInfo,
  Order,
  OrderStatus,
  ShippingAddress,
  ToastMessage,
  User,
} from '../types';
import { INITIAL_BOOKS } from '../data/books';
import { INITIAL_CATEGORIES } from '../data/categories';
import { INITIAL_ORDERS, INITIAL_REVIEWS, INITIAL_USERS } from '../data/mockData';

interface AppContextType {
  // Navigation
  currentPage: string;
  pageParams: Record<string, any>;
  navigate: (page: string, params?: Record<string, any>) => void;

  // Dark Mode
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Books
  books: Book[];
  categories: CategoryInfo[];
  getBookById: (id: string) => Book | undefined;
  addBook: (book: Omit<Book, 'id'>) => Book;
  updateBook: (id: string, updated: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addCategory: (category: Omit<CategoryInfo, 'id'>) => void;
  updateCategory: (id: string, updated: Partial<CategoryInfo>) => void;

  // Reviews
  reviews: BookReview[];
  getBookReviews: (bookId: string) => BookReview[];
  addReview: (review: Omit<BookReview, 'id' | 'date' | 'helpfulCount'>) => void;

  // Cart
  cart: CartItem[];
  addToCart: (book: Book, quantity?: number, format?: BookFormat) => void;
  removeFromCart: (bookId: string, format?: BookFormat) => void;
  updateCartQuantity: (bookId: string, quantity: number, format?: BookFormat) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedPromo: string | null;
  promoDiscountRate: number;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;

  // Wishlist
  wishlist: string[]; // book ids
  toggleWishlist: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;
  removeFromWishlist: (bookId: string) => void;
  moveWishlistToCart: () => void;

  // User & Auth
  currentUser: User | null;
  users: User[];
  login: (email: string, role?: 'customer' | 'admin') => boolean;
  logout: () => void;
  register: (name: string, email: string) => boolean;
  updateUserProfile: (updated: Partial<User>) => void;
  isAdmin: boolean;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    items: CartItem[];
    shippingAddress: ShippingAddress;
    shippingMethod: string;
    shippingFee: number;
    paymentMethod: 'Credit Card' | 'PayPal' | 'Cash on Delivery';
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: (userId: string) => Order[];

  // Quick View Modal
  quickViewBook: Book | null;
  setQuickViewBook: (book: Book | null) => void;

  // Global Toast Notifications
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Global Search input sync
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // AI Assistant Modal
  isAIAssistantOpen: boolean;
  openAIAssistant: (initialPrompt?: string) => void;
  closeAIAssistant: () => void;
  aiInitialPrompt: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });
  const [pageParams, setPageParams] = useState<Record<string, any>>({});

  // Sync hash with currentPage
  const navigate = (page: string, params: Record<string, any> = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('bn_dark_mode');
    return saved === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('bn_dark_mode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Books State with LocalStorage
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('bn_books');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse books from localStorage', e);
      }
    }
    return INITIAL_BOOKS;
  });

  useEffect(() => {
    localStorage.setItem('bn_books', JSON.stringify(books));
  }, [books]);

  // Categories State with LocalStorage
  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    const saved = localStorage.getItem('bn_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse categories', e);
      }
    }
    return INITIAL_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem('bn_categories', JSON.stringify(categories));
  }, [categories]);

  // Reviews State
  const [reviews, setReviews] = useState<BookReview[]>(() => {
    const saved = localStorage.getItem('bn_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse reviews', e);
      }
    }
    return INITIAL_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem('bn_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Users State
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('bn_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse users', e);
      }
    }
    return INITIAL_USERS;
  });

  useEffect(() => {
    localStorage.setItem('bn_users', JSON.stringify(users));
  }, [users]);

  // Current User State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bn_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse current user', e);
      }
    }
    return INITIAL_USERS[0]; // Default logged in as customer for seamless demo
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bn_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bn_current_user');
    }
  }, [currentUser]);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bn_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse orders', e);
      }
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('bn_orders', JSON.stringify(orders));
  }, [orders]);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bn_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('bn_cart', JSON.stringify(cart));
  }, [cart]);

  // Wishlist State (Array of book IDs)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('bn_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse wishlist', e);
      }
    }
    return ['fict-01', 'tech-01', 'self-01'];
  });

  useEffect(() => {
    localStorage.setItem('bn_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Promo Code State
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscountRate, setPromoDiscountRate] = useState<number>(0);

  // Quick View Modal
  const [quickViewBook, setQuickViewBook] = useState<Book | null>(null);

  // Search Query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // AI Assistant Modal State
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | null>(null);

  const openAIAssistant = (initialPrompt?: string) => {
    if (initialPrompt) {
      setAiInitialPrompt(initialPrompt);
    }
    setIsAIAssistantOpen(true);
  };

  const closeAIAssistant = () => {
    setIsAIAssistantOpen(false);
    setAiInitialPrompt(null);
  };

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Book Actions
  const getBookById = (id: string): Book | undefined => {
    return books.find((b) => b.id === id);
  };

  const addBook = (bookData: Omit<Book, 'id'>): Book => {
    const newBook: Book = {
      ...bookData,
      id: `bk-${Date.now().toString(36)}`,
    };
    setBooks((prev) => [newBook, ...prev]);
    addToast(`"${newBook.title}" added to catalog`, 'success');
    return newBook;
  };

  const updateBook = (id: string, updated: Partial<Book>) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updated } : b))
    );
    addToast('Book updated successfully', 'success');
  };

  const deleteBook = (id: string) => {
    const target = books.find((b) => b.id === id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
    // Also remove from cart and wishlist
    setCart((prev) => prev.filter((i) => i.book.id !== id));
    setWishlist((prev) => prev.filter((wid) => wid !== id));
    addToast(`Book "${target?.title || 'Unknown'}" removed`, 'info');
  };

  const addCategory = (categoryData: Omit<CategoryInfo, 'id'>) => {
    const newCat: CategoryInfo = {
      ...categoryData,
      id: `cat-${Date.now().toString(36)}`,
    };
    setCategories((prev) => [...prev, newCat]);
    addToast(`Category "${newCat.name}" added`, 'success');
  };

  const updateCategory = (id: string, updated: Partial<CategoryInfo>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
    addToast('Category updated', 'success');
  };

  // Review Actions
  const getBookReviews = (bookId: string): BookReview[] => {
    return reviews.filter((r) => r.bookId === bookId);
  };

  const addReview = (reviewData: Omit<BookReview, 'id' | 'date' | 'helpfulCount'>) => {
    const newReview: BookReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
    };
    setReviews((prev) => [newReview, ...prev]);

    // Recalculate book average rating
    const existing = reviews.filter((r) => r.bookId === reviewData.bookId);
    const totalScore = existing.reduce((acc, r) => acc + r.rating, 0) + reviewData.rating;
    const newAverage = Number((totalScore / (existing.length + 1)).toFixed(1));

    setBooks((prev) =>
      prev.map((b) =>
        b.id === reviewData.bookId
          ? { ...b, rating: newAverage, reviewCount: b.reviewCount + 1 }
          : b
      )
    );
    addToast('Your review has been submitted!', 'success');
  };

  // Cart Actions
  const addToCart = (book: Book, quantity: number = 1, format: BookFormat = 'Paperback') => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.book.id === book.id && item.selectedFormat === format
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { book, quantity, selectedFormat: format }];
    });
    addToast(`Added "${book.title}" to cart`, 'success');
  };

  const removeFromCart = (bookId: string, format?: BookFormat) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.book.id === bookId && (!format || item.selectedFormat === format))
      )
    );
    addToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (bookId: string, quantity: number, format?: BookFormat) => {
    if (quantity <= 0) {
      removeFromCart(bookId, format);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.book.id === bookId && (!format || item.selectedFormat === format)) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cart.reduce((acc, item) => {
    const effectivePrice = item.book.discount > 0
      ? item.book.price * (1 - item.book.discount / 100)
      : item.book.price;
    return acc + effectivePrice * item.quantity;
  }, 0);

  const applyPromo = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'NEST15') {
      setAppliedPromo('NEST15 (15% Off)');
      setPromoDiscountRate(0.15);
      addToast('Promo code NEST15 applied: 15% discount!', 'success');
      return true;
    }
    if (cleanCode === 'WELCOME10') {
      setAppliedPromo('WELCOME10 (10% Off)');
      setPromoDiscountRate(0.10);
      addToast('Promo code WELCOME10 applied: 10% discount!', 'success');
      return true;
    }
    if (cleanCode === 'BOOKWORM25') {
      setAppliedPromo('BOOKWORM25 (25% Off)');
      setPromoDiscountRate(0.25);
      addToast('Super reader code applied: 25% discount!', 'success');
      return true;
    }
    addToast('Invalid promo code. Try NEST15 or WELCOME10', 'error');
    return false;
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoDiscountRate(0);
    addToast('Promo code removed', 'info');
  };

  // Wishlist Actions
  const toggleWishlist = (bookId: string) => {
    const exists = wishlist.includes(bookId);
    if (exists) {
      setWishlist((prev) => prev.filter((id) => id !== bookId));
      addToast('Removed from wishlist', 'info');
    } else {
      setWishlist((prev) => [...prev, bookId]);
      const book = books.find((b) => b.id === bookId);
      addToast(`Saved "${book?.title || 'Book'}" to wishlist`, 'success');
    }
  };

  const isInWishlist = (bookId: string) => wishlist.includes(bookId);

  const removeFromWishlist = (bookId: string) => {
    setWishlist((prev) => prev.filter((id) => id !== bookId));
    addToast('Removed from wishlist', 'info');
  };

  const moveWishlistToCart = () => {
    wishlist.forEach((bookId) => {
      const book = books.find((b) => b.id === bookId);
      if (book) {
        addToCart(book, 1, book.format);
      }
    });
    setWishlist([]);
    addToast('All wishlist items moved to cart!', 'success');
  };

  // Auth Actions
  const login = (email: string, role: 'customer' | 'admin' = 'customer'): boolean => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      addToast(`Welcome back, ${existing.name}!`, 'success');
      return true;
    }
    // Create new customer account if not found
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: role,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    addToast(`Welcome to BookNest, ${newUser.name}!`, 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('You have been logged out', 'info');
  };

  const register = (name: string, email: string): boolean => {
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      addToast('An account with this email already exists', 'error');
      return false;
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'customer',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    addToast(`Account created! Welcome, ${name}!`, 'success');
    return true;
  };

  const updateUserProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updated };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    addToast('Profile updated successfully', 'success');
  };

  const isAdmin = currentUser?.role === 'admin';

  // Orders Actions
  const createOrder = (orderData: {
    items: CartItem[];
    shippingAddress: ShippingAddress;
    shippingMethod: string;
    shippingFee: number;
    paymentMethod: 'Credit Card' | 'PayPal' | 'Cash on Delivery';
  }): Order => {
    const subtotal = orderData.items.reduce((acc, item) => {
      const price = item.book.discount > 0
        ? item.book.price * (1 - item.book.discount / 100)
        : item.book.price;
      return acc + price * item.quantity;
    }, 0);

    const discount = subtotal * promoDiscountRate;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * 0.08; // 8% sales tax
    const total = taxableAmount + orderData.shippingFee + tax;

    const estimatedDays = orderData.shippingMethod.includes('Express') ? 2 : 4;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + estimatedDays);

    const newOrder: Order = {
      id: `BN-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: currentUser?.id || 'guest',
      items: orderData.items.map((i) => ({
        bookId: i.book.id,
        title: i.book.title,
        author: i.book.author,
        coverImage: i.book.coverImage,
        price: i.book.discount > 0
          ? Number((i.book.price * (1 - i.book.discount / 100)).toFixed(2))
          : i.book.price,
        quantity: i.quantity,
        format: i.selectedFormat,
      })),
      shippingAddress: orderData.shippingAddress,
      shippingMethod: orderData.shippingMethod,
      shippingFee: orderData.shippingFee,
      subtotal: Number(subtotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
      status: 'Processing',
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString(),
      estimatedDelivery: estDate.toISOString().split('T')[0],
      trackingNumber: `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Decrease book stock quantities
    setBooks((prev) =>
      prev.map((book) => {
        const ordered = orderData.items.find((i) => i.book.id === book.id);
        if (ordered) {
          const nextStock = Math.max(0, book.stockQuantity - ordered.quantity);
          return {
            ...book,
            stockQuantity: nextStock,
            stockStatus: nextStock === 0 ? 'Out of Stock' : nextStock < 5 ? 'Low Stock' : 'In Stock',
          };
        }
        return book;
      })
    );

    clearCart();
    setAppliedPromo(null);
    setPromoDiscountRate(0);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    addToast(`Order ${orderId} status updated to ${status}`, 'success');
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((o) => o.id === orderId);
  };

  const getUserOrders = (userId: string): Order[] => {
    return orders.filter((o) => o.userId === userId);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        pageParams,
        navigate,
        darkMode,
        toggleDarkMode,
        books,
        categories,
        getBookById,
        addBook,
        updateBook,
        deleteBook,
        addCategory,
        updateCategory,
        reviews,
        getBookReviews,
        addReview,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedPromo,
        promoDiscountRate,
        applyPromo,
        removePromo,
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        moveWishlistToCart,
        currentUser,
        users,
        login,
        logout,
        register,
        updateUserProfile,
        isAdmin,
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        getUserOrders,
        quickViewBook,
        setQuickViewBook,
        toasts,
        addToast,
        removeToast,
        searchQuery,
        setSearchQuery,
        isAIAssistantOpen,
        openAIAssistant,
        closeAIAssistant,
        aiInitialPrompt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
