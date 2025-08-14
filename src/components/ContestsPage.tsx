import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Trophy, ArrowLeft, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';

interface ContestsPageProps {
  type: 'coding-questions' | 'quizzes';
}

const ContestsPage: React.FC<ContestsPageProps> = ({ type }) => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { subjects, contests } = useData();
  
  const subject = subjects.find(s => s.id === parseInt(subjectId || '0'));
  const subjectContests = contests.filter(c => c.subjectId === parseInt(subjectId || '0'));

  if (!subject) {
    return <Navigate to="/" replace />;
  }

  const pageTitle = type === 'coding-questions' ? 'Coding Questions' : 'Quizzes';
  const pageIcon = type === 'coding-questions' ? 'from-green-500 to-emerald-600' : 'from-purple-500 to-violet-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to={`/subject/${subject.id}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {subject.name}
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {pageTitle} - {subject.name}
          </h1>
          <p className="text-gray-600">
            Select a contest to {type === 'coding-questions' ? 'solve coding problems' : 'take quizzes'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectContests.map((contest) => (
            <Link
              key={contest.id}
              to={`/contest/${contest.id}/${type}`}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6">
                <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-r ${pageIcon} rounded-lg mb-4 mx-auto`}>
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
                  {contest.title}
                </h3>
                <p className="text-gray-600 text-center text-sm mb-4">
                  Click to {type === 'coding-questions' ? 'view coding problems' : 'start quiz'}
                </p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                    <Calendar className="w-3 h-3" />
                    Contest
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {subjectContests.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No contests available
            </h3>
            <p className="text-gray-500 mb-4">
              This subject doesn't have any contests yet. Check back later or contact an administrator.
            </p>
            <Link
              to={`/subject/${subject.id}`}
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

export default ContestsPage;