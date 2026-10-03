import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShoppingBag,
  ExternalLink,
  RotateCcw,
  Check,
  ChevronRight,
  TrendingUp,
  Tag,
  GraduationCap,
  Briefcase,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Book } from '../../types';
import { ChatMessage, getAIRecommendations } from '../../services/aiService';
import { RatingStars } from '../common/RatingStars';

export const AIAssistantModal: React.FC = () => {
  const {
    isAIAssistantOpen,
    closeAIAssistant,
    aiInitialPrompt,
    books,
    addToCart,
    navigate,
    addToast,
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        "Hello! I'm **Nestor**, your AI Book Recommendation Assistant at BookNest. Tell me about your favorite genres, an author you love, your budget, or your reading goals, and I'll find the perfect match from our 64+ curated bookstore catalog.",
      highlightReason: 'Personalized Book Curation',
      suggestedFollowUps: [
        'Recommend top technology books for software engineers',
        'Show bestsellers under $20',
        'Suggest books similar to Atomic Habits',
        'Best science and academic textbooks for students',
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addedBookId, setAddedBookId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAIAssistantOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 100);
    }
  }, [isAIAssistantOpen]);

  // Handle initial prompt passed from other pages (e.g. "Similar to Klara and the Sun")
  useEffect(() => {
    if (isAIAssistantOpen && aiInitialPrompt) {
      handleSendMessage(aiInitialPrompt);
    }
  }, [isAIAssistantOpen, aiInitialPrompt]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  if (!isAIAssistantOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.slice(-4).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const aiResponse = await getAIRecommendations(query, books, history);

      // Match recommended IDs with actual books from catalog
      const matchedBooks: Book[] = (aiResponse.recommendedBookIds || [])
        .map((id) => books.find((b) => b.id === id))
        .filter((b): b is Book => Boolean(b));

      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: aiResponse.message,
        recommendedBooks: matchedBooks,
        highlightReason: aiResponse.highlightReason,
        suggestedFollowUps: aiResponse.suggestedFollowUps,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ast-err-${Date.now()}`,
          role: 'assistant',
          content:
            "I'm currently reviewing our shelf records. Here are some of our most celebrated bestsellers while I reconnect.",
          recommendedBooks: books.filter((b) => b.bestSeller).slice(0, 3),
          highlightReason: 'Staff Favorite Bestsellers',
          suggestedFollowUps: [
            'Show fiction deals',
            'Find tech books under $30',
            'Recommend history books',
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    addToCart(book, 1, book.format);
    setAddedBookId(book.id);
    setTimeout(() => setAddedBookId(null), 1800);
  };

  const handleViewBook = (bookId: string) => {
    closeAIAssistant();
    navigate('book-details', { id: bookId });
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content:
          "Chat reset! What type of book are you in the mood for today? You can ask about authors, themes, academic disciplines, or price ranges.",
        highlightReason: 'Fresh Recommendations',
        suggestedFollowUps: [
          'Recommend top technology books',
          'Best biographies of leaders',
          'Under $20 budget books',
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Quick preset starters
  const quickStarters = [
    { label: 'Books under $20', icon: Tag, prompt: 'Recommend the best affordable books under $20 in your catalog' },
    { label: 'For Tech Professionals', icon: Briefcase, prompt: 'Recommend top technical and software engineering books for professionals' },
    { label: 'For Students & Beginners', icon: GraduationCap, prompt: 'What are the best academic and learning books for students and beginners?' },
    { label: 'Trending Bestsellers', icon: TrendingUp, prompt: 'What are the top trending bestsellers in your bookstore right now?' },
    { label: 'Books like Atomic Habits', icon: BookOpen, prompt: 'Suggest books similar to Atomic Habits on productivity and psychology' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl h-[88vh] max-h-[720px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base leading-tight">
                  Nestor · Book Assistant
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold tracking-wide uppercase">
                  Gemini AI
                </span>
              </div>
              <p className="text-[11px] text-blue-100">
                Grounded in 64+ authentic BookNest volumes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleResetChat}
              title="Reset conversation"
              className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={closeAIAssistant}
              aria-label="Close assistant"
              className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Starter Chips Bar */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none">
          <span className="text-slate-400 font-semibold uppercase text-[10px] shrink-0">
            Quick Prompts:
          </span>
          {quickStarters.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(item.prompt)}
                className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 rounded-lg shrink-0 font-medium transition-colors shadow-2xs"
              >
                <Icon className="w-3 h-3 text-blue-500 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Conversation Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200/60 dark:border-slate-700'
                }`}
              >
                {/* Assistant match headline */}
                {msg.highlightReason && (
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{msg.highlightReason}</span>
                  </div>
                )}

                <div className="whitespace-pre-line">{msg.content}</div>

                {/* Embedded Interactive Book Cards */}
                {msg.recommendedBooks && msg.recommendedBooks.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-slate-200/80 dark:border-slate-700/80 space-y-2">
                    <span className="block text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                      Recommended Books ({msg.recommendedBooks.length})
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.recommendedBooks.map((book) => {
                        const discountedPrice =
                          book.discount > 0
                            ? book.price * (1 - book.discount / 100)
                            : book.price;
                        const isAdded = addedBookId === book.id;

                        return (
                          <div
                            key={book.id}
                            onClick={() => handleViewBook(book.id)}
                            className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex gap-2.5 items-center group"
                          >
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-11 h-15 object-cover rounded-md shadow-2xs shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase truncate block">
                                {book.category}
                              </span>
                              <h5 className="font-serif font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
                                {book.title}
                              </h5>
                              <p className="text-[10px] text-slate-500 truncate">
                                by {book.author}
                              </p>

                              <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="font-bold text-xs text-slate-900 dark:text-white">
                                  ${discountedPrice.toFixed(2)}
                                </span>
                                {book.discount > 0 && (
                                  <span className="text-[10px] text-slate-400 line-through">
                                    ${book.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleAddToCart(e, book)}
                              title="Add to Cart"
                              className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                                isAdded
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 hover:bg-blue-600 hover:text-white'
                              }`}
                            >
                              {isAdded ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <ShoppingBag className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Follow-up question chips */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/50 dark:border-slate-700/50 flex flex-wrap gap-1.5">
                    <span className="text-[10px] text-slate-400 w-full font-semibold">
                      Explore next:
                    </span>
                    {msg.suggestedFollowUps.map((promptText, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendMessage(promptText)}
                        className="text-[11px] text-left px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 border border-slate-200/70 dark:border-slate-700 transition-colors"
                      >
                        {promptText} &rarr;
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-1 text-[9px] text-slate-400 text-right">
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-xs p-3.5 border border-slate-200/60 dark:border-slate-700 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                <div
                  className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
                  style={{ animationDelay: '0.15s' }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
                  style={{ animationDelay: '0.3s' }}
                />
                <span className="text-xs text-slate-500 font-medium ml-1">
                  Searching BookNest catalog with Gemini...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for recommendations, similar books, author, or budget..."
              className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors disabled:opacity-40 flex items-center gap-1.5"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
            <span>Powered by Gemini 2.5 Flash · Real-time catalog search</span>
            <span>Direct cart addition enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};
