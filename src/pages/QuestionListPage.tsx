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
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can make this configurable if needed
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);

  // Fetch all unique tags once when component mounts
  useEffect(() => {
    const fetchAllTags = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('tags');

      if (error) {
        console.error('Error fetching tags:', error.message);
        return;
      }

      const allUniqueTags = [...new Set(data.flatMap((q: any) => q.tags || []))];
      setAllTags(allUniqueTags);
    };

    fetchAllTags();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);

      // Fetch questions with filters for display
      let query = supabase
        .from('questions')
        .select('id, title, author, created_at, tags, answers(id)', { count: 'exact' });

      // Apply search term filter
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      // Apply tag filter
      if (selectedTag) {
        query = query.contains('tags', [selectedTag]);
      }

      // Fetch total count
      const { count, error: countError } = await query;
      if (countError) {
        setError(countError.message);
        setLoading(false);
        return;
      }
      setTotalQuestions(count || 0);

      // Fetch paginated data
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

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
  }, [currentPage, itemsPerPage, selectedTag, searchTerm]);

  // Determine if a search term or tag filter is active
  const hasSearchOrFilter = searchTerm !== '' || selectedTag !== null;

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div className="skeleton h-12 w-64"></div>
          <div className="skeleton h-10 w-28 rounded-xl"></div>
        </div>
        <div className="skeleton h-12 w-full rounded-xl"></div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card-elevated p-6">
            <div className="skeleton h-6 w-3/4 mb-3"></div>
            <div className="flex gap-2 mb-3">
              <div className="skeleton h-6 w-16 rounded-full"></div>
              <div className="skeleton h-6 w-20 rounded-full"></div>
            </div>
            <div className="skeleton h-4 w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert-error animate-slide-down">
        <div className="flex items-start">
          <span className="text-2xl mr-3">⚠️</span>
          <div>
            <h3 className="font-semibold text-lg mb-1">오류가 발생했습니다</h3>
            <p className="text-danger-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary btn-sm mt-3"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-2">
            정보시스템 감리 Q&A
          </h1>
          <p className="text-neutral-600">궁금한 점을 질문하고 지식을 공유하세요</p>
        </div>
        <Link to="/ask" className="btn-primary btn-md whitespace-nowrap">
          <span className="mr-2">✏️</span>
          질문하기
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="궁금한 내용을 검색해보세요..."
            className="input pl-12"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-xl">
            🔍
          </span>
        </div>
      </div>

      <div className="mb-8 bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-lg">🏷️</span>
          <span className="font-semibold text-neutral-800">태그 필터</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={!selectedTag ? 'badge-active' : 'badge-neutral'}
          >
            전체
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={tag === selectedTag ? 'badge-active' : 'badge-neutral'}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {totalQuestions === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🤔</div>
          <h3 className="empty-state-title">
            {hasSearchOrFilter ? '검색 결과가 없습니다' : '아직 질문이 없습니다'}
          </h3>
          <p className="empty-state-description">
            {hasSearchOrFilter
              ? '다른 검색어나 태그로 시도해보세요'
              : '첫 번째 질문을 등록해보세요!'}
          </p>
          <Link to="/ask" className="btn-primary btn-lg">
            <span className="mr-2">✨</span>
            질문 등록하기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-neutral-600 mb-4">
            <span className="font-semibold text-primary-600">{totalQuestions}개</span>의 질문을 찾았습니다
          </div>
          <ul className="space-y-4">
            {questions.map((question, index) => (
              <li
                key={question.id}
                className="card-interactive p-6 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link to={`/question/${question.id}`}>
                  <h3 className="text-lg font-semibold text-neutral-800 hover:text-primary-600 transition-colors mb-3">
                    {question.title}
                  </h3>
                </Link>
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag) => (
                    <span key={tag} className="badge-primary">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-600">
                  <span className="flex items-center gap-1">
                    <span className="text-base">👤</span>
                    {question.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-base">📅</span>
                    {question.created_at}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-base">💬</span>
                    답변 {question.answers_count}개
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          {totalQuestions > itemsPerPage && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn-secondary"
              >
                이전
              </button>
              {Array.from({ length: Math.ceil(totalQuestions / itemsPerPage) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(totalQuestions / itemsPerPage)))}
                disabled={currentPage === Math.ceil(totalQuestions / itemsPerPage)}
                className="btn-secondary"
              >
                다음
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionListPage;
