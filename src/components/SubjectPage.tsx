import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Code, Brain, ArrowLeft } from 'lucide-react';
import { useData } from '../context/DataContext';

const SubjectPage: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { subjects, contests } = useData();
  
  const subject = subjects.find(s => s.id === parseInt(subjectId || '0'));
  const subjectContests = contests.filter(c => c.subjectId === parseInt(subjectId || '0'));

  if (!subject) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Subjects
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {subject.name}
          </h1>
          <p className="text-gray-600">
            Choose between coding questions or quizzes to start learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link
            to={`/subject/${subject.id}/coding-questions`}
            className="group"
          >
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-8">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg mb-6 mx-auto">
                <Code className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
                Coding Questions
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Practice programming challenges and improve your coding skills with hands-on problems
              </p>
              <div className="text-center">
                <span className="inline-block bg-green-100 text-green-800 text-sm px-4 py-2 rounded-full">
                  {subjectContests.length} Contest{subjectContests.length !== 1 ? 's' : ''} Available
                </span>
              </div>
            </div>
          </Link>

          <Link
            to={`/subject/${subject.id}/quizzes`}
            className="group"
          >
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-8">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg mb-6 mx-auto">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
                Quizzes
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Test your knowledge with multiple-choice questions and track your progress
              </p>
              <div className="text-center">
                <span className="inline-block bg-purple-100 text-purple-800 text-sm px-4 py-2 rounded-full">
                  {subjectContests.length} Contest{subjectContests.length !== 1 ? 's' : ''} Available
                </span>
              </div>
            </div>
          </Link>
        </div>

        {subjectContests.length === 0 && (
          <div className="text-center py-12 max-w-md mx-auto">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No contests available
            </h3>
            <p className="text-gray-500 mb-4">
              This subject doesn't have any contests yet. Check back later or contact an administrator.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectPage;