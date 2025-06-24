# GanziCorp 공식 홈페이지

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.1.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

> 혁신적인 기술 솔루션을 제공하는 GanziCorp의 공식 웹사이트

## 🎥 데모 & 스크린샷

- **라이브 데모**: [https://ganzicorp-homepage.vercel.app](https://ganzicorp-homepage.vercel.app)

### 홈페이지 미리보기
![홈페이지 스크린샷](./docs/images/homepage-screenshot.png)

### 관리자 대시보드
![관리자 대시보드](./docs/images/admin-dashboard.png)

## 🚀 기술 스택

- **Frontend**: Next.js 15.1.0, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI
- **Backend**: Supabase (Authentication, Database)
- **Deployment**: Vercel
- **Package Manager**: pnpm

## ✨ 주요 기능

### 🏠 메인 페이지
- 🎨 현대적이고 반응형 디자인
- 🚀 빠른 로딩 속도 (Next.js 15 최적화)
- 📱 모바일 친화적 UI/UX

### 🔐 인증 시스템
- Supabase 기반 사용자 인증
- 이메일/비밀번호 로그인
- JWT 토큰 기반 세션 관리

### 📝 콘텐츠 관리
- 공지사항 CRUD (생성, 읽기, 수정, 삭제)
- 마크다운 지원 텍스트 편집
- 🚧 이미지 업로드 및 관리 (개발 예정)

### 📞 고객 지원
- 실시간 문의 폼
- 관리자 응답 시스템
- 🚧 이메일 알림 기능 (개발 예정)

### 👨‍💼 관리자 기능
- 통합 관리자 대시보드
- 사용자 관리(개발 예정)
- 통계 및 분석 데이터
- 콘텐츠 승인 워크플로우

## ⚡ 성능 & SEO

### ✅ 구현 완료된 SEO 기능
- **메타 태그**: 페이지별 동적 title, description, Open Graph 설정
- **구조화된 데이터**: JSON-LD 스키마 (Organization, WebSite)
- **사이트맵**: 자동 생성되는 sitemap.xml
- **Robots.txt**: 검색 엔진 크롤링 최적화
- **이미지 최적화**: Next.js Image 컴포넌트 활용
- **반응형 디자인**: 모든 디바이스 대응

### 🔧 성능 최적화 적용사항
- **번들 최적화**: Next.js 15 자동 코드 스플리팅
- **서버 컴포넌트**: 클라이언트 사이드 JavaScript 최소화
- **Tailwind CSS**: 자동 미사용 스타일 제거
- **TypeScript**: 타입 안전성과 개발 최적화

### 📊 성능 측정 필요
- Lighthouse 점수 측정 예정
- Core Web Vitals 모니터링 예정
- 실제 사용자 환경에서의 성능 테스트 예정

## 🛠️ 설치 및 실행

### 필수 요구사항

- Node.js 18.0.0 이상
- pnpm 8.0.0 이상
- Supabase 계정

### 개발 환경 설정

1. **저장소 클론 및 설치**
```bash
git clone https://github.com/ganzi324/ganzicorp-homepage.git
cd ganzicorp-homepage
pnpm install
```

2. **Supabase 프로젝트 설정**
   - [Supabase](https://supabase.com)에서 새 프로젝트 생성
   - 데이터베이스 스키마 실행 (아래 SQL 스크립트 참조)
   - API 키 및 URL 확인

3. **환경 변수 설정**
```bash
cp .env.example .env.local
```

4. **데이터베이스 초기화**
```bash
# Supabase CLI 설치 (선택사항)
npm install -g @supabase/cli
supabase db reset
```

5. **개발 서버 실행**
```bash
pnpm dev
```

### 환경 변수 설정

`.env.local` 파일에 다음 환경 변수들을 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

개발 서버가 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 📁 프로젝트 구조

```
ganzi-homepage/
├── src/
│   ├── app/                 # Next.js 15 App Router
│   │   ├── (auth)/         # 인증 관련 페이지
│   │   ├── admin/          # 관리자 페이지
│   │   ├── api/            # API 라우트
│   │   └── globals.css     # 전역 스타일
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── auth/          # 인증 관련 컴포넌트
│   │   ├── layout/        # 레이아웃 컴포넌트
│   │   ├── seo/           # SEO 관련 컴포넌트
│   │   └── ui/            # UI 컴포넌트 (Shadcn)
│   ├── lib/               # 유틸리티 함수
│   └── hooks/             # 커스텀 React 훅
├── public/                # 정적 파일
├── .taskmaster/           # 프로젝트 관리 파일
└── docs/                  # 문서
```

## 🗄️ 데이터베이스 스키마

### Users 테이블
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Notices 테이블
```sql
CREATE TABLE notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Inquiries 테이블
```sql
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR,
  subject VARCHAR NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR DEFAULT 'pending',
  admin_response TEXT,
  admin_response_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 배포

### Vercel 배포

1. GitHub에 저장소 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 import
3. 환경 변수 설정
4. 배포 완료

환경 변수는 Vercel 대시보드에서 설정해야 합니다.

## 🧪 테스트

```bash
# 타입 체크
pnpm type-check

# 린트 검사
pnpm lint

# 빌드 테스트
pnpm build
```

## 📝 개발 가이드

### 코드 스타일
- TypeScript 엄격 모드 사용
- ESLint + Prettier 설정 준수
- Tailwind CSS 유틸리티 클래스 사용

### 컴포넌트 개발
- 서버 컴포넌트 우선 사용
- 필요시에만 클라이언트 컴포넌트 사용
- Shadcn UI 컴포넌트 활용

### API 개발
- Next.js App Router API 라우트 사용
- Supabase 클라이언트를 통한 데이터베이스 접근
- 적절한 에러 처리 및 상태 코드 반환