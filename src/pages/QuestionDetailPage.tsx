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
    return <div>로딩 중...</div>;
  }


  if (error) {
    return <div>오류: {error}</div>;
  }

  if (!question) {
    return <div>질문을 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <div className="mb-8">
        {isEditingTitle ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-3xl font-bold w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <button
              onClick={handleSaveTitle}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex-shrink-0 transition-colors duration-200"
            >
              저장
            </button>
            <button
              onClick={handleCancelTitleEdit}
              className="bg-neutral-500 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg flex-shrink-0 transition-colors duration-200"
            >
              취소
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">{question.title}</h1>
              <button
                onClick={handleEditTitleClick}
                className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded-lg text-sm transition-colors duration-200"
              >
                수정
              </button>
            </div>
            {isEditingTags ? (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={editedTags}
                  onChange={(e) => setEditedTags(e.target.value)}
                  className="w-full p-1 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="태그 (쉼표로 구분)"
                />
                <button
                  onClick={handleSaveTags}
                  className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-lg text-xs flex-shrink-0 transition-colors duration-200"
                >
                  저장
                </button>
                <button
                  onClick={handleCancelTagsEdit}
                  className="bg-neutral-500 hover:bg-neutral-600 text-white px-2 py-1 rounded-lg text-xs flex-shrink-0 transition-colors duration-200"
                >
                  취소
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-2">
                {question.tags && question.tags.length > 0 ? (
                  question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-neutral-200 rounded-full px-2 py-0.5 text-xs font-semibold text-neutral-700 mr-1"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-neutral-500">태그 없음</span>
                )}
                <button
                  onClick={handleEditTagsClick}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-2 py-0.5 rounded-lg text-xs transition-colors duration-200"
                >
                  수정
                </button>
              </div>
            )}
          </>
        )}
        <div className="text-sm text-neutral-600 mt-2">
          <span>작성자: {question.author}</span>
          <span className="mx-2">|</span>
          <span>작성일: {question.created_at}</span>
        </div>
      </div>
      <div
        className="prose max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: question.content }}
      />
      <div>
        <h2 className="text-2xl font-bold mb-4">답변 ({question.answers.length})</h2>
        <ul>
          {question.answers.map((answer) => (
            <li key={answer.id} className="border-t py-4">
              <div className="text-sm text-gray-600 mb-2 flex justify-between items-center">
                <div>
                  <span>{answer.author}</span>
                  <span className="mx-2">|</span>
                  <span>{answer.created_at}</span>
                </div>
                <div>
                  {editingAnswerId === answer.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(answer.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs mr-2 transition-colors duration-200"
                      >
                        저장
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-neutral-500 hover:bg-neutral-600 text-white px-3 py-1 rounded-lg text-xs transition-colors duration-200"
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(answer)}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded-lg text-xs mr-2 transition-colors duration-200"
                      >
                        수정
                      </button>
                      {/* Delete button will be implemented later */}
                      <button
                        // onClick={() => handleDeleteAnswer(answer.id)}
                        className="bg-accent-500 hover:bg-accent-600 text-white px-3 py-1 rounded-lg text-xs transition-colors duration-200"
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              </div>
              {editingAnswerId === answer.id ? (
                <ReactQuill
                  theme="snow"
                  value={editedAnswerContent}
                  onChange={setEditedAnswerContent}
                  className="bg-white border border-neutral-300 rounded-lg"
                />
              ) : (
                <div
                  className="prose max-w-none mt-2"
                  dangerouslySetInnerHTML={{ __html: answer.content }}
                />
              )}
            </li>
          ))}
        </ul>
        <form onSubmit={handleAnswerSubmit} className="mt-8">
          <h3 className="text-xl font-bold mb-4">답변 등록</h3>
          <div className="mb-4">
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              작성자
            </label>
            <input
              type="text"
              id="author"
              value={newAnswerAuthor}
              onChange={(e) => setNewAnswerAuthor(e.target.value)}
              className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-neutral-700 mb-1">
              내용
            </label>
            <ReactQuill
              theme="snow"
              value={newAnswerContent}
              onChange={setNewAnswerContent}
              className="bg-white border border-neutral-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 mt-4"
          >
            답변 등록
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
