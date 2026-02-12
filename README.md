# ก Nuvibe - FrontEnd
> ✨ **Tag Your Own Vibe, Drop The Vibe!**

NuVibe는 이미지를 태그로 기록해 취향을 쌓고, 같은 감각을 가진 사람들과 연결되는 아카이브 기반 네트워킹 서비스입니다.

<img src="https://github.com/user-attachments/assets/90c050b2-896e-4173-bebc-b408cccb89c8">  

## 🔥 Frontend 핵심 기능 (Core Features)
1. **Vibe Drop (신속한 기록과 태깅)**
    - 카메라와 태그 시스템을 결합해 찰나의 감각형 데이터를 빠르게 아카이빙하는 **QuickDrop** 플로우를 구현했습니다.
    - `React Hook Form`과 `Zod`를 활용하여 데이터의 정합성을 보장하고 사용자 경험을 최적화했습니다.
2. **Interactive Recap (시각적 리캡 경험)**
    - `Matter.js` 물리 엔진을 도입하여 기록된 이미지들이 중력에 따라 쌓이고 반응하는 **Vibetone** 시각화 기능을 구현했습니다.
    - 정적인 리스트를 넘어, '취향이 쌓이는 느낌'을 입체적으로 체감할 수 있는 인터랙티브 UI를 제공합니다.

3. **Digital Darkroom (내장 이미지 편집 시스템)**
    - `react-easy-crop`을 커스텀하여 앱 내에서 즉각적인 구도 조정과 스타일 편집이 가능한 독자적인 이미지 에디터를 구축했습니다.

4. **Tribe Connectivity (취향 기반 실시간 소통)**
    - 특정 태그(취향)를 매개로 유저들이 모이는 **Tribe** 공간과 **Firebase** 기반의 실시간 채팅/알림 시스템을 연동했습니다.
    - `TanStack Query`를 통한 낙관적 업데이트(Optimistic Update)를 적용하여 매끄러운 사용자 인터랙션을 유지합니다.  

## 👥 프로젝트 팀원 (Contributors)
<table border="1" cellspacing="0" cellpadding="0" width="900" align="center" style="border-collapse: collapse;">
  <tr>
    <td align="center" width="300" style="padding: 18px;">
      <img src="https://github.com/j2nooh.png?size=260" width="220" height="220" alt="홍진우"/>
    </td>
    <td align="center" width="300" style="padding: 18px;">
      <img src="https://github.com/9dongs.png?size=260" width="220" height="220" alt="구동현"/>
    </td>
    <td align="center" width="300" style="padding: 18px;">
      <img src="https://github.com/dorhyory.png?size=260" width="220" height="220" alt="김민재"/>
    </td>
  </tr>
  <tr>
    <td align="center" style="padding: 14px;">
      <b>홍진우</b><br/>
      <a href="https://github.com/j2nooh">@j2nooh</a>
    </td>
    <td align="center" style="padding: 14px;">
      <b>구동현</b><br/>
      <a href="https://github.com/9dongs">@9dongs</a>
    </td>
    <td align="center" style="padding: 14px;">
      <b>김민재</b><br/>
      <a href="https://github.com/dorhyory">@dorhyory</a>
    </td>
  </tr>
  <tr>
    <td align="center" style="padding: 12px;">
      <b>Frontend Lead</b>
    </td>
    <td align="center" style="padding: 12px;">
      <b>Frontend</b>
    </td>
    <td align="center" style="padding: 12px;">
      <b>Frontend</b>
    </td>
  </tr>
</table>  

## ⚙ 기술 스택 (Tech Stack)

