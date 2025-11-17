import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import QuestionListPage from './pages/QuestionListPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import AskQuestionPage from './pages/AskQuestionPage';

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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

const Footer = () => (
  <footer className="bg-white border-t border-gray-200 mt-16">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-lg font-semibold text-gray-800">정보시스템 감리 Q&A</p>
          <p className="text-sm text-gray-600">Built with React + Vite + TypeScript + Tailwind CSS</p>
        </div>
        <div className="text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
);

export default App;
