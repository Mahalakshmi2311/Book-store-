import React from 'react';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CategoriesPage: React.FC = () => {
  const { categories, books, navigate } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Layers className="w-3.5 h-3.5" />
          Themed Shelves
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
          Explore Our 8 Signature Book Categories
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          From groundbreaking computer science treatises to enchanting bedtime stories, immerse yourself in carefully curated literary categories.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => {
          const categoryBooks = books.filter((b) => b.category === cat.name);
          const topAuthors = Array.from(new Set(categoryBooks.map((b) => b.author))).slice(0, 3);

          return (
            <div
              key={cat.id}
              onClick={() => navigate('books', { category: cat.name })}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Category banner image */}
              <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                      Shelf
                    </span>
                    <h3 className="font-serif text-xl font-bold leading-tight">
                      {cat.name}
                    </h3>
                  </div>
                  <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold">
                    {categoryBooks.length} Books
                  </span>
                </div>
              </div>

              {/* Description & metadata */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  <div className="mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Featured Authors
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 truncate">
                      {topAuthors.join(' · ') || 'Various master authors'}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Browse {cat.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
