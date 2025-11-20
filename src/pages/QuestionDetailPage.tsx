import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../supabaseClient';

interface Answer {
  id: string;
  author: string;
  created_at: string;
  content: string;
}

interface QuestionDetail {
  id: string;
  title: string;
  author: string;
  created_at: string;
  content: string;
  tags: string[];
  answers: Answer[];
}

const QuestionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!id) {
        setError('Question ID is missing.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('questions')
        .select('*, answers(*)')
        .eq('id', id)
        .single();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data) {
        setQuestion({
          id: data.id,
          title: data.title,
          author: data.author,
          created_at: new Date(data.created_at).toLocaleDateString(),
          content: data.content,
          tags: data.tags || [],
          answers: data.answers.map((ans: any) => ({
            id: ans.id,
            author: ans.author,
            created_at: new Date(ans.created_at).toLocaleDateString(),
            content: ans.content,
          })),
        });
      }
      setLoading(false);
    };

    fetchQuestion();
  }, [id]);

  const [newAnswerAuthor, setNewAnswerAuthor] = useState('');
  const [newAnswerContent, setNewAnswerContent] = useState('');
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [editedAnswerContent, setEditedAnswerContent] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [editedTags, setEditedTags] = useState('');

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newAnswerContent.trim() || !newAnswerAuthor.trim()) {
      setError('Author and content cannot be empty.');
      return;
    }

    const { data, error } = await supabase.from('answers').insert([
      {
        question_id: id,
        author: newAnswerAuthor,
        content: newAnswerContent,
      },
    ]).select().single();

    if (error) {
      setError(error.message);
    } else if (data) {
      // Add the new answer to the state to re-render the list
      if (question) {
        const formattedAnswer = {
          ...data,
          created_at: new Date(data.created_at).toLocaleDateString(),
        };
        setQuestion({
          ...question,
          answers: [...question.answers, formattedAnswer],
        });
      }
      setNewAnswerAuthor('');
      setNewAnswerContent('');
      setError(null);
    }
  };

  const handleEditClick = (answer: Answer) => {
    setEditingAnswerId(answer.id);
    setEditedAnswerContent(answer.content);
  };

  const handleSaveEdit = async (answerId: string) => {
    if (!editedAnswerContent.trim()) {
      setError('Answer content cannot be empty.');
      return;
    }

    const { error } = await supabase
      .from('answers')
      .update({ content: editedAnswerContent })
      .eq('id', answerId);

    if (error) {
      setError(error.message);
    } else {
      if (question) {
        setQuestion({
          ...question,
          answers: question.answers.map((ans) =>
            ans.id === answerId ? { ...ans, content: editedAnswerContent } : ans
          ),
        });
      }
      setEditingAnswerId(null);
      setEditedAnswerContent('');
      setError(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingAnswerId(null);
    setEditedAnswerContent('');
    setError(null);
  };

  const handleEditTitleClick = () => {
    if (question) {
      setIsEditingTitle(true);
      setEditedTitle(question.title);
    }
  };

  const handleSaveTitle = async () => {
    if (!editedTitle.trim() || !question) {
      setError('Title cannot be empty.');
      return;
    }

    const { error } = await supabase
      .from('questions')
      .update({ title: editedTitle })
      .eq('id', question.id);

    if (error) {
      setError(error.message);
    } else {
      setQuestion({ ...question, title: editedTitle });
      setIsEditingTitle(false);
      setEditedTitle('');
      setError(null);
    }
  };

  const handleCancelTitleEdit = () => {
    setIsEditingTitle(false);
    setEditedTitle('');
    setError(null);
  };

  const handleEditTagsClick = () => {
    if (question) {
      setIsEditingTags(true);
      setEditedTags(question.tags.join(', '));
    }
  };

  const handleSaveTags = async () => {
    if (!question) return;

    const tagsArray = editedTags.split(',').map(tag => tag.trim()).filter(tag => tag);

    const { error } = await supabase
      .from('questions')
      .update({ tags: tagsArray })
      .eq('id', question.id);

    if (error) {
      setError(error.message);
    } else {
      setQuestion({ ...question, tags: tagsArray });
      setIsEditingTags(false);
      setEditedTags('');
      setError(null);
    }
  };

  const handleCancelTagsEdit = () => {
    setIsEditingTags(false);
    setEditedTags('');
    setError(null);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="skeleton h-16 w-3/4 rounded-xl"></div>
        <div className="flex gap-2">
          <div className="skeleton h-8 w-24 rounded-full"></div>
          <div className="skeleton h-8 w-32 rounded-full"></div>
        </div>
        <div className="skeleton h-64 w-full rounded-xl"></div>
        <div className="skeleton h-48 w-full rounded-xl"></div>
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
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">❓</div>
        <h3 className="empty-state-title">질문을 찾을 수 없습니다</h3>
        <p className="empty-state-description">
          요청하신 질문이 삭제되었거나 존재하지 않습니다
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="card-elevated p-8 mb-8">
        {isEditingTitle ? (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="input text-2xl font-bold flex-1"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveTitle}
                className="btn-success btn-md flex-1 sm:flex-initial"
              >
                💾 저장
              </button>
              <button
                onClick={handleCancelTitleEdit}
                className="btn-secondary btn-md flex-1 sm:flex-initial"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-neutral-800 flex-1">
                {question.title}
              </h1>
              <button
                onClick={handleEditTitleClick}
                className="btn-primary btn-sm self-start"
              >
                ✏️ 제목 수정
              </button>
            </div>
          </div>
        )}

        <div className="mb-4">
          {isEditingTags ? (
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <input
                type="text"
                value={editedTags}
                onChange={(e) => setEditedTags(e.target.value)}
                className="input flex-1"
                placeholder="태그를 쉼표로 구분하여 입력하세요"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveTags}
                  className="btn-success btn-sm flex-1 sm:flex-initial"
                >
                  💾 저장
                </button>
                <button
                  onClick={handleCancelTagsEdit}
                  className="btn-secondary btn-sm flex-1 sm:flex-initial"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-neutral-600">🏷️ 태그:</span>
              {question.tags && question.tags.length > 0 ? (
                question.tags.map((tag) => (
                  <span key={tag} className="badge-primary">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-sm text-neutral-400 italic">태그 없음</span>
              )}
              <button
                onClick={handleEditTagsClick}
                className="btn-primary btn-sm ml-2"
              >
                ✏️ 수정
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-600 pt-4 border-t border-neutral-200">
          <span className="flex items-center gap-1">
            <span className="text-base">👤</span>
            <span className="font-medium">{question.author}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-base">📅</span>
            {question.created_at}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-base">💬</span>
            답변 {question.answers.length}개
          </span>
        </div>
      </div>

      <div className="card-elevated p-8 mb-8">
        <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">📖</span>
          질문 내용
        </h2>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: question.content }}
        />
      </div>
      <div>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
            <span className="text-3xl">💬</span>
            답변
          </h2>
          <span className="badge-active">{question.answers.length}개</span>
        </div>

        {question.answers.length === 0 ? (
          <div className="card-elevated p-12 text-center mb-8">
            <div className="text-5xl mb-4 opacity-30">💭</div>
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">
              아직 답변이 없습니다
            </h3>
            <p className="text-neutral-500">
              첫 번째 답변을 작성하고 지식을 공유해보세요!
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {question.answers.map((answer, index) => (
              <div
                key={answer.id}
                className="card-elevated p-6 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4 pb-3 border-b border-neutral-200">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-600">
                    <span className="flex items-center gap-1">
                      <span className="text-base">👤</span>
                      <span className="font-medium">{answer.author}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-base">📅</span>
                      {answer.created_at}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {editingAnswerId === answer.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(answer.id)}
                          className="btn-success btn-sm"
                        >
                          💾 저장
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn-secondary btn-sm"
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(answer)}
                          className="btn-primary btn-sm"
                        >
                          ✏️ 수정
                        </button>
                        <button
                          disabled
                          className="btn-danger btn-sm opacity-50 cursor-not-allowed"
                          title="삭제 기능은 곧 추가될 예정입니다"
                        >
                          🗑️ 삭제
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {editingAnswerId === answer.id ? (
                  <div className="rounded-xl overflow-hidden border-2 border-neutral-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500 transition-all">
                    <ReactQuill
                      theme="snow"
                      value={editedAnswerContent}
                      onChange={setEditedAnswerContent}
                      className="bg-white"
                    />
                  </div>
                ) : (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: answer.content }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="card-elevated p-8">
          <h3 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">✍️</span>
            답변 작성하기
          </h3>
          <form onSubmit={handleAnswerSubmit} className="space-y-6">
            <div>
              <label htmlFor="author" className="flex items-center gap-2 text-base font-semibold text-neutral-800 mb-3">
                <span className="text-lg">👤</span>
                작성자
              </label>
              <input
                type="text"
                id="author"
                value={newAnswerAuthor}
                onChange={(e) => setNewAnswerAuthor(e.target.value)}
                className="input"
                placeholder="이름을 입력해주세요"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="flex items-center gap-2 text-base font-semibold text-neutral-800 mb-3">
                <span className="text-lg">📝</span>
                답변 내용
              </label>
              <div className="rounded-xl overflow-hidden border-2 border-neutral-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500 transition-all">
                <ReactQuill
                  theme="snow"
                  value={newAnswerContent}
                  onChange={setNewAnswerContent}
                  className="bg-white"
                  placeholder="답변을 작성해주세요. 자세한 설명을 포함하면 좋습니다."
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary btn-lg w-full sm:w-auto"
            >
              <span className="mr-2">✨</span>
              답변 등록하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
