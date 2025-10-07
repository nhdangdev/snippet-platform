export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Snippet {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  topics: string[];
  complexity?: string; // O(n), O(n²), etc.
  authorId: string;
  author?: User;
  isPublic: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  type: 'language' | 'topic';
  count: number;
}

// Create/Update types
export type CreateSnippetInput = Omit<Snippet, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'author'>;
export type UpdateSnippetInput = Partial<CreateSnippetInput> & { id: string };

export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserInput = Partial<Omit<User, 'id' | 'email' | 'password' | 'createdAt' | 'updatedAt'>> & { id: string };
