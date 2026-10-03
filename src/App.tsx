import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { AIAssistantLauncher } from './components/ai/AIAssistantLauncher';

// Pages
import { HomePage } from './pages/HomePage';
import { BooksPage } from './pages/BooksPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { BookDetailsPage } from './pages/BookDetailsPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const PageRenderer: React.FC = () => {
  const { currentPage } = useApp();

  switch (currentPage) {
    case 'home':
      return <HomePage />;
    case 'books':
      return <BooksPage />;
    case 'categories':
      return <CategoriesPage />;
    case 'book-details':
      return <BookDetailsPage />;
    case 'cart':
      return <CartPage />;
    case 'wishlist':
      return <WishlistPage />;
    case 'login':
      return <LoginPage />;
    case 'register':
      return <RegisterPage />;
    case 'user-profile':
      return <UserProfilePage />;
    case 'checkout':
      return <CheckoutPage />;
    case 'order-success':
      return <OrderSuccessPage />;
    case 'about':
      return <AboutPage />;
    case 'contact':
      return <ContactPage />;
    case 'admin-dashboard':
      return <AdminDashboardPage />;
    default:
      return <HomePage />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
        <Navbar />
        <main className="flex-1">
          <PageRenderer />
        </main>
        <Footer />
        <QuickViewModal />
        <AIAssistantModal />
        <AIAssistantLauncher />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
