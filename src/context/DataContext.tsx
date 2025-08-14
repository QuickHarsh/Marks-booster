import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Subject, Contest, Question, Quiz, QuizProgress } from '../types';
import { getFromStorage, saveToStorage, initializeStorage } from '../utils/localStorage';

interface DataContextType {
  subjects: Subject[];
  contests: Contest[];
  questions: Question[];
  quizzes: Quiz[];
  visitedQuestions: number[];
  quizProgress: QuizProgress[];
  
  // Subject methods
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: number, subject: Omit<Subject, 'id'>) => void;
  deleteSubject: (id: number) => void;
  
  // Contest methods
  addContest: (contest: Omit<Contest, 'id'>) => void;
  updateContest: (id: number, contest: Omit<Contest, 'id'>) => void;
  deleteContest: (id: number) => void;
  
  // Question methods
  addQuestion: (question: Omit<Question, 'id'>) => void;
  updateQuestion: (id: number, question: Omit<Question, 'id'>) => void;
  deleteQuestion: (id: number) => void;
  markQuestionAsVisited: (id: number) => void;
  
  // Quiz methods
  addQuiz: (quiz: Omit<Quiz, 'id'>) => void;
  updateQuiz: (id: number, quiz: Omit<Quiz, 'id'>) => void;
  deleteQuiz: (id: number) => void;
  saveQuizProgress: (progress: QuizProgress) => void;
  
  // Utility methods
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [visitedQuestions, setVisitedQuestions] = useState<number[]>([]);
  const [quizProgress, setQuizProgress] = useState<QuizProgress[]>([]);

  const loadData = () => {
    setSubjects(getFromStorage<Subject>('subjects'));
    setContests(getFromStorage<Contest>('contests'));
    setQuestions(getFromStorage<Question>('questions'));
    setQuizzes(getFromStorage<Quiz>('quizzes'));
    setVisitedQuestions(getFromStorage<number>('visitedQuestions'));
    setQuizProgress(getFromStorage<QuizProgress>('quizProgress'));
  };

  useEffect(() => {
    initializeStorage();
    loadData();
  }, []);

  const getNextId = (items: { id: number }[]) => {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  };

  // Subject methods
  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject = { ...subject, id: getNextId(subjects) };
    const updatedSubjects = [...subjects, newSubject];
    setSubjects(updatedSubjects);
    saveToStorage('subjects', updatedSubjects);
  };

  const updateSubject = (id: number, subject: Omit<Subject, 'id'>) => {
    const updatedSubjects = subjects.map(s => s.id === id ? { ...s, ...subject } : s);
    setSubjects(updatedSubjects);
    saveToStorage('subjects', updatedSubjects);
  };

  const deleteSubject = (id: number) => {
    const updatedSubjects = subjects.filter(s => s.id !== id);
    const updatedContests = contests.filter(c => c.subjectId !== id);
    const contestIds = contests.filter(c => c.subjectId === id).map(c => c.id);
    const updatedQuestions = questions.filter(q => !contestIds.includes(q.contestId));
    const updatedQuizzes = quizzes.filter(q => !contestIds.includes(q.contestId));
    
    setSubjects(updatedSubjects);
    setContests(updatedContests);
    setQuestions(updatedQuestions);
    setQuizzes(updatedQuizzes);
    
    saveToStorage('subjects', updatedSubjects);
    saveToStorage('contests', updatedContests);
    saveToStorage('questions', updatedQuestions);
    saveToStorage('quizzes', updatedQuizzes);
  };

  // Contest methods
  const addContest = (contest: Omit<Contest, 'id'>) => {
    const newContest = { ...contest, id: getNextId(contests) };
    const updatedContests = [...contests, newContest];
    setContests(updatedContests);
    saveToStorage('contests', updatedContests);
  };

  const updateContest = (id: number, contest: Omit<Contest, 'id'>) => {
    const updatedContests = contests.map(c => c.id === id ? { ...c, ...contest } : c);
    setContests(updatedContests);
    saveToStorage('contests', updatedContests);
  };

  const deleteContest = (id: number) => {
    const updatedContests = contests.filter(c => c.id !== id);
    const updatedQuestions = questions.filter(q => q.contestId !== id);
    const updatedQuizzes = quizzes.filter(q => q.contestId !== id);
    
    setContests(updatedContests);
    setQuestions(updatedQuestions);
    setQuizzes(updatedQuizzes);
    
    saveToStorage('contests', updatedContests);
    saveToStorage('questions', updatedQuestions);
    saveToStorage('quizzes', updatedQuizzes);
  };

  // Question methods
  const addQuestion = (question: Omit<Question, 'id'>) => {
    const newQuestion = { ...question, id: getNextId(questions) };
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    saveToStorage('questions', updatedQuestions);
  };

  const updateQuestion = (id: number, question: Omit<Question, 'id'>) => {
    const updatedQuestions = questions.map(q => q.id === id ? { ...q, ...question } : q);
    setQuestions(updatedQuestions);
    saveToStorage('questions', updatedQuestions);
  };

  const deleteQuestion = (id: number) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    saveToStorage('questions', updatedQuestions);
  };

  const markQuestionAsVisited = (id: number) => {
    if (!visitedQuestions.includes(id)) {
      const updatedVisited = [...visitedQuestions, id];
      setVisitedQuestions(updatedVisited);
      saveToStorage('visitedQuestions', updatedVisited);
    }
  };

  // Quiz methods
  const addQuiz = (quiz: Omit<Quiz, 'id'>) => {
    const newQuiz = { ...quiz, id: getNextId(quizzes) };
    const updatedQuizzes = [...quizzes, newQuiz];
    setQuizzes(updatedQuizzes);
    saveToStorage('quizzes', updatedQuizzes);
  };

  const updateQuiz = (id: number, quiz: Omit<Quiz, 'id'>) => {
    const updatedQuizzes = quizzes.map(q => q.id === id ? { ...q, ...quiz } : q);
    setQuizzes(updatedQuizzes);
    saveToStorage('quizzes', updatedQuizzes);
  };

  const deleteQuiz = (id: number) => {
    const updatedQuizzes = quizzes.filter(q => q.id !== id);
    setQuizzes(updatedQuizzes);
    saveToStorage('quizzes', updatedQuizzes);
  };

  const saveQuizProgress = (progress: QuizProgress) => {
    const existingIndex = quizProgress.findIndex(p => p.quizId === progress.quizId);
    let updatedProgress;
    
    if (existingIndex >= 0) {
      updatedProgress = [...quizProgress];
      updatedProgress[existingIndex] = progress;
    } else {
      updatedProgress = [...quizProgress, progress];
    }
    
    setQuizProgress(updatedProgress);
    saveToStorage('quizProgress', updatedProgress);
  };

  const refreshData = () => {
    loadData();
  };

  const value: DataContextType = {
    subjects,
    contests,
    questions,
    quizzes,
    visitedQuestions,
    quizProgress,
    addSubject,
    updateSubject,
    deleteSubject,
    addContest,
    updateContest,
    deleteContest,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    markQuestionAsVisited,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    saveQuizProgress,
    refreshData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};