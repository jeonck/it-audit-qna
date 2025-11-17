import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const questions = [
  {
    id: 1,
    title: '정보시스템 감리 Q&A 사이트입니다.',
    author: '관리자',
    createdAt: '2023-10-27',
    answers: 2,
  },
  {
    id: 2,
    title: '두번째 질문입니다.',
    author: '사용자',
    createdAt: '2023-10-26',
    answers: 1,
  },
];

const QuestionListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuestions = questions.filter((question) =>
    question.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <ul>
        {filteredQuestions.map((question) => (
          <li key={question.id} className="border-b py-4">
            <Link to={`/question/${question.id}`} className="text-lg font-semibold text-blue-600 hover:underline">
              {question.title}
            </Link>
            <div className="text-sm text-gray-600 mt-1">
              <span>작성자: {question.author}</span>
              <span className="mx-2">|</span>
              <span>작성일: {question.createdAt}</span>
              <span className="mx-2">|</span>
              <span>답변: {question.answers}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionListPage;
