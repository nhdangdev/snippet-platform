import { User, Snippet, Tag } from './types';
import bcrypt from 'bcryptjs';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password',
    bio: 'Full-stack developer passionate about clean code',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'password',
    bio: 'Frontend developer | React enthusiast',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

// Mock Snippets
export const mockSnippets: Snippet[] = [
  {
    id: '1',
    title: 'Binary Search Implementation',
    description: 'Classic binary search algorithm in JavaScript',
    code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    }
    
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
    language: 'javascript',
    topics: ['algorithm', 'search'],
    complexity: 'O(log n)',
    authorId: '1',
    isPublic: true,
    views: 42,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    title: 'Fibonacci Sequence',
    description: 'Generate Fibonacci sequence using dynamic programming',
    code: `def fibonacci(n):
    if n <= 1:
        return n
    
    fib = [0, 1]
    for i in range(2, n + 1):
        fib.append(fib[i-1] + fib[i-2])
    
    return fib[n]

# Example usage
print(fibonacci(10))  # Output: 55`,
    language: 'python',
    topics: ['algorithm', 'dynamic-programming'],
    complexity: 'O(n)',
    authorId: '2',
    isPublic: true,
    views: 156,
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
  },
  {
    id: '3',
    title: 'Quick Sort Algorithm',
    description: 'Efficient sorting algorithm using divide and conquer',
    code: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// Example
console.log(quickSort([3, 6, 8, 10, 1, 2, 1]));`,
    language: 'javascript',
    topics: ['algorithm', 'sorting'],
    complexity: 'O(n log n)',
    authorId: '1',
    isPublic: true,
    views: 89,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '4',
    title: 'React Custom Hook - useLocalStorage',
    description: 'Custom hook for persisting state in localStorage',
    code: `import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;`,
    language: 'javascript',
    topics: ['react', 'hooks', 'web-dev'],
    complexity: 'O(1)',
    authorId: '2',
    isPublic: true,
    views: 234,
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
  },
  {
    id: '5',
    title: 'Merge Two Sorted Arrays',
    description: 'Merge two sorted arrays efficiently',
    code: `public static int[] mergeSortedArrays(int[] arr1, int[] arr2) {
    int[] result = new int[arr1.length + arr2.length];
    int i = 0, j = 0, k = 0;
    
    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] <= arr2[j]) {
            result[k++] = arr1[i++];
        } else {
            result[k++] = arr2[j++];
        }
    }
    
    while (i < arr1.length) result[k++] = arr1[i++];
    while (j < arr2.length) result[k++] = arr2[j++];
    
    return result;
}`,
    language: 'java',
    topics: ['algorithm', 'array'],
    complexity: 'O(n + m)',
    authorId: '1',
    isPublic: true,
    views: 67,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
];

// Mock Tags
export const mockTags: Tag[] = [
  // Languages
  { id: '1', name: 'JavaScript', slug: 'javascript', type: 'language', count: 3 },
  { id: '2', name: 'Python', slug: 'python', type: 'language', count: 1 },
  { id: '3', name: 'Java', slug: 'java', type: 'language', count: 1 },
  { id: '4', name: 'TypeScript', slug: 'typescript', type: 'language', count: 0 },
  { id: '5', name: 'C++', slug: 'cpp', type: 'language', count: 0 },

  // Topics
  { id: '10', name: 'Algorithm', slug: 'algorithm', type: 'topic', count: 4 },
  { id: '11', name: 'Data Structure', slug: 'data-structure', type: 'topic', count: 0 },
  { id: '12', name: 'Sorting', slug: 'sorting', type: 'topic', count: 1 },
  { id: '13', name: 'Search', slug: 'search', type: 'topic', count: 1 },
  { id: '14', name: 'Dynamic Programming', slug: 'dynamic-programming', type: 'topic', count: 1 },
  { id: '15', name: 'React', slug: 'react', type: 'topic', count: 1 },
  { id: '16', name: 'Hooks', slug: 'hooks', type: 'topic', count: 1 },
  { id: '17', name: 'Web Dev', slug: 'web-dev', type: 'topic', count: 1 },
  { id: '18', name: 'Array', slug: 'array', type: 'topic', count: 1 },
];