| 역할 | 종류 | 선정 근거 |
| :--- | :--- | :--- |
| **Language & Framework** | <img src="https://img.shields.io/badge/TYPESCRIPT-3178C6?style=flat-square&logo=typescript&logoColor=white"/> <img src="https://img.shields.io/badge/REACT-61DAFB?style=flat-square&logo=react&logoColor=white"/> <img src="https://img.shields.io/badge/VITE-646CFF?style=flat-square&logo=vite&logoColor=white"/> | **TypeScript**로 타입 안정성을 확보하고, **React** 기반 컴포넌트 UI를 구성했으며, **Vite**의 빠른 번들링과 HMR로 개발 생산성을 높였습니다. |
| **Styling** | <img src="https://img.shields.io/badge/TAILWINDCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white"/> | **Tailwind CSS**의 유틸리티 기반 스타일링으로 빠르고 일관된 디자인 시스템을 구현했습니다. |
| **State Management** | <img src="https://img.shields.io/badge/Zustand-FF8800?style=flat-square&logo=Zustand&logoColor=white"/> <img src="https://img.shields.io/badge/TanStack%20Query-FF4154?style=flat-square&logo=reactquery&logoColor=white"/> <img src="https://img.shields.io/badge/immer-FF8800?style=flat-square&logo=immer&logoColor=white"/> | **Zustand**로 단순하고 직관적인 전역 상태 관리를, **TanStack Query**로 서버 상태(캐싱/동기화/재시도)를 효율적으로 처리했습니다. 불변성 관리는 **Immer**를 활용했습니다. |
| **Data Fetching** | <img src="https://img.shields.io/badge/axios-5A29E4?style=flat-square&logo=axios&logoColor=white"/> | **Axios**를 통해 HTTP 요청을 처리하고, **TanStack Query**와 조합하여 선언적인 데이터 페칭 및 동기화를 수행했습니다. |
| **Router & Form** | <img src="https://img.shields.io/badge/REACT ROUTER-CA4245?style=flat-square&logo=reactrouter&logoColor=white"/> <img src="https://img.shields.io/badge/REACT HOOK FORM-EC5990?style=flat-square&logo=reacthookform&logoColor=white"/> | SPA 라우팅을 위해 **React Router**를 사용하며, 복잡한 폼 로직과 유효성 검사는 **React Hook Form**으로 최적화했습니다. |
| **Validation** | <img src="https://img.shields.io/badge/ZOD-408AFF?style=flat-square&logo=zod&logoColor=white"/> | API 응답 및 폼 입력값의 런타임 안정성을 위해 스키마 기반 검증 도구인 **Zod**를 적용했습니다. |
| **Animation & UI** | <img src="https://img.shields.io/badge/FRAMER MOTION-1E5397?style=flat-square&logo=framermotion&logoColor=white"/> <img src="https://img.shields.io/badge/SWIPER-6332F6?style=flat-square&logo=swiper&logoColor=white"/> <img src="https://img.shields.io/badge/matter.js-4B5562?style=flat-square&logo=matterjs&logoColor=white"/> | **Framer Motion**으로 인터랙티브한 애니메이션을, **Swiper**로 슬라이드 레이아웃을, **Matter.js**로 물리 엔진 기반의 동적 요소를 구현했습니다. |
| **Utilities** | <img src="https://img.shields.io/badge/date fns-770C56?style=flat-square&logo=datefns&logoColor=white"/> <img src="https://img.shields.io/badge/htmltoimage-E72429?style=flat-square&logo=htmltoimage&logoColor=white"/> <img src="https://img.shields.io/badge/react intersection observer-FF4154?style=flat-square&logo=reactintersectionobserver&logoColor=white"/> <img src="https://img.shields.io/badge/REACT%20EASY%20CROP-00CBC6?style=flat-square"> | 날짜 처리에 **date-fns**, 캔버스 이미지 저장에 **html-to-image**, 무한 스크롤 및 노출 감지에 **Intersection Observer**, 이미지 편집에 **Easy Crop**을 사용했습니다. |
| **Dev Tools** | <img src="https://img.shields.io/badge/vconsole-1E1E28?style=flat-square&logo=vconsole&logoColor=white"/> | 모바일 환경에서의 디버깅을 원활하게 하기 위해 **vConsole**을 도입했습니다. |
| **Infrastructure** | <img src="https://img.shields.io/badge/firebase-DD2C00?style=flat-square&logo=firebase&logoColor=white"/> | 모바일 푸시 알림 및 구글 로그인을 포함한 백엔드 인프라 활용을 위해 **Firebase**를 연동했습니다. |


## 📂 프로젝트 구조 (Project Structure)

```bash
FE/
├── public/                # 정적 자원 (Logo 등)
├── src/
│   ├── apis/              # API 통신 및 인터셉터 설정
│   │   ├── archive-board/ # 아카이브 보드 관련 API
│   │   ├── tribe-chat/    # 트라이브 채팅 관련 API
│   │   ├── auth.ts        # 로그인, 회원가입 등 인증 API
│   │   └── axios.ts       # Axios 인스턴스 및 인터셉터
│   ├── assets/            # 정적 리소스 (고화질 이미지, SVG 아이콘)
│   ├── components/        # 재사용 및 기능 단위 컴포넌트
│   │   ├── common/        # 공통 UI (Button, Header, BottomSheet 등)
│   │   ├── features/      # 특정 기능 단위 (ImageEditor, TagSelector 등)
│   │   └── etc...         # 각 페이지별 특화 컴포넌트 폴더
│   ├── constants/         # 상수 값 및 설정 데이터
│   ├── context/           # 전역 상태를 위한 Context API (AuthContext)
│   ├── hooks/             # 커스텀 훅 모음 (queries, mutation 포함)
│   ├── layouts/           # 페이지 공통 레이아웃 (MainLayout, AuthLayout)
│   ├── pages/             # 페이지 레벨 컴포넌트
│   │   ├── home/          # 대시보드 및 홈 화면
│   │   ├── archive-board/ # 아카이브 리스트 및 상세/리캡(Vibetone)
│   │   ├── tribe-chat/    # 트라이브 채팅방 및 채팅 레이아웃
│   │   └── onboarding/    # 로그인, 약관동의, 회원가입 플로우
│   ├── styles/            # 전역 스타일 및 Tailwind 설정
│   ├── types/             # 전역 TypeScript 인터페이스 정의
│   └── utils/             # 날짜 포맷 등 저수준 유틸리티 함수
├── .env                   # 환경 변수 설정
├── package.json           # 프로젝트 의존성 및 스크립트
└── vite.config.ts         # Vite 빌드 및 플러그인 설정
```  

## 🔗 Migration History

본 프로젝트는 원활한 협업을 위해 기존 프론트엔드 전용 레포지토리인 [nuvibe_frontend](https://github.com/j2nooh/nuvibe_frontend)를 통합하여 관리하고 있습니다.

- **이전 날짜:** 2026.01.06

- **이전 사유:** FE-BE 간 프로젝트 관리 일원화 및 작업 효율 극대화

- **작업 내용:** 기존 FE 전용 레포지토리의 커밋 히스토리 이관 및 환경 설정 최적화  

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
