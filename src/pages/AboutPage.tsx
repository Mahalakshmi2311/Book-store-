import React from 'react';
import { BookOpen, Award, Users, Heart, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="flex flex-col gap-16 py-10">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          The Story of BookNest
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white max-w-3xl mx-auto leading-tight mb-4">
          Dedicated to the Art of Good Books &amp; Lifelong Learning
        </h1>
        <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Founded by passionate bibliophiles and former university professors, BookNest bridges timeless literary classics with contemporary breakthroughs in technology, science, and personal transformation.
        </p>
      </section>

      {/* Visual story banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[21/9] max-h-[420px] bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1507842229451-79b1be886a20?auto=format&fit=crop&w=1600&q=80"
            alt="Bookstore interior with majestic shelves"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-8 sm:p-12">
            <div className="text-white max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1 block">
                Our Origin
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                From a Small Campus Reading Room to a Nationwide Community.
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of BookNest */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Our Core Principles
          </h2>
          <p className="text-xs text-slate-500">
            What guides our hand as we pick every title on our shelves
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white mb-2">
              Uncompromising Quality
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We stock authentic editions with archival bindings, durable dust covers, and clean typography that stands the test of time.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white mb-2">
              Expert Editorial Curation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              No algorithmic junk cluttering your discovery. Our 8 categories are selected by literary scholars and veteran engineers.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white mb-2">
              Vibrant Reader Community
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Real reviews, thoughtful reader discussions, author interviews, and seasonal reading challenges for bibliophiles of all ages.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white mb-2">
              Reader-First Service
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Free shipping over $35, protective bubble-mailers for every single shipment, and a no-questions-asked 30-day return policy.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Meet the Curators
          </h2>
          <p className="text-xs text-slate-500">
            The literary minds behind our monthly recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
              alt="Elena Rostova"
              className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-blue-600"
            />
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
              Elena Rostova
            </h3>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2">
              Editor-in-Chief &amp; Fiction Lead
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Former comparative literature fellow at Stanford with a passion for magical realism and speculative fiction.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80"
              alt="Marcus Chen"
              className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-blue-600"
            />
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
              Marcus Chen
            </h3>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2">
              Technology &amp; Academic Director
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Distributed systems architect and writer with 15 years evaluating algorithms and systems literature.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80"
              alt="Amina Al-Mansoor"
              className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-blue-600"
            />
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
              Amina Al-Mansoor
            </h3>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2">
              Children's &amp; Memoir Specialist
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Early childhood educator passionate about illustrated classics that ignite young imaginations and moral courage.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
            Come Browse Our Complete Catalog
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-6">
            Find your next unforgettable story or transformative textbook today.
          </p>
          <button
            type="button"
            onClick={() => navigate('books')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-2"
          >
            <span>Explore 64+ Titles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
