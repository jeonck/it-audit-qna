# 디자인 개선 중 발생한 에러 수정 내역

## 개요
프로젝트의 디자인을 사용성과 친근함을 강화하도록 개선하는 과정에서 발생한 Tailwind CSS 관련 에러들과 해결 방법을 정리한 문서입니다.

---

## 에러 1: react-markdown 패키지 누락

### 에러 메시지
```
Failed to resolve import "react-markdown" from "src/pages/MarkdownEditorPage.tsx".
Does the file exist?
```

### 원인
- `MarkdownEditorPage.tsx`에서 `react-markdown` 패키지를 import하고 있으나 설치되지 않음
- `remark-gfm` 패키지도 누락됨

### 해결 방법
```bash
npm install react-markdown remark-gfm
```

### 결과
- 96개 패키지 추가됨
- 정상적으로 패키지 설치 완료

---

## 에러 2: 그라데이션 클래스 사용 불가

### 에러 메시지
```
The `from-success-500` class does not exist.
If `from-success-500` is a custom class, make sure it is defined within a `@layer` directive.
```

### 원인
- Tailwind CSS의 `@apply` 디렉티브 내에서 그라데이션 유틸리티 클래스(`from-{color}`, `to-{color}`)를 사용할 수 없음
- `success`와 `danger` 같은 커스텀 색상 팔레트의 그라데이션 클래스는 `@apply`에서 지원되지 않음

### 문제 코드
```css
.btn-primary {
  @apply btn bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700;
}

.btn-success {
  @apply btn bg-gradient-to-r from-success-500 to-success-600 text-white;
}
```

### 해결 방법
순수 CSS `linear-gradient`로 변경:

```css
.btn-primary {
  @apply btn text-white;
  background: linear-gradient(to right, #3b82f6, #2563eb);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(to right, #2563eb, #1d4ed8);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: scale(1.05);
}

.btn-success {
  @apply btn text-white;
  background: linear-gradient(to right, #22c55e, #16a34a);
}

.btn-success:hover:not(:disabled) {
  background: linear-gradient(to right, #16a34a, #15803d);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: scale(1.05);
}

.btn-danger {
  @apply btn text-white;
  background: linear-gradient(to right, #ef4444, #dc2626);
}

.btn-danger:hover:not(:disabled) {
  background: linear-gradient(to right, #dc2626, #b91c1c);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: scale(1.05);
}
```

### 결과
- 모든 버튼 컴포넌트에 그라데이션 배경이 정상 적용됨
- 호버 효과도 정상 작동

---

## 에러 3: 커스텀 색상 Focus Ring 클래스 사용 불가

### 에러 메시지
```
The `focus:ring-success-500` class does not exist.
If `focus:ring-success-500` is a custom class, make sure it is defined within a `@layer` directive.
```

### 원인
- `@apply` 디렉티브 내에서 커스텀 색상 팔레트의 `focus:ring-{color}` 유틸리티 클래스를 사용할 수 없음
- Tailwind의 기본 색상(blue, red 등)은 가능하지만, 확장된 커스텀 색상(success, danger)은 불가

### 문제 코드
```css
.btn-success {
  @apply btn text-white focus:ring-success-500;
}

.btn-danger {
  @apply btn text-white focus:ring-danger-500;
}
```

### 해결 방법
순수 CSS `box-shadow`로 focus ring 구현:

```css
.btn {
  @apply inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn:focus {
  box-shadow: 0 0 0 2px white, 0 0 0 4px rgba(59, 130, 246, 0.5);
}

.btn-primary:focus {
  box-shadow: 0 0 0 2px white, 0 0 0 4px rgba(59, 130, 246, 0.5);
}

.btn-success:focus {
  box-shadow: 0 0 0 2px white, 0 0 0 4px rgba(34, 197, 94, 0.5);
}

.btn-danger:focus {
  box-shadow: 0 0 0 2px white, 0 0 0 4px rgba(239, 68, 68, 0.5);
}
```

### 결과
- 각 버튼 타입별로 적절한 색상의 focus ring 적용됨
- 접근성이 향상되고 사용자 경험이 개선됨

---

## 에러 4: Border Width 클래스 오류

### 에러 메시지
```
The `border-3` class does not exist.
```

### 원인
- Tailwind CSS는 기본적으로 `border-0`, `border`, `border-2`, `border-4`, `border-8`만 제공
- `border-3`은 존재하지 않는 클래스

### 문제 코드
```css
.spinner {
  @apply inline-block w-5 h-5 border-3 border-current border-t-transparent rounded-full animate-spin;
}
```

### 해결 방법
`border-2`로 변경:

```css
.spinner {
  @apply inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin;
}
```

### 결과
- 스피너 애니메이션이 정상 작동
- 시각적으로 충분한 두께 유지

---

## 에러 5: 커스텀 색상 배경 클래스 사용 불가

### 에러 메시지
```
The `bg-danger-50` class does not exist.
If `bg-danger-50` is a custom class, make sure it is defined within a `@layer` directive.
```

### 원인
- Alert 컴포넌트에서 `@apply`를 통해 커스텀 색상 팔레트(`danger`, `success`)의 배경 클래스를 사용하려 했으나 인식되지 않음
- Tailwind 설정에서 확장된 색상이지만 `@apply` 컨텍스트에서 제대로 참조되지 않음

### 문제 코드
```css
.alert-success {
  @apply alert bg-success-50 border-success-500 text-success-900;
}

.alert-error {
  @apply alert bg-danger-50 border-danger-500 text-danger-900;
}
```

