import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Code, ExternalLink, ArrowLeft, Eye, Tag } from 'lucide-react';
import { useData } from '../context/DataContext';

const CodingQuestionsPage: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const { contests, questions, visitedQuestions, markQuestionAsVisited } = useData();
  
  const contest = contests.find(c => c.id === parseInt(contestId || '0'));
  const contestQuestions = questions.filter(q => q.contestId === parseInt(contestId || '0'));

  if (!contest) {
    return <Navigate to="/" replace />;
  }

  const handleSolveQuestion = (question: typeof contestQuestions[0]) => {
    markQuestionAsVisited(question.id);
    window.open(question.link, '_blank', 'noopener,noreferrer');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to={`/subject/${contest.subjectId}/coding-questions`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Contests
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {contest.title} - Coding Questions
          </h1>
          <p className="text-gray-600">
            Practice coding problems and improve your programming skills
          </p>
        </div>

        <div className="grid gap-6">
          {contestQuestions.map((question) => {
            const isVisited = visitedQuestions.includes(question.id);
            
            return (
              <div
                key={question.id}
                className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                  isVisited ? 'border-l-4 border-green-500' : ''
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="w-5 h-5 text-blue-600" />
                      <h3 className="text-xl font-semibold text-gray-800">
                        {question.title}
                      </h3>
                      {isVisited && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">Visited</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {question.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        {question.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleSolveQuestion(question)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Solve Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {contestQuestions.length === 0 && (
          <div className="text-center py-12">
            <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No coding questions available
            </h3>
            <p className="text-gray-500 mb-4">
              This contest doesn't have any coding questions yet. Check back later or contact an administrator.
            </p>
            <Link
              to={`/subject/${contest.subjectId}/coding-questions`}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingQuestionsPage;