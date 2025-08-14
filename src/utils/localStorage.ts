import { Subject, Contest, Question, Quiz, QuizProgress } from '../types';

const STORAGE_KEYS = {
  subjects: 'subjects',
  contests: 'contests',
  questions: 'questions',
  quizzes: 'quizzes',
  visitedQuestions: 'visitedQuestions',
  quizProgress: 'quizProgress'
};

// Default data to load if localStorage is empty
const DEFAULT_DATA = {
  subjects: [
    { id: 1, name: "PSP" },
    { id: 2, name: "S&W" },
    { id: 3, name: "Maths" }
  ] as Subject[],
  
  contests: [
    { id: 1, subjectId: 1, title: "Contest 1" },
    { id: 2, subjectId: 1, title: "Midsem" },
    { id: 3, subjectId: 2, title: "Security Basics" },
    { id: 4, subjectId: 3, title: "Calculus Contest" }
  ] as Contest[],
  
  questions: [
    {
      id: 1,
      contestId: 1,
      title: "Fibonacci Series",
      description: "Write a program to print the first n Fibonacci numbers using both iterative and recursive approaches.",
      tags: ["loops", "recursion"],
      difficulty: "Easy" as const,
      link: "https://college-playground.com/fibonacci"
    },
    {
      id: 2,
      contestId: 1,
      title: "Binary Search",
      description: "Implement binary search algorithm to find an element in a sorted array.",
      tags: ["arrays", "searching"],
      difficulty: "Medium" as const,
      link: "https://college-playground.com/binary-search"
    },
    {
      id: 3,
      contestId: 2,
      title: "Dynamic Programming",
      description: "Solve the classic coin change problem using dynamic programming.",
      tags: ["dp", "algorithms"],
      difficulty: "Hard" as const,
      link: "https://college-playground.com/coin-change"
    }
  ] as Question[],
  
  quizzes: [
    {
      id: 1,
      contestId: 1,
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: "O(log n)"
    },
    {
      id: 2,
      contestId: 3,
      question: "Which of the following is a symmetric encryption algorithm?",
      options: ["RSA", "AES", "ECC", "DSA"],
      correctAnswer: "AES"
    }
  ] as Quiz[],
  
  visitedQuestions: [] as number[],
  quizProgress: [] as QuizProgress[]
};

export const getFromStorage = <T>(key: keyof typeof STORAGE_KEYS): T[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS[key]);
    return data ? JSON.parse(data) : DEFAULT_DATA[key];
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return DEFAULT_DATA[key];
  }
};

export const saveToStorage = <T>(key: keyof typeof STORAGE_KEYS, data: T[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const initializeStorage = (): void => {
  Object.keys(STORAGE_KEYS).forEach(key => {
    const storageKey = key as keyof typeof STORAGE_KEYS;
    if (!localStorage.getItem(STORAGE_KEYS[storageKey])) {
      saveToStorage(storageKey, DEFAULT_DATA[storageKey]);
    }
  });
};

export const exportAllData = (): string => {
  const allData = {
    subjects: getFromStorage<Subject>('subjects'),
    contests: getFromStorage<Contest>('contests'),
    questions: getFromStorage<Question>('questions'),
    quizzes: getFromStorage<Quiz>('quizzes'),
    visitedQuestions: getFromStorage<number>('visitedQuestions'),
    quizProgress: getFromStorage<QuizProgress>('quizProgress')
  };
  return JSON.stringify(allData, null, 2);
};

export const importAllData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    Object.keys(STORAGE_KEYS).forEach(key => {
      const storageKey = key as keyof typeof STORAGE_KEYS;
      if (data[storageKey]) {
        saveToStorage(storageKey, data[storageKey]);
      }
    });
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};