### 해결 방법
순수 CSS 색상 값 직접 지정:

```css
.alert-success {
  @apply alert;
  background-color: #f0fdf4;  /* success-50 */
  border-color: #22c55e;      /* success-500 */
  color: #14532d;             /* success-900 */
  animation: slideDown 0.4s ease-out;
}

.alert-error {
  @apply alert;
  background-color: #fef2f2;  /* danger-50 */
  border-color: #ef4444;      /* danger-500 */
  color: #7f1d1d;             /* danger-900 */
  animation: slideDown 0.4s ease-out;
}
```

### 결과
- 성공 및 에러 알림이 정상적으로 스타일 적용됨
- 색상이 명확하게 표시됨

---

## 에러 6: 중첩 클래스에서 커스텀 애니메이션 사용 불가

### 에러 메시지
```
The `animate-slide-down` class does not exist.
If `animate-slide-down` is a custom class, make sure it is defined within a `@layer` directive.
```

### 원인
- `.alert` 기본 클래스에 `animate-slide-down` 포함
- `.alert-error` 등이 `@apply alert`로 상속받을 때 커스텀 애니메이션 클래스가 중첩 컨텍스트에서 인식되지 않음
- Tailwind의 `@apply`는 중첩된 커스텀 클래스 해석에 제한이 있음

### 문제 코드
```css
.alert {
  @apply px-4 py-3 rounded-xl border-l-4 mb-4 animate-slide-down;
}

.alert-error {
  @apply alert;  /* alert의 animate-slide-down이 인식 안 됨 */
  background-color: #fef2f2;
  border-color: #ef4444;
  color: #7f1d1d;
}
```

### 해결 방법
기본 클래스에서 애니메이션 제거하고 각 변형에 직접 적용:

```css
.alert {
  @apply px-4 py-3 rounded-xl border-l-4 mb-4;
}

.alert-success {
  @apply alert;
  background-color: #f0fdf4;
  border-color: #22c55e;
  color: #14532d;
  animation: slideDown 0.4s ease-out;  /* 직접 적용 */
}

.alert-error {
  @apply alert;
  background-color: #fef2f2;
  border-color: #ef4444;
  color: #7f1d1d;
  animation: slideDown 0.4s ease-out;  /* 직접 적용 */
}

.alert-info {
  @apply alert bg-primary-50 border-primary-500 text-primary-900;
  animation: slideDown 0.4s ease-out;  /* 직접 적용 */
}
```

### 결과
- 모든 alert 변형에서 애니메이션이 정상 작동
- 중첩 클래스 문제 완전 해결

---

## 핵심 교훈

### Tailwind CSS `@apply` 사용 시 제한사항

1. **그라데이션 클래스 제한**
   - `from-{color}`, `to-{color}` 같은 그라데이션 유틸리티는 `@apply`에서 사용 불가
   - 해결: 순수 CSS `linear-gradient` 사용

2. **커스텀 색상 유틸리티 제한**
   - 확장된 커스텀 색상 팔레트의 일부 유틸리티는 `@apply` 컨텍스트에서 인식 안 됨
   - 해결: 직접 색상 값(hex code) 사용

3. **중첩 클래스와 커스텀 애니메이션**
   - `@apply`로 상속받는 클래스에 커스텀 애니메이션이 포함되면 문제 발생
   - 해결: 각 클래스에 애니메이션 직접 적용

4. **Focus Ring 제한**
   - `focus:ring-{custom-color}` 형태는 커스텀 색상에서 작동 안 함
   - 해결: `box-shadow`로 직접 구현

### 권장 사항

#### ✅ 안전한 방법
```css
.my-component {
  @apply px-4 py-2 rounded-lg;
  background: linear-gradient(to right, #3b82f6, #2563eb);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
```

#### ❌ 피해야 할 방법
```css
.my-component {
  @apply px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 focus:ring-primary-500;
}
```

---

## 최종 빌드 결과

### 빌드 성공
```bash
✓ built in 1.69s
dist/index.html                   0.48 kB
dist/assets/index-Ca5Toeqw.css   55.61 kB
dist/assets/index-cIKaMc-a.js   760.71 kB
```

### 개발 서버 정상 작동
```bash
VITE v5.4.21 ready in 216 ms
➜  Local:   http://localhost:5174/
```

---

## 적용된 개선 사항

### 디자인 시스템
- ✅ 따뜻하고 친근한 색상 팔레트
- ✅ 부드러운 애니메이션 시스템
- ✅ 재사용 가능한 컴포넌트 클래스
- ✅ 반응형 레이아웃
- ✅ 접근성 향상 (focus rings, ARIA labels)

### 사용자 경험
- ✅ 로딩 스켈레톤 UI
- ✅ 친근한 에러/빈 상태 메시지
- ✅ 이모지를 활용한 감성적 소통
- ✅ 명확한 시각적 피드백
- ✅ 매끄러운 전환 효과

---

## 참고 문서

- [Tailwind CSS - Using @apply](https://tailwindcss.com/docs/reusing-styles#extracting-classes-with-apply)
- [Tailwind CSS - Customizing Colors](https://tailwindcss.com/docs/customizing-colors)
- [Tailwind CSS - Animation](https://tailwindcss.com/docs/animation)

---

**작성일**: 2025-11-20
**프로젝트**: it-audit-qna
**기술 스택**: React + Vite + TypeScript + Tailwind CSS
