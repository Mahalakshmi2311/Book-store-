import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface BookSummary {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  discount: number;
  rating: number;
  description: string;
  stockStatus: string;
  bestSeller?: boolean;
  featured?: boolean;
}

// AI Recommendation Route
app.post('/api/ai/recommend', async (req, res) => {
  try {
    const {
      prompt,
      catalogBooks = [],
      conversationHistory = [],
      context = {},
    } = req.body;

    if (!prompt && (!conversationHistory || conversationHistory.length === 0)) {
      return res.status(400).json({ error: 'Prompt or conversation is required' });
    }

    // Format concise catalog summary for Gemini grounding
    const catalogDigest = (catalogBooks as BookSummary[]).map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      category: b.category,
      price: `$${(b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price).toFixed(2)}`,
      origPrice: b.discount > 0 ? `$${b.price.toFixed(2)}` : undefined,
      discount: b.discount > 0 ? `${b.discount}% off` : '0%',
      rating: `${b.rating}★`,
      stock: b.stockStatus,
      description: b.description,
      bestSeller: b.bestSeller,
      featured: b.featured,
    }));

    const systemInstruction = `You are "Nestor", the passionate, knowledgeable, and friendly AI Book Recommendation Assistant at BookNest online bookstore.
Your mission is to provide personalized, helpful book guidance, answers, and curated reading recommendations.

IMPORTANT RULES:
1. Always ground your recommendations in the BookNest Bookstore catalog provided below.
2. Select matching books from the catalog and include their exact 'id' in the 'recommendedBookIds' array.
3. If the user asks about:
   - Specific genres/categories (Fiction, Non-Fiction, Academic, Technology, Children's Books, Biography, History, Self-Help): recommend the strongest matches from that shelf.
   - Specific authors: match any titles by that author or authors with similar thematic styles.
   - Budget constraints (e.g. under $15, under $20, bargains): highlight discounted or affordable titles from the catalog.
   - Reader level (beginners, students, professionals): tailor your advice (e.g., beginner-friendly guides vs. in-depth textbooks like Cormen Algorithms or Kandel Neuroscience).
   - Similar books: explain why fans of Book X will enjoy Book Y.
   - Trending or bestsellers: highlight titles marked bestSeller or featured.
4. Keep your conversational response warm, clear, and engaging. Mention what makes each suggested title special in 1-2 compelling sentences.
5. In addition to your explanation, return 1 to 4 matching 'recommendedBookIds' that exist in the catalog so the app can display interactive book cards.
6. Provide 2-3 quick relevant follow-up questions or prompts in 'suggestedFollowUps' to help the reader explore further.

CURRENT BOOKNEST CATALOG:
${JSON.stringify(catalogDigest, null, 1)}

CONTEXT:
${JSON.stringify(context || {})}`;

    // Structure of expected JSON response
    const schema = {
      type: Type.OBJECT,
      properties: {
        message: {
          type: Type.STRING,
          description:
            'Friendly, well-written conversational advice explaining why these books match the user prompt.',
        },
        recommendedBookIds: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            'Array of exact book IDs from the provided catalog that match the recommendation.',
        },
        highlightReason: {
          type: Type.STRING,
          description:
            'A short 1-line headline summarizing the match theme, e.g. "Top Picks For Distributed Systems Engineers" or "Cozy Escapist Fiction".',
        },
        suggestedFollowUps: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '2 to 3 short follow-up questions the user might want to ask next.',
        },
      },
      required: ['message', 'recommendedBookIds', 'highlightReason', 'suggestedFollowUps'],
    };

    // Format chat history if provided
    const userMessageContent = prompt || (conversationHistory.length > 0 ? conversationHistory[conversationHistory.length - 1].content : 'Recommend popular books');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userMessageContent,
      config: {
        systemInstruction,
        temperature: 0.6,
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    const rawText = response.text?.trim() || '{}';
    let parsedResult;
    try {
      parsedResult = JSON.parse(rawText);
    } catch (e) {
      parsedResult = {
        message: rawText,
        recommendedBookIds: [],
        highlightReason: 'Recommendations for You',
        suggestedFollowUps: ['Show bestsellers', 'Recommend books under $20', 'Top tech books'],
      };
    }

    res.json(parsedResult);
  } catch (err: any) {
    console.error('Error generating AI recommendation:', err);
    res.status(500).json({
      error: 'Failed to generate recommendations from AI assistant.',
      details: err?.message || 'Unknown error',
    });
  }
});

// Configure Vite in dev mode or static serve in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BookNest server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
