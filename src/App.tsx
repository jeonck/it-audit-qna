import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import QuestionListPage from './pages/QuestionListPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import AskQuestionPage from './pages/AskQuestionPage';
import MarkdownEditorPage from './pages/MarkdownEditorPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<QuestionListPage />} />
            <Route path="/question/:id" element={<QuestionDetailPage />} />
            <Route path="/ask" element={<AskQuestionPage />} />
            <Route path="/markdown-editor" element={<MarkdownEditorPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

const Footer = () => (
  <footer className="bg-gradient-to-r from-primary-50 to-accent-50 border-t border-neutral-200 mt-20">
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
            <span className="text-2xl">📋</span>
            <p className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              정보시스템 감리 Q&A
            </p>
          </div>
          <p className="text-sm text-neutral-600 mb-1">지식을 공유하고 함께 성장하는 커뮤니티</p>
          <p className="text-xs text-neutral-500">Built with React + Vite + TypeScript + Tailwind CSS</p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white shadow-soft hover:shadow-soft-lg flex items-center justify-center transition-all hover:scale-110"
              title="GitHub"
            >
              <span className="text-lg">💻</span>
            </a>
            <a
              href="mailto:contact@example.com"
              className="w-10 h-10 rounded-full bg-white shadow-soft hover:shadow-soft-lg flex items-center justify-center transition-all hover:scale-110"
              title="Email"
            >
              <span className="text-lg">✉️</span>
            </a>
          </div>
          <p className="text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default App;
