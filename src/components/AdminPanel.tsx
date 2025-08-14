import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft, Download, Upload, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { exportAllData, importAllData } from '../utils/localStorage';
import { Subject, Contest, Question, Quiz } from '../types';

const ADMIN_PASSWORD = 'admin123'; // Hardcoded password

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'subjects' | 'contests' | 'questions' | 'quizzes'>('subjects');
  const [showDeleteModal, setShowDeleteModal] = useState<{ type: string; id: number; name: string } | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const {
    subjects,
    contests,
    questions,
    quizzes,
    addSubject,
    updateSubject,
    deleteSubject,
    addContest,
    updateContest,
    deleteContest,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    refreshData
  } = useData();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Incorrect password');
    }
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'educational-platform-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (importAllData(content)) {
        refreshData();
        alert('Data imported successfully!');
      } else {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDelete = () => {
    if (!showDeleteModal) return;
    
    const { type, id } = showDeleteModal;
    
    switch (type) {
      case 'subject':
        deleteSubject(id);
        break;
      case 'contest':
        deleteContest(id);
        break;
      case 'question':
        deleteQuestion(id);
        break;
      case 'quiz':
        deleteQuiz(id);
        break;
    }
    
    setShowDeleteModal(null);
  };

  const handleSaveItem = (item: any, type: string) => {
    const { id, ...data } = item;
    
    if (id) {
      // Update existing item
      switch (type) {
        case 'subject':
          updateSubject(id, data);
          break;
        case 'contest':
          updateContest(id, data);
          break;
        case 'question':
          updateQuestion(id, data);
          break;
        case 'quiz':
          updateQuiz(id, data);
          break;
      }
    } else {
      // Add new item
      switch (type) {
        case 'subject':
          addSubject(data);
          break;
        case 'contest':
          addContest(data);
          break;
        case 'question':
          addQuestion(data);
          break;
        case 'quiz':
          addQuiz(data);
          break;
      }
    }
    
    setEditingItem(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-6 h-6 text-gray-600" />
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
          
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Lock className="w-6 h-6 text-gray-600" />
                <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export Data
                </button>
                
                <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Import Data
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
                
                <Link
                  to="/"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>

          <div className="flex border-b border-gray-200">
            {[
              { key: 'subjects', label: 'Subjects' },
              { key: 'contests', label: 'Contests' },
              { key: 'questions', label: 'Questions' },
              { key: 'quizzes', label: 'Quizzes' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'subjects' && (
              <SubjectsTab
                subjects={subjects}
                editingItem={editingItem}
                setEditingItem={setEditingItem}
                setShowDeleteModal={setShowDeleteModal}
                handleSaveItem={handleSaveItem}
              />
            )}
            
            {activeTab === 'contests' && (
              <ContestsTab
                contests={contests}
                subjects={subjects}
                editingItem={editingItem}
                setEditingItem={setEditingItem}
                setShowDeleteModal={setShowDeleteModal}
                handleSaveItem={handleSaveItem}
              />
            )}
            
            {activeTab === 'questions' && (
              <QuestionsTab
                questions={questions}
                contests={contests}
                subjects={subjects}
                editingItem={editingItem}
                setEditingItem={setEditingItem}
                setShowDeleteModal={setShowDeleteModal}
                handleSaveItem={handleSaveItem}
              />
            )}
            
            {activeTab === 'quizzes' && (
              <QuizzesTab
                quizzes={quizzes}
                contests={contests}
                subjects={subjects}
                editingItem={editingItem}
                setEditingItem={setEditingItem}
                setShowDeleteModal={setShowDeleteModal}
                handleSaveItem={handleSaveItem}
              />
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{showDeleteModal.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Individual tab components
const SubjectsTab: React.FC<any> = ({ subjects, editingItem, setEditingItem, setShowDeleteModal, handleSaveItem }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-800">Subjects Management</h2>
      <button
        onClick={() => setEditingItem({ name: '' })}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Subject
      </button>
    </div>

    {editingItem && (
      <SubjectForm
        item={editingItem}
        onSave={(item) => handleSaveItem(item, 'subject')}
        onCancel={() => setEditingItem(null)}
      />
    )}

    <div className="space-y-3">
      {subjects.map((subject: Subject) => (
        <div key={subject.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
          <span className="font-medium text-gray-800">{subject.name}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setEditingItem(subject)}
              className="text-blue-600 hover:text-blue-800 p-1"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDeleteModal({ type: 'subject', id: subject.id, name: subject.name })}
              className="text-red-600 hover:text-red-800 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ContestsTab: React.FC<any> = ({ contests, subjects, editingItem, setEditingItem, setShowDeleteModal, handleSaveItem }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-800">Contests Management</h2>
      <button
        onClick={() => setEditingItem({ title: '', subjectId: subjects[0]?.id || 1 })}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Contest
      </button>
    </div>

    {editingItem && (
      <ContestForm
        item={editingItem}
        subjects={subjects}
        onSave={(item) => handleSaveItem(item, 'contest')}
        onCancel={() => setEditingItem(null)}
      />
    )}

    <div className="space-y-3">
      {contests.map((contest: Contest) => {
        const subject = subjects.find((s: Subject) => s.id === contest.subjectId);
        return (
          <div key={contest.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
            <div>
              <span className="font-medium text-gray-800">{contest.title}</span>
              <span className="text-sm text-gray-600 ml-2">({subject?.name})</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingItem(contest)}
                className="text-blue-600 hover:text-blue-800 p-1"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteModal({ type: 'contest', id: contest.id, name: contest.title })}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const QuestionsTab: React.FC<any> = ({ questions, contests, subjects, editingItem, setEditingItem, setShowDeleteModal, handleSaveItem }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-800">Questions Management</h2>
      <button
        onClick={() => setEditingItem({
          title: '',
          description: '',
          tags: [],
          difficulty: 'Easy',
          link: '',
          contestId: contests[0]?.id || 1
        })}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Question
      </button>
    </div>

    {editingItem && (
      <QuestionForm
        item={editingItem}
        contests={contests}
        subjects={subjects}
        onSave={(item) => handleSaveItem(item, 'question')}
        onCancel={() => setEditingItem(null)}
      />
    )}

    <div className="space-y-3">
      {questions.map((question: Question) => {
        const contest = contests.find((c: Contest) => c.id === question.contestId);
        const subject = subjects.find((s: Subject) => s.id === contest?.subjectId);
        return (
          <div key={question.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
            <div>
              <span className="font-medium text-gray-800">{question.title}</span>
              <div className="text-sm text-gray-600">
                {contest?.title} ({subject?.name}) - {question.difficulty}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingItem(question)}
                className="text-blue-600 hover:text-blue-800 p-1"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteModal({ type: 'question', id: question.id, name: question.title })}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const QuizzesTab: React.FC<any> = ({ quizzes, contests, subjects, editingItem, setEditingItem, setShowDeleteModal, handleSaveItem }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-800">Quizzes Management</h2>
      <button
        onClick={() => setEditingItem({
          question: '',
          options: ['', ''],
          correctAnswer: '',
          contestId: contests[0]?.id || 1
        })}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Quiz
      </button>
    </div>

    {editingItem && (
      <QuizForm
        item={editingItem}
        contests={contests}
        subjects={subjects}
        onSave={(item) => handleSaveItem(item, 'quiz')}
        onCancel={() => setEditingItem(null)}
      />
    )}

    <div className="space-y-3">
      {quizzes.map((quiz: Quiz) => {
        const contest = contests.find((c: Contest) => c.id === quiz.contestId);
        const subject = subjects.find((s: Subject) => s.id === contest?.subjectId);
        return (
          <div key={quiz.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
            <div>
              <span className="font-medium text-gray-800">{quiz.question}</span>
              <div className="text-sm text-gray-600">
                {contest?.title} ({subject?.name})
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingItem(quiz)}
                className="text-blue-600 hover:text-blue-800 p-1"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteModal({ type: 'quiz', id: quiz.id, name: quiz.question })}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// Form components
const SubjectForm: React.FC<any> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState(item);

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">{item.id ? 'Edit Subject' : 'Add Subject'}</h3>
      <div className="flex gap-4">
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Subject name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={() => onSave(formData)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800 px-4 py-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ContestForm: React.FC<any> = ({ item, subjects, onSave, onCancel }) => {
  const [formData, setFormData] = useState(item);

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">{item.id ? 'Edit Contest' : 'Add Contest'}</h3>
      <div className="flex gap-4">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Contest title"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
        />
        <select
          value={formData.subjectId}
          onChange={(e) => setFormData({ ...formData, subjectId: parseInt(e.target.value) })}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          {subjects.map((subject: Subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => onSave(formData)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800 px-4 py-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const QuestionForm: React.FC<any> = ({ item, contests, subjects, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ...item,
    tags: Array.isArray(item.tags) ? item.tags.join(', ') : ''
  });

  const handleSave = () => {
    const tagsArray = formData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
    onSave({
      ...formData,
      tags: tagsArray
    });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">{item.id ? 'Edit Question' : 'Add Question'}</h3>
      <div className="space-y-4">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Question title"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Question description"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"
        />
        <div className="flex gap-4">
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="Tags (comma-separated)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
          />
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div className="flex gap-4">
          <input
            type="url"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="External link"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
          />
          <select
            value={formData.contestId}
            onChange={(e) => setFormData({ ...formData, contestId: parseInt(e.target.value) })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            {contests.map((contest: Contest) => {
              const subject = subjects.find((s: Subject) => s.id === contest.subjectId);
              return (
                <option key={contest.id} value={contest.id}>
                  {contest.title} ({subject?.name})
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800 px-4 py-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const QuizForm: React.FC<any> = ({ item, contests, subjects, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ...item,
    options: Array.isArray(item.options) ? item.options : ['', '']
  });

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ''] });
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_: any, i: number) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">{item.id ? 'Edit Quiz' : 'Add Quiz'}</h3>
      <div className="space-y-4">
        <input
          type="text"
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          placeholder="Quiz question"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Options:</label>
          {formData.options.map((option: string, index: number) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              {formData.options.length > 2 && (
                <button
                  onClick={() => removeOption(index)}
                  className="text-red-600 hover:text-red-800 px-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addOption}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Option
          </button>
        </div>

        <div className="flex gap-4">
          <select
            value={formData.correctAnswer}
            onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select correct answer</option>
            {formData.options.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option || `Option ${index + 1}`}
              </option>
            ))}
          </select>
          
          <select
            value={formData.contestId}
            onChange={(e) => setFormData({ ...formData, contestId: parseInt(e.target.value) })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            {contests.map((contest: Contest) => {
              const subject = subjects.find((s: Subject) => s.id === contest.subjectId);
              return (
                <option key={contest.id} value={contest.id}>
                  {contest.title} ({subject?.name})
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => onSave(formData)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800 px-4 py-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;