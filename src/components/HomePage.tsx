import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Settings } from 'lucide-react';
import { useData } from '../context/DataContext';

const HomePage: React.FC = () => {
  const { subjects } = useData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Marks Booster
            </h1>
            <p className="text-gray-600">
              Made by Your Senior <span className='text-red-600'>Harsh Patel</span>
            </p>
          </div>
          {/* <Link
            to="/admin"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Admin Panel
          </Link> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              to={`/subject/${subject.id}`}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mb-4 mx-auto">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
                  {subject.name}
                </h2>
                <p className="text-gray-600 text-center text-sm">
                  Click to explore coding questions and quizzes
                </p>
                <div className="mt-4 flex justify-center">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                    Subject
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {subjects.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No subjects available
            </h3>
            <p className="text-gray-500 mb-4">
              Get started by adding subjects through the admin panel
            </p>
            <Link
              to="/admin"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Admin Panel
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;