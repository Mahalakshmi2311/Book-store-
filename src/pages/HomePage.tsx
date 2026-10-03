import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Star,
  TrendingUp,
  Percent,
  Clock,
  ShieldCheck,
  Truck,
  Heart,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookCard } from '../components/common/BookCard';
import { RatingStars } from '../components/common/RatingStars';
import { BookCategory } from '../types';

export const HomePage: React.FC = () => {
  const { books, categories, navigate, openAIAssistant } = useApp();

  // Flash Sale Countdown Timer (simulated for today)
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const featuredBooks = books.filter((b) => b.featured).slice(0, 4);
  const bestSellers = books.filter((b) => b.bestSeller).slice(0, 4);
  const dealBooks = books.filter((b) => b.dealOfTheDay || b.discount >= 20).slice(0, 4);

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900 border-b border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Hero Text */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wide uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Over 60+ Curated Titles Across 8 Categories
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.15] mb-5 tracking-tight">
              Where Stories Find A{' '}
              <span className="text-blue-600 dark:text-blue-400 underline decoration-blue-300 dark:decoration-blue-700 decoration-wavy decoration-2">
                Home
              </span>{' '}
              &amp; Minds Expand.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              Explore bestsellers, literary classics, algorithmic computer science, groundbreaking biographies, and children's adventures. Delivered straight to your doorstep with care.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                type="button"
                onClick={() => navigate('books')}
                className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all hover:gap-3"
              >
                <span>Browse All Books</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('categories')}
                className="w-full sm:w-auto px-7 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold rounded-xl text-sm border border-slate-300 dark:border-slate-700 transition-colors"
              >
                Explore Categories
              </button>
            </div>

            {/* Quick stats under Hero */}
            <div className="mt-10 pt-8 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-3 gap-6 text-center lg:text-left">
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  64+
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Curated Titles
                </div>
              </div>
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  8
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Major Genres
                </div>
              </div>
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  4.8★
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Average Reader Score
                </div>
              </div>
            </div>
          </div>

          {/* Hero Featured Collage */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative flex justify-center items-center">
            <div className="relative w-72 sm:w-80 aspect-[3/4] z-20 shadow-2xl rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
              <img
                src={books[0]?.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80'}
                alt="Book cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-xs uppercase font-bold text-blue-400 mb-1">Editor's Pick</span>
                <h3 className="font-serif text-xl font-bold">{books[0]?.title}</h3>
                <p className="text-xs text-slate-300">by {books[0]?.author}</p>
              </div>
            </div>

            {/* Back offset book */}
            <div className="hidden sm:block absolute -right-4 top-4 w-64 aspect-[3/4] z-10 shadow-xl rounded-2xl overflow-hidden opacity-90 transform rotate-[8deg] border-2 border-white dark:border-slate-800">
              <img
                src={books[8]?.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80'}
                alt="Second book"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Back left book */}
            <div className="hidden sm:block absolute -left-4 bottom-4 w-60 aspect-[3/4] z-10 shadow-lg rounded-2xl overflow-hidden opacity-80 transform -rotate-[10deg] border-2 border-white dark:border-slate-800">
              <img
                src={books[24]?.coverImage || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=700&q=80'}
                alt="Third book"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendation Assistant Interactive Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full -mt-6">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-xl border border-blue-500/30 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center shrink-0 shadow-inner">
              <Sparkles className="w-6 h-6 text-amber-300 fill-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                Gemini-Powered Book Advisor
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight text-white">
                Not Sure What to Read Next? Ask Nestor!
              </h3>
              <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
                Our smart recommendation assistant analyzes your interests, favorite authors, and budget to suggest exact matches from our 64+ titles.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0">
            <button
              type="button"
              onClick={() => openAIAssistant('Recommend top books under $20 in your catalog')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition-colors text-center"
            >
              Under $20 Picks
            </button>
            <button
              type="button"
              onClick={() => openAIAssistant('Recommend books for computer science students and engineers')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition-colors text-center"
            >
              For Tech &amp; Students
            </button>
            <button
              type="button"
              onClick={() => openAIAssistant()}
              className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/30 flex items-center justify-center gap-1.5 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Launch AI Advisor</span>
            </button>
          </div>
        </div>
      </section>

      {/* Categories Bar / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Explore by Category
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Find exactly what you love from our 8 signature shelves
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('categories')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>All Categories</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const count = books.filter((b) => b.category === cat.name).length;
            return (
              <div
                key={cat.id}
                onClick={() => navigate('books', { category: cat.name })}
                className="group flex flex-col items-center text-center p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden mb-2 relative shadow-xs">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-blue-600/30 transition-colors" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">{count} books</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Books Shelf */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Featured Selections
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Staff picks and highly acclaimed literature this month
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('books', { filter: 'featured' })}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>See more</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Flash Deals / Deals of the Day Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 relative overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4 text-rose-400 fill-rose-400" />
                Limited Time Flash Deals
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
                Save Up To 30% Off Selected Bestsellers
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Grab these award-winning reads before the sale expires. Handpicked discounts across technology, memoirs, and fiction.
              </p>
            </div>

            {/* Countdown Box */}
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xs p-3 sm:p-4 rounded-xl border border-white/10 shrink-0">
              <Clock className="w-5 h-5 text-amber-400 hidden sm:block" />
              <div className="text-center">
                <span className="font-mono text-xl sm:text-2xl font-bold text-white">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400">Hours</span>
              </div>
              <span className="text-xl font-bold text-amber-400">:</span>
              <div className="text-center">
                <span className="font-mono text-xl sm:text-2xl font-bold text-white">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400">Mins</span>
              </div>
              <span className="text-xl font-bold text-amber-400">:</span>
              <div className="text-center">
                <span className="font-mono text-xl sm:text-2xl font-bold text-white">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400">Secs</span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {dealBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => navigate('book-details', { id: book.id })}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-3 cursor-pointer transition-colors"
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-14 h-20 object-cover rounded-md shadow-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="inline-block text-[10px] font-bold text-rose-300 bg-rose-500/20 px-1.5 py-0.5 rounded mb-1">
                    Save {book.discount}%
                  </span>
                  <h4 className="font-serif font-bold text-xs text-white truncate">{book.title}</h4>
                  <p className="text-[11px] text-slate-300 truncate">by {book.author}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-bold text-sm text-white">
                      ${(book.price * (1 - book.discount / 100)).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      ${book.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Shelf */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                All-Time Bestsellers
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The most read and cherished volumes among our reader network
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('books', { filter: 'bestseller' })}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View all bestsellers</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Customer Reviews & Testimonials */}
      <section className="bg-slate-50 dark:bg-slate-800/50 py-12 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Customer Voices
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Loved by Avid Readers Everywhere
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Over 50,000 satisfied book lovers trust BookNest for packaging precision, fast dispatch, and curated titles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col">
              <RatingStars rating={5} count={undefined} size="sm" showScore={false} />
              <p className="text-xs text-slate-700 dark:text-slate-300 italic mt-3 mb-4 flex-1 leading-relaxed">
                &ldquo;The hardcover quality of the algorithm and system design books arrived in pristine shape. Fast 2-day delivery and great discount codes!&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Reviewer"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Elena Rostova</div>
                  <div className="text-[10px] text-slate-400">Verified Reader · Seattle, WA</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col">
              <RatingStars rating={5} count={undefined} size="sm" showScore={false} />
              <p className="text-xs text-slate-700 dark:text-slate-300 italic mt-3 mb-4 flex-1 leading-relaxed">
                &ldquo;BookNest is my go-to bookstore now. The category shelves are so thoughtfully curated, and their customer care team is prompt and respectful.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Reviewer"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Marcus Chen</div>
                  <div className="text-[10px] text-slate-400">Verified Reader · Boston, MA</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col">
              <RatingStars rating={5} count={undefined} size="sm" showScore={false} />
              <p className="text-xs text-slate-700 dark:text-slate-300 italic mt-3 mb-4 flex-1 leading-relaxed">
                &ldquo;I ordered 8 children’s books for my kids’ birthday and they arrived nicely wrapped with bookmark gifts. Wonderful bookstore experience.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="Reviewer"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Amina Al-Mansoor</div>
                  <div className="text-[10px] text-slate-400">Verified Reader · Austin, TX</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-blue-500/10">
          <div className="max-w-xl">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-2">
              Ready to Discover Your Next Read?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Join thousands of enthusiastic book lovers. Get 15% off your first order today with promo code <strong className="text-white bg-blue-800/70 px-2 py-0.5 rounded font-mono">NEST15</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('books')}
              className="px-6 py-3 bg-white text-blue-700 font-bold rounded-xl text-xs hover:bg-blue-50 transition-colors shadow-xs"
            >
              Start Browsing Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
