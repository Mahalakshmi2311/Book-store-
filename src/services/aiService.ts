import { Book } from '../types';

export interface AIRecommendationResponse {
  message: string;
  recommendedBookIds: string[];
  highlightReason: string;
  suggestedFollowUps: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendedBooks?: Book[];
  highlightReason?: string;
  suggestedFollowUps?: string[];
  timestamp: string;
}

export async function getAIRecommendations(
  prompt: string,
  catalogBooks: Book[],
  conversationHistory: { role: string; content: string }[] = [],
  context: Record<string, any> = {}
): Promise<AIRecommendationResponse> {
  try {
    const response = await fetch('/api/ai/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        catalogBooks,
        conversationHistory,
        context,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server responded with ${response.status}`);
    }

    const data: AIRecommendationResponse = await response.json();
    return data;
  } catch (error: any) {
    console.warn('AI API call encountered an issue, generating smart catalog recommendation fallback:', error);
    // Intelligent local fallback grounded in actual catalogBooks
    return generateLocalFallbackRecommendation(prompt, catalogBooks);
  }
}

/**
 * High-quality deterministic catalog matcher fallback to ensure 100% reliability
 * even if offline or if network limits are encountered.
 */
function generateLocalFallbackRecommendation(
  prompt: string,
  catalogBooks: Book[]
): AIRecommendationResponse {
  const query = prompt.toLowerCase();

  let matchedBooks: Book[] = [];
  let reason = 'Curated Recommendations from Our Catalog';

  // Check budget intent
  if (query.includes('budget') || query.includes('under 20') || query.includes('cheap') || query.includes('affordable')) {
    matchedBooks = catalogBooks
      .filter((b) => (b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price) <= 20)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
    reason = 'Best High-Rated Books Under $20';
  }
  // Check student / beginner intent
  else if (query.includes('student') || query.includes('beginner') || query.includes('academic')) {
    matchedBooks = catalogBooks
      .filter((b) => b.category === 'Academic' || b.category === 'Self-Help')
      .slice(0, 3);
    reason = 'Ideal Foundations for Students & Beginners';
  }
  // Check professional / tech intent
  else if (query.includes('professional') || query.includes('tech') || query.includes('engineer') || query.includes('code')) {
    matchedBooks = catalogBooks
      .filter((b) => b.category === 'Technology')
      .slice(0, 3);
    reason = 'Essential Reading for Software Professionals';
  }
  // Check bestsellers / trending
  else if (query.includes('trending') || query.includes('bestseller') || query.includes('popular')) {
    matchedBooks = catalogBooks
      .filter((b) => b.bestSeller || b.rating >= 4.8)
      .slice(0, 3);
    reason = 'All-Time Reader Favorites & Bestsellers';
  }
  // Category match
  else {
    const matchedCategory = catalogBooks.find((b) =>
      query.includes(b.category.toLowerCase())
    )?.category;

    if (matchedCategory) {
      matchedBooks = catalogBooks.filter((b) => b.category === matchedCategory).slice(0, 3);
      reason = `Top Handpicked Titles in ${matchedCategory}`;
    } else {
      // General keywords or author match
      matchedBooks = catalogBooks
        .filter(
          (b) =>
            query.includes(b.author.toLowerCase()) ||
            b.title.toLowerCase().includes(query) ||
            b.description.toLowerCase().includes(query)
        )
        .slice(0, 3);

      if (matchedBooks.length === 0) {
        matchedBooks = catalogBooks.filter((b) => b.featured).slice(0, 3);
      }
    }
  }

  const bookTitles = matchedBooks.map((b) => `"${b.title}" by ${b.author}`).join(', ');

  return {
    message: `Based on your request, I strongly recommend exploring ${bookTitles}. Each of these books offers exceptional depth, stellar reviews from our reader community, and immediate availability.`,
    recommendedBookIds: matchedBooks.map((b) => b.id),
    highlightReason: reason,
    suggestedFollowUps: [
      'What are your top books under $20?',
      'Show best-selling fiction titles',
      'Recommend technology books for professionals',
    ],
  };
}
