# ก Nuvibe

<p> NuVibe는 이미지를 태그로 기록해 취향을 쌓고, 같은 감각을 가진 사람들과 연결되는 아카이브 기반 네트워킹 서비스입니다. </p>

## ⚙ 기술 스택

<p>
  <img src="https://img.shields.io/badge/TYPESCRIPT-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/REACT-61DAFB?style=flat-square&logo=react&logoColor=white"/>
  <img src="https://img.shields.io/badge/VITE-646CFF?style=flat-square&logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/TAILWINDCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white"/>
  <br />
  <img src="https://img.shields.io/badge/REACT ROUTER-CA4245?style=flat-square&logo=reactrouter&logoColor=white"/>
  <img src="https://img.shields.io/badge/REACT HOOK FORM-EC5990?style=flat-square&logo=reacthookform&logoColor=white"/>
  <img src="https://img.shields.io/badge/ZOD-408AFF?style=flat-square&logo=zod&logoColor=white"/>
  <img src="https://img.shields.io/badge/SWIPER-6332F6?style=flat-square&logo=swiper&logoColor=white"/>
  <img src="https://img.shields.io/badge/FRAMER MOTION-1E5397?style=flat-square&logo=framermotion&logoColor=white"/>
  <img src="https://img.shields.io/badge/Zustand-FF8800?style=flat-square&logo=Zustand&logoColor=white"/>
  <img src="https://img.shields.io/badge/immer-FF8800?style=flat-square&logo=immer&logoColor=white"/>
  <img src="https://img.shields.io/badge/date fns-770C56?style=flat-square&logo=datefns&logoColor=white"/>
  <img src="https://img.shields.io/badge/matter js-4B5562?style=flat-square&logo=matterjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/html2canvas-E72429?style=flat-square&logo=html2canvas&logoColor=white"/>
  <img src="https://img.shields.io/badge/axios-5A29E4?style=flat-square&logo=axios&logoColor=white"/>
  <img src="https://img.shields.io/badge/tanstack-000000?style=flat-square&logo=tanstack&logoColor=white"/>
</p>
  
## 📌 GitHub Convention
### 📝 Commit
- 작은 단위로 커밋, 유형은 **영어 대문자** 작성

| Type       | Description              |
| ---------- | ------------------------ |
| `Feat`     | 새로운 기능 추가         |
| `Fix`      | 버그 수정                |
| `Docs`     | 문서 수정                |
| `Style`    | 포맷팅, 세미콜론 누락 등 |
| `Refactor` | 코드 리팩토링            |
| `Test`     | 테스트 코드              |
| `Chore`    | 패키지 매니저, 기타 수정 |
| `Design`   | UI 디자인 변경           |
| `Comment`  | 주석 추가 및 변경        |
| `Rename`   | 파일/폴더명 변경         |
| `Remove`   | 파일 삭제                |

### 🔀 Branch (Gitflow)

- `main`: 배포
- `develop`: 개발 (main에서 분기)
- `feature/기능명`: 기능 개발 (develop에서 분기)
- `hotfix/수정사항`: 긴급 수정 (main에서 분기)

### 🔃 Pull Request

- **제목**: 커밋 유형 대문자 작성 (예: `FEAT, FIX: 로그인 기능 구현`)
- **내용**: PR 이유, 작업 내용, 스크린샷(선택), 리뷰 요구사항
- **규칙**: 하나의 PR에 커밋 3~10개 권장

## 📌 Code Convention

- 쌍따옴표(""), 세미콜론(;) 사용
- camelCase (함수, 변수), PascalCase (클래스, 타입, 인터페이스, 생성자 등)
- 연산자/콤마 뒤 공백, 한 줄에 한 문장
- 경로: `src/assets/` → `@/assets/` 사용
- 최상위 파일 수정 시 팀 공유

### 파일/폴더 명명 규칙

- 폴더명: `kebab-case` 소문자 (예: `user-profile`)
- 파일명: `kebab-case` (예: `user-service.ts`)
- `.tsx` 파일: `PascalCase` (예: `UserProfile.tsx`)
