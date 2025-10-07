export const runtime = "nodejs";

import { User, Snippet, Tag, CreateSnippetInput } from './types';
import fs from 'fs';
import path from 'path';

// Paths to JSON files
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SNIPPETS_FILE = path.join(DATA_DIR, 'snippets.json');
const TAGS_FILE = path.join(DATA_DIR, 'tags.json');

// Helper to ensure data directory exists
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

// Helper to read JSON file
const readJSON = <T>(filePath: string, defaultValue: T): T => {
  try {
    ensureDataDir();
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultValue;
  }
};

// Helper to write JSON file
const writeJSON = <T>(filePath: string, data: T): void => {
  try {
    ensureDataDir();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
};

// Helper to parse dates
const parseSnippet = (snippet: any): Snippet => ({
  ...snippet,
  createdAt: new Date(snippet.createdAt),
  updatedAt: new Date(snippet.updatedAt),
});

const parseUser = (user: any): User => ({
  ...user,
  createdAt: new Date(user.createdAt),
  updatedAt: new Date(user.updatedAt),
});

// Helper to generate ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// ============= DATABASE OPERATIONS =============

export const db = {
  // USER
  user: {
    findByEmail: async (email: string): Promise<User | null> => {
      const users = readJSON<any[]>(USERS_FILE, []);
      const user = users.find(u => u.email === email);
      return user ? parseUser(user) : null;
    },

    findById: async (id: string): Promise<User | null> => {
      const users = readJSON<any[]>(USERS_FILE, []);
      const user = users.find(u => u.id === id);
      return user ? parseUser(user) : null;
    },

    create: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
      const users = readJSON<any[]>(USERS_FILE, []);
      const newUser: User = {
        ...data,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.push(newUser);
      writeJSON(USERS_FILE, users);
      return newUser;
    },

    update: async (id: string, data: Partial<User>): Promise<User | null> => {
      const users = readJSON<any[]>(USERS_FILE, []);
      const index = users.findIndex(u => u.id === id);
      if (index === -1) return null;

      users[index] = {
        ...users[index],
        ...data,
        updatedAt: new Date(),
      };
      writeJSON(USERS_FILE, users);
      return parseUser(users[index]);
    },
  },

  // SNIPPET
  snippet: {
    findAll: async (filters?: {
      language?: string;
      topic?: string;
      authorId?: string;
      search?: string;
    }): Promise<Snippet[]> => {
      let snippets = readJSON<any[]>(SNIPPETS_FILE, []).map(parseSnippet);
      const users = readJSON<any[]>(USERS_FILE, []);

      if (filters?.language) {
        snippets = snippets.filter(s => s.language.toLowerCase() === filters.language?.toLowerCase());
      }

      if (filters?.topic) {
        snippets = snippets.filter(s => s.topics.includes(filters.topic!));
      }

      if (filters?.authorId) {
        snippets = snippets.filter(s => s.authorId === filters.authorId);
      }

      if (filters?.search) {
        const search = filters.search.toLowerCase();
        snippets = snippets.filter(s =>
          s.title.toLowerCase().includes(search) ||
          s.description?.toLowerCase().includes(search) ||
          s.code.toLowerCase().includes(search)
        );
      }

      // Sort by createdAt desc
      snippets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      // Attach author info
      return snippets.map(snippet => ({
        ...snippet,
        author: users.find(u => u.id === snippet.authorId),
      }));
    },

    findById: async (id: string): Promise<Snippet | null> => {
      const snippets = readJSON<any[]>(SNIPPETS_FILE, []);
      const users = readJSON<any[]>(USERS_FILE, []);
      const index = snippets.findIndex(s => s.id === id);
      
      if (index === -1) return null;

      // Increment views
      snippets[index].views = (snippets[index].views || 0) + 1;
      writeJSON(SNIPPETS_FILE, snippets);

      const snippet = parseSnippet(snippets[index]);
      return {
        ...snippet,
        author: users.find(u => u.id === snippet.authorId),
      };
    },

    create: async (data: CreateSnippetInput): Promise<Snippet> => {
      const snippets = readJSON<any[]>(SNIPPETS_FILE, []);
      const newSnippet: Snippet = {
        ...data,
        id: generateId(),
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      snippets.push(newSnippet);
      writeJSON(SNIPPETS_FILE, snippets);
      updateTagCounts();
      return newSnippet;
    },

    update: async (id: string, data: Partial<CreateSnippetInput>): Promise<Snippet | null> => {
      const snippets = readJSON<any[]>(SNIPPETS_FILE, []);
      const index = snippets.findIndex(s => s.id === id);
      if (index === -1) return null;

      snippets[index] = {
        ...snippets[index],
        ...data,
        updatedAt: new Date(),
      };
      writeJSON(SNIPPETS_FILE, snippets);
      updateTagCounts();
      return parseSnippet(snippets[index]);
    },

    delete: async (id: string): Promise<boolean> => {
      const snippets = readJSON<any[]>(SNIPPETS_FILE, []);
      const index = snippets.findIndex(s => s.id === id);
      if (index === -1) return false;

      snippets.splice(index, 1);
      writeJSON(SNIPPETS_FILE, snippets);
      updateTagCounts();
      return true;
    },
  },

  // TAG
  tag: {
    findAll: async (): Promise<Tag[]> => {
      return readJSON<Tag[]>(TAGS_FILE, []);
    },

    findByType: async (type: 'language' | 'topic'): Promise<Tag[]> => {
      const tags = readJSON<Tag[]>(TAGS_FILE, []);
      return tags.filter(t => t.type === type);
    },

    findBySlug: async (slug: string): Promise<Tag | null> => {
      const tags = readJSON<Tag[]>(TAGS_FILE, []);
      return tags.find(t => t.slug === slug) || null;
    },
  },

  // STATS
  stats: {
    getUserStats: async (userId: string) => {
      const snippets = readJSON<any[]>(SNIPPETS_FILE, []).map(parseSnippet);
      const userSnippets = snippets.filter(s => s.authorId === userId);
      const totalViews = userSnippets.reduce((sum, s) => sum + s.views, 0);
      const languages = [...new Set(userSnippets.map(s => s.language))];

      return {
        totalSnippets: userSnippets.length,
        totalViews,
        languages,
      };
    },

    getGlobalStats: async () => {
      const users = readJSON<any[]>(USERS_FILE, []);
      const snippets = readJSON<any[]>(SNIPPETS_FILE, []);
      return {
        totalUsers: users.length,
        totalSnippets: snippets.length,
        totalViews: snippets.reduce((sum, s) => sum + (s.views || 0), 0),
      };
    },
  },
};

// Helper function to update tag counts
function updateTagCounts() {
  const tags = readJSON<Tag[]>(TAGS_FILE, []);
  const snippets = readJSON<any[]>(SNIPPETS_FILE, []);

  tags.forEach(tag => {
    if (tag.type === 'language') {
      tag.count = snippets.filter(s => s.language.toLowerCase() === tag.slug).length;
    } else {
      tag.count = snippets.filter(s => s.topics && s.topics.includes(tag.slug)).length;
    }
  });

  writeJSON(TAGS_FILE, tags);
}

// Initialize tag counts on load
updateTagCounts();
