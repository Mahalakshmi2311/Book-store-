import React, { useState } from 'react';
import { BookOpen, Mail, ShieldCheck, Truck, RotateCcw, Headphones, Heart, Check, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { navigate, categories, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    addToast('Thank you for subscribing! Check your inbox for code NEST15', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 dark:bg-slate-950 border-t border-slate-800">
      {/* Top features banner */}
      <div className="border-b border-slate-800 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-800/40">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Free Fast Delivery</div>
              <div className="text-xs text-slate-400">On all orders over $35 nationwide</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-800/40">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">100% Secure Checkout</div>
              <div className="text-xs text-slate-400">256-Bit SSL encrypted payments</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-800/40">
            <div className="w-10 h-10 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">30-Day Easy Returns</div>
              <div className="text-xs text-slate-400">Hassle-free money back guarantee</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-800/40">
            <div className="w-10 h-10 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Dedicated Support</div>
              <div className="text-xs text-slate-400">24/7 reader and author helpline</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <div
              onClick={() => navigate('home')}
              className="flex items-center gap-2.5 cursor-pointer mb-4"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Book<span className="text-blue-400">Nest</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6 max-w-sm">
              BookNest is a premier online haven for curious minds and bibliophiles. We curate the world’s most influential books, from timeless literary fiction and transformative non-fiction to cutting-edge technology volumes.
            </p>

            {/* Newsletter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                Join The BookNest Club
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                Subscribe to get 15% off your first purchase plus curated weekly reading lists.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-medium">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>You're subscribed! Use promo code <strong>NEST15</strong> at checkout.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 7).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigate('books', { category: cat.name })}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate('categories')}
                  className="text-blue-400 hover:underline font-semibold"
                >
                  View All Categories &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('contact')} className="text-slate-400 hover:text-white transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => navigate('user-profile', { tab: 'orders' })} className="text-slate-400 hover:text-white transition-colors">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => navigate('cart')} className="text-slate-400 hover:text-white transition-colors">
                  Shopping Cart &amp; Bag
                </button>
              </li>
              <li>
                <button onClick={() => navigate('wishlist')} className="text-slate-400 hover:text-white transition-colors">
                  Reading Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => navigate('about')} className="text-slate-400 hover:text-white transition-colors">
                  About Our Mission
                </button>
              </li>
              <li>
                <button onClick={() => navigate('admin-dashboard')} className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Staff &amp; Admin Panel
                </button>
              </li>
            </ul>
          </div>

          {/* Store info & Hours */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Bookstore Location
            </h4>
            <address className="not-italic text-xs text-slate-400 space-y-2 mb-4 leading-relaxed">
              <p>BookNest Flagship Store</p>
              <p>450 University Avenue</p>
              <p>Palo Alto, CA 94301</p>
              <p className="text-white font-medium pt-1">Mon - Sat: 9:00 AM - 9:00 PM</p>
              <p className="text-slate-400">Sunday: 10:00 AM - 6:00 PM</p>
            </address>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Direct inquiries:</span>
              <a href="mailto:support@booknest.com" className="text-xs text-blue-400 hover:underline">
                support@booknest.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright & payment icons */}
      <div className="border-t border-slate-800/80 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} BookNest Inc. All rights reserved. Built for discerning readers.
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
              Accepted Payments:
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300">VISA</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300">Mastercard</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300">Amex</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300">PayPal</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300">Apple Pay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
