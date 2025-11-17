import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
      </div>
      <div className="prose max-w-none mb-8">
        <p>{question.content}</p>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">답변 ({question.answers.length})</h2>
        <ul>
          {question.answers.map((answer) => (
            <li key={answer.id} className="border-t py-4">
              <div className="text-sm text-gray-600 mb-2">
                <span>{answer.author}</span>
                <span className="mx-2">|</span>
                <span>{answer.created_at}</span>
              </div>
              <p>{answer.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
