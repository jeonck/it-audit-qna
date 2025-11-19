# 정보시스템 감리 Q&A

정보시스템 감리에 대한 질문과 답변을 공유하는 Q&A 플랫폼입니다.

## ✨ 주요 기능

- ⚡️ **Vite** - 빠르고 효율적인 개발 환경
- ⚛️ **React 18** - 최신 React 기능 사용
- 📘 **TypeScript** - 안정적인 타입 시스템
- 🎨 **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- 🗃️ **Supabase** - 오픈소스 백엔드 서비스 (PostgreSQL)

## 🛠️ 기술 스택

- React 18.2.0
- Vite 5.2.0
- TypeScript 5.9.3
- Tailwind CSS 3.4.1
- React Router DOM 6.30.1
- Supabase

## 🚀 로컬에서 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/jeonck/it-audit-qna.git
cd it-audit-qna
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고, Supabase 프로젝트의 URL과 `anon public` 키를 입력합니다.

```
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **참고:** Vite는 `VITE_` 접두사가 붙은 환경 변수만 클라이언트 코드에 노출합니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

이제 브라우저에서 `http://localhost:5173` (또는 다른 포트)으로 접속할 수 있습니다.

## 📦 데이터베이스 시딩 (테스트 데이터 추가)

`scripts/insert_question.js` 스크립트를 사용하여 Supabase 데이터베이스에 테스트 질문을 추가할 수 있습니다.

1.  **환경 변수 설정:**
    스크립트를 실행하기 전에 셸에서 `SUPABASE_URL`과 `SUPABASE_ANON_KEY` 환경 변수를 설정해야 합니다.

    ```bash
    export SUPABASE_URL="https://your-project-url.supabase.co"
    export SUPABASE_ANON_KEY="your-supabase-anon-key"
    ```

2.  **스크립트 실행:**
    다음과 같이 스크립트를 실행하고, 인자로 질문 제목, 내용, 작성자를 전달합니다.

    ```bash
    node scripts/insert_question.js "새로운 질문 제목" "새로운 질문 내용" "새로운 작성자"
    ```

## 📜 사용 가능한 스크립트

- `npm run dev`: 개발 서버를 시작합니다.
- `npm run build`: 프로덕션용으로 앱을 빌드합니다.
- `npm run lint`: ESLint로 코드 스타일을 검사합니다.
- `npm run preview`: 프로덕션 빌드를 로컬에서 미리 봅니다.

## 🤝 기여하기

기여, 이슈, 기능 요청을 환영합니다!