import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import HomePage from './components/HomePage';
import SubjectPage from './components/SubjectPage';
import ContestsPage from './components/ContestsPage';
import CodingQuestionsPage from './components/CodingQuestionsPage';
import QuizzesPage from './components/QuizzesPage';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/subject/:subjectId" element={<SubjectPage />} />
            <Route 
              path="/subject/:subjectId/coding-questions" 
              element={<ContestsPage type="coding-questions" />} 
            />
            <Route 
              path="/subject/:subjectId/quizzes" 
              element={<ContestsPage type="quizzes" />} 
            />
            <Route path="/contest/:contestId/coding-questions" element={<CodingQuestionsPage />} />
            <Route path="/contest/:contestId/quizzes" element={<QuizzesPage />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;