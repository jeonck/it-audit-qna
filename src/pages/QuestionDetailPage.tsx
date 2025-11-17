import React from 'react';
import { useParams } from 'react-router-dom';

const question = {
  id: 1,
  title: '정보시스템 감리 Q&A 사이트입니다.',
  author: '관리자',
  createdAt: '2023-10-27',
  content: '이 사이트는 정보시스템 감리에 대한 질문과 답변을 공유하는 공간입니다. 자유롭게 질문하고 답변해주세요.',
  answers: [
    {
      id: 1,
      author: '사용자1',
      createdAt: '2023-10-27',
      content: '좋은 사이트네요. 자주 이용하겠습니다.',
    },
    {
      id: 2,
      author: '사용자2',
      createdAt: '2023-10-28',
      content: '감리 관련해서 궁금한 점이 있었는데, 여기서 질문하면 되겠네요.',
    },
  ],
};

const QuestionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{question.title}</h1>
        <div className="text-sm text-gray-600">
          <span>작성자: {question.author}</span>
          <span className="mx-2">|</span>
          <span>작성일: {question.createdAt}</span>
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
                <span>{answer.createdAt}</span>
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
