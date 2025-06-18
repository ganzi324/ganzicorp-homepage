# GanziCorp 공식 홈페이지

> 혁신적인 기술 솔루션을 제공하는 GanziCorp의 공식 웹사이트

## 🚀 기술 스택

- **Frontend**: Next.js 15.1.0, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI
- **Backend**: Supabase (Authentication, Database)
- **Deployment**: Vercel
- **Package Manager**: pnpm

## ✨ 주요 기능

- 🎨 현대적이고 반응형 디자인
- 🔐 Supabase 기반 인증 시스템
- 📝 공지사항 관리 시스템 (CRUD)
- 📞 연락처 폼 및 문의 관리
- 👨‍💼 관리자 대시보드
- 🔍 SEO 최적화
- 📱 모바일 친화적 UI

## 🛠️ 설치 및 실행

### 필수 요구사항

- Node.js 18.0.0 이상
- pnpm 8.0.0 이상
- Supabase 계정

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-username/ganzi-homepage.git
cd ganzi-homepage

# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 편집하여 실제 값으로 변경
```

### 환경 변수 설정

`.env.local` 파일에 다음 환경 변수들을 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 개발 서버 실행

```bash
pnpm dev
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

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 연락처

- **회사**: GanziCorp
- **웹사이트**: [https://ganzicorp.com](https://ganzicorp.com)
- **이메일**: contact@ganzicorp.com

---

**GanziCorp** - 혁신적인 기술 솔루션으로 비즈니스의 미래를 만들어갑니다. 