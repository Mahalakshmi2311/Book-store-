import { CategoryInfo } from '../types';

export const INITIAL_CATEGORIES: CategoryInfo[] = [
  {
    id: 'cat-fiction',
    name: 'Fiction',
    slug: 'fiction',
    description: 'Immerse yourself in captivating narratives, classic literature, sci-fi sagas, and modern storytelling.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    iconName: 'BookOpen'
  },
  {
    id: 'cat-non-fiction',
    name: 'Non-Fiction',
    slug: 'non-fiction',
    description: 'Deep dives into real-world insights, investigative journalism, philosophy, economics, and human culture.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    iconName: 'Compass'
  },
  {
    id: 'cat-academic',
    name: 'Academic',
    slug: 'academic',
    description: 'Rigorous textbooks, research guides, scientific treatises, and foundational scholarly curricula.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    iconName: 'GraduationCap'
  },
  {
    id: 'cat-technology',
    name: 'Technology',
    slug: 'technology',
    description: 'Software engineering, artificial intelligence, cybersecurity, cloud architecture, and modern coding mastery.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    iconName: 'Cpu'
  },
  {
    id: 'cat-children',
    name: "Children's Books",
    slug: 'childrens-books',
    description: 'Delightful storybooks, illustrated adventures, fables, and early-learning classics for young curious minds.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    iconName: 'Sparkles'
  },
  {
    id: 'cat-biography',
    name: 'Biography',
    slug: 'biography',
    description: 'Inspiring life stories, memoirs, and historic chronicles of visionary leaders, creators, and innovators.',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
    iconName: 'User'
  },
  {
    id: 'cat-history',
    name: 'History',
    slug: 'history',
    description: 'Uncover ancient civilizations, epochal world events, diplomatic intrigues, and cultural evolutions.',
    image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
    iconName: 'Hourglass'
  },
  {
    id: 'cat-self-help',
    name: 'Self-Help',
    slug: 'self-help',
    description: 'Actionable wisdom on productivity, habit transformation, emotional intelligence, and purposeful living.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    iconName: 'HeartHandshake'
  }
];
