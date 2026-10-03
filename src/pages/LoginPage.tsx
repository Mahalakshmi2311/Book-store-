import React, { useState } from 'react';
import { BookOpen, Lock, Mail, ArrowRight, Shield, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { login, navigate, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      addToast('Please enter your email', 'error');
      return;
    }
    const success = login(email.trim());
    if (success) {
      navigate('home');
    }
  };

  const handleQuickDemoCustomer = () => {
    login('sarah.reader@example.com', 'customer');
    navigate('home');
  };

  const handleQuickDemoAdmin = () => {
    login('admin@booknest.com', 'admin');
    navigate('admin-dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-lg">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/20">
            <BookOpen className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
            Welcome Back to BookNest
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access your reader profile, wishlist, and past orders
          </p>
        </div>

        {/* Quick Demo Credentials Buttons */}
        <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200/80 dark:border-blue-900">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-blue-900 dark:text-blue-200 mb-2">
            One-Click Instant Demo Login:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickDemoCustomer}
              className="py-2 px-2.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="py-2 px-2.5 bg-purple-600 text-white hover:bg-purple-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => addToast('Password reset link sent to registered email', 'info')}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-blue-600 accent-blue-600"
              />
              <span>Keep me signed in</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-colors"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('register')}
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};
