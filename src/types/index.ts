export interface Subject {
  id: number;
  name: string;
}

export interface Contest {
  id: number;
  subjectId: number;
  title: string;
}

export interface Question {
  id: number;
  contestId: number;
  title: string;
  description: string;
  tags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  link: string;
}

export interface Quiz {
  id: number;
  contestId: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizProgress {
  quizId: number;
  selectedOption: string;
  isCorrect: boolean;
}