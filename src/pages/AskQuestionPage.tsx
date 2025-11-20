import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../supabaseClient';

const AskQuestionPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    const { data, error } = await supabase
      .from('questions')
      .insert([{ title, content, author, tags: tagsArray }])
      .select();

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      console.log('Question submitted:', data);
      navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-2">
          <span className="mr-2">✏️</span>
          질문하기
        </h1>
        <p className="text-neutral-600">궁금한 점을 자유롭게 질문하고 다른 분들과 지식을 나누어보세요</p>
      </div>

      <div className="card-elevated p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="flex items-center gap-2 text-base font-semibold text-neutral-800 mb-3">
              <span className="text-lg">📝</span>
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="무엇이 궁금하신가요?"
              required
            />
            <p className="text-sm text-neutral-500 mt-1">질문을 잘 나타내는 명확한 제목을 작성해주세요</p>
          </div>

          <div>
            <label htmlFor="author" className="flex items-center gap-2 text-base font-semibold text-neutral-800 mb-3">
              <span className="text-lg">👤</span>
              작성자
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="input"
              placeholder="이름을 입력해주세요"
              required
            />
          </div>

          <div>
            <label htmlFor="tags" className="flex items-center gap-2 text-base font-semibold text-neutral-800 mb-3">
              <span className="text-lg">🏷️</span>
              태그 (쉼표로 구분)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="input"
              placeholder="예: 보안, 규정준수, 데이터베이스"
            />
            <p className="text-sm text-neutral-500 mt-1">관련 태그를 입력하면 다른 사람들이 쉽게 찾을 수 있어요</p>
          </div>

          <div>
            <label htmlFor="content" className="flex items-center gap-2 text-base font-semibold text-neutral-800 mb-3">
              <span className="text-lg">📄</span>
              내용
            </label>
            <div className="rounded-xl overflow-hidden border-2 border-neutral-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500 transition-all">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                className="bg-white"
                placeholder="질문 내용을 자세히 작성해주세요. 코드나 스크린샷을 포함할 수 있습니다."
              />
            </div>
            <p className="text-sm text-neutral-500 mt-1">자세한 내용을 작성할수록 더 좋은 답변을 받을 수 있어요</p>
          </div>

          {error && (
            <div className="alert-error">
              <div className="flex items-start">
                <span className="text-xl mr-2">⚠️</span>
                <div>
                  <h4 className="font-semibold">오류가 발생했습니다</h4>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="btn-primary btn-lg flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner mr-2"></span>
                  등록 중...
                </>
              ) : (
                <>
                  <span className="mr-2">✨</span>
                  질문 등록하기
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="btn-secondary btn-lg"
              disabled={loading}
            >
              취소
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 p-6 bg-primary-50 rounded-2xl border border-primary-200">
        <h3 className="font-semibold text-primary-900 mb-2 flex items-center gap-2">
          <span className="text-lg">💡</span>
          좋은 질문 작성 팁
        </h3>
        <ul className="text-sm text-primary-800 space-y-1">
          <li>• 질문을 명확하고 구체적으로 작성하세요</li>
          <li>• 관련 배경 정보나 맥락을 함께 제공하세요</li>
          <li>• 적절한 태그를 사용하면 더 많은 분들이 볼 수 있어요</li>
          <li>• 시도해본 방법이 있다면 함께 공유해주세요</li>
        </ul>
      </div>
    </div>
  );
};

export default AskQuestionPage;
