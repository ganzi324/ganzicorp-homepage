# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. "New Project" 버튼 클릭
3. 프로젝트 정보 입력:
   - **Name**: `ganzicorp-homepage`
   - **Database Password**: 강력한 비밀번호 설정
   - **Region**: `Northeast Asia (Seoul)` 또는 가장 가까운 지역
4. "Create new project" 버튼 클릭
5. 프로젝트 생성 완료까지 2-3분 대기

## 2. 데이터베이스 테이블 생성

1. Supabase Dashboard에서 "SQL Editor" 탭으로 이동
2. `docs/database-schema.sql` 파일의 내용을 복사
3. SQL Editor에 붙여넣기 후 "RUN" 버튼 클릭
4. 테이블 생성 및 RLS 정책 설정 완료 확인

## 3. API 키 확인 및 환경 변수 설정

1. Supabase Dashboard에서 "Settings" → "API" 탭으로 이동
2. 다음 정보 복사:
   - **Project URL**: `https://your-project.supabase.co`
   - **anon public key**: `eyJ...` (공개 키)
   - **service_role key**: `eyJ...` (서비스 키, 보안 중요!)

3. 프로젝트 루트에 `.env.local` 파일 생성:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## 4. 연결 테스트

1. 개발 서버 재시작: `pnpm dev`
2. 브라우저에서 `/api/test-supabase` 접속하여 연결 확인
3. 데이터베이스 연결 성공 메시지 확인

## 5. 테이블 구조

### notices (공지사항)
- `id`: UUID (Primary Key)
- `title`: 제목 (VARCHAR 255)
- `content`: 내용 (TEXT)
- `created_at`: 생성일시
- `updated_at`: 수정일시
- `is_published`: 게시 여부 (BOOLEAN)
- `author_id`: 작성자 ID (UUID, auth.users 참조)

### inquiries (문의사항)
- `id`: UUID (Primary Key)
- `name`: 이름 (VARCHAR 100)
- `email`: 이메일 (VARCHAR 255)
- `subject`: 제목 (VARCHAR 255)
- `message`: 내용 (TEXT)
- `created_at`: 생성일시
- `status`: 상태 ('pending', 'in_progress', 'resolved')
- `response`: 답변 내용 (TEXT)
- `responded_at`: 답변일시

## 6. Row Level Security (RLS) 정책

- **공지사항**: 게시된 공지사항은 모든 사용자가 읽기 가능, 관리는 인증된 사용자만
- **문의사항**: 작성은 누구나 가능, 조회/수정은 관리자만 가능

## 7. 다음 단계

1. API 라우트 생성 (`/api/notices`, `/api/inquiries`)
2. 공지사항 및 문의사항 컴포넌트 개발
3. 관리자 인증 시스템 구현 (선택사항) 