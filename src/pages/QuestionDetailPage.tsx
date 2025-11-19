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
        <h1 className="text-3xl font-bold mb-2">{question.title}</h1>
        <div className="text-sm text-gray-600">
          <span>작성자: {question.author}</span>
          <span className="mx-2">|</span>
          <span>작성일: {question.created_at}</span>
        </div>
        {question.tags && question.tags.length > 0 && (
          <div className="mt-4">
            {question.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
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
                        className="bg-green-500 text-white px-3 py-1 rounded-md text-xs mr-2"
                      >
                        저장
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white px-3 py-1 rounded-md text-xs"
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(answer)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs mr-2"
                      >
                        수정
                      </button>
                      {/* Delete button will be implemented later */}
                      <button
                        // onClick={() => handleDeleteAnswer(answer.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-xs"
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
                  className="bg-white"
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
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              내용
            </label>
            <ReactQuill
              theme="snow"
              value={newAnswerContent}
              onChange={setNewAnswerContent}
              className="bg-white"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-4"
          >
            답변 등록
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
