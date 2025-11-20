import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownEditorPage: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>('## 마크다운 에디터\n\n여기에 마크다운 텍스트를 입력하세요.\n\n- 목록 아이템 1\n- 목록 아이템 2\n\n**굵은 글씨**와 *기울임꼴*도 가능합니다.\n\n```javascript\nconsole.log("Hello, Markdown!");\n```');

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold mb-6 text-neutral-800">마크다운 에디터 (시험판)</h1>
      <div className="flex flex-grow border border-neutral-300 rounded-lg overflow-hidden">
        <textarea
          className="w-1/2 p-4 border-r border-neutral-300 focus:outline-none resize-none font-mono text-sm"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="마크다운 텍스트를 여기에 입력하세요..."
        />
        <div className="w-1/2 p-4 overflow-y-auto prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditorPage;
