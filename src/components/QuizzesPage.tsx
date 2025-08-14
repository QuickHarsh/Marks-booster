import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Brain, ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useData } from '../context/DataContext';

const QuizzesPage: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const { contests, quizzes, quizProgress, saveQuizProgress } = useData();
  
  const contest = contests.find(c => c.id === parseInt(contestId || '0'));
  const contestQuizzes = quizzes.filter(q => q.contestId === parseInt(contestId || '0'));
  
  const [selectedAnswers, setSelectedAnswers] = useState<{ [quizId: number]: string }>({});
  const [showResults, setShowResults] = useState<{ [quizId: number]: boolean }>({});

  if (!contest) {
    return <Navigate to="/" replace />;
  }

  const handleAnswerSelect = (quizId: number, selectedOption: string) => {
    const quiz = contestQuizzes.find(q => q.id === quizId);
    if (!quiz || showResults[quizId]) return;

    setSelectedAnswers(prev => ({ ...prev, [quizId]: selectedOption }));
    
    const isCorrect = selectedOption === quiz.correctAnswer;
    saveQuizProgress({
      quizId,
      selectedOption,
      isCorrect
    });
    
    setShowResults(prev => ({ ...prev, [quizId]: true }));
  };

  const resetQuiz = (quizId: number) => {
    setSelectedAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[quizId];
      return newAnswers;
    });
    
    setShowResults(prev => {
      const newResults = { ...prev };
      delete newResults[quizId];
      return newResults;
    });
  };

  const getQuizProgress = (quizId: number) => {
    return quizProgress.find(p => p.quizId === quizId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to={`/subject/${contest.subjectId}/quizzes`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Contests
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {contest.title} - Quizzes
          </h1>
          <p className="text-gray-600">
            Test your knowledge with these multiple-choice questions
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {contestQuizzes.map((quiz, index) => {
            const progress = getQuizProgress(quiz.id);
            const selectedAnswer = selectedAnswers[quiz.id] || progress?.selectedOption;
            const showResult = showResults[quiz.id] || !!progress;
            
            return (
              <div
                key={quiz.id}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-600 text-white rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {quiz.question}
                    </h3>
                  </div>
                  
                  {showResult && (
                    <button
                      onClick={() => resetQuiz(quiz.id)}
                      className="text-gray-500 hover:text-gray-700 p-2"
                      title="Reset quiz"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {quiz.options.map((option, optionIndex) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = option === quiz.correctAnswer;
                    
                    let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ";
                    
                    if (!showResult) {
                      buttonClass += "border-gray-200 hover:border-purple-300 hover:bg-purple-50";
                    } else {
                      if (isSelected && isCorrect) {
                        buttonClass += "border-green-500 bg-green-50 text-green-800";
                      } else if (isSelected && !isCorrect) {
                        buttonClass += "border-red-500 bg-red-50 text-red-800";
                      } else if (!isSelected && isCorrect) {
                        buttonClass += "border-green-500 bg-green-50 text-green-800";
                      } else {
                        buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
                      }
                    }

                    return (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswerSelect(quiz.id, option)}
                        disabled={showResult}
                        className={buttonClass}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-6 h-6 border-2 rounded-full text-xs font-medium">
                              {String.fromCharCode(65 + optionIndex)}
                            </div>
                            <span className="font-medium">{option}</span>
                          </div>
                          
                          {showResult && isSelected && (
                            <div className="flex items-center">
                              {isCorrect ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-600" />
                              )}
                            </div>
                          )}
                          
                          {showResult && !isSelected && isCorrect && (
                            <div className="flex items-center">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {showResult && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    progress?.isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      {progress?.isCorrect ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                      <span className="font-medium">
                        {progress?.isCorrect ? 'Correct!' : 'Incorrect'}
                        {!progress?.isCorrect && ` The correct answer is: ${quiz.correctAnswer}`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {contestQuizzes.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No quizzes available
            </h3>
            <p className="text-gray-500 mb-4">
              This contest doesn't have any quizzes yet. Check back later or contact an administrator.
            </p>
            <Link
              to={`/subject/${contest.subjectId}/quizzes`}
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

export default QuizzesPage;