import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

interface Question {
  id: string;
  title: string;
  author: string;
  created_at: string;
  answers_count: number;
  tags: string[];
}

const QuestionListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('id, title, author, created_at, tags, answers(id)') // Select answers to count them
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Map the data to include answers_count
      const formattedQuestions: Question[] = data.map((q: any) => ({
        id: q.id,
        title: q.title,
        author: q.author,
        created_at: new Date(q.created_at).toLocaleDateString(),
        answers_count: q.answers ? q.answers.length : 0,
        tags: q.tags || [],
      }));

      setQuestions(formattedQuestions);
      setLoading(false);
    };

    fetchQuestions();
  }, []);

  const allTags = [...new Set(questions.flatMap((q) => q.tags))];

  const filteredQuestions = questions
    .filter((question) => {
      if (!selectedTag) return true;
      return question.tags.includes(selectedTag);
    })
    .filter((question) =>
      question.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">정보시스템 감리 Q&A</h1>
        <Link to="/ask" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          질문하기
        </Link>
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="질문 검색..."
          className="w-full px-4 py-2 border rounded-md"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <span className="mr-2 font-semibold">태그:</span>
        <button
          onClick={() => setSelectedTag(null)}
          className={`inline-block rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 ${
            !selectedTag
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          전체
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 ${
              tag === selectedTag
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <ul>
        {filteredQuestions.map((question) => (
          <li key={question.id} className="border-b py-4">
            <Link to={`/question/${question.id}`} className="text-lg font-semibold text-blue-600 hover:underline">
              {question.title}
            </Link>
            <div className="mt-2">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <span>작성자: {question.author}</span>
              <span className="mx-2">|</span>
              <span>작성일: {question.created_at}</span>
              <span className="mx-2">|</span>
              <span>답변: {question.answers_count}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionListPage;
