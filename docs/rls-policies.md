# Row Level Security (RLS) 정책 문서

## 개요
Supabase 데이터베이스에 적용된 Row Level Security 정책에 대한 상세 설명입니다.

## 📋 **notices 테이블 정책**

### 1. "Anyone can read published notices"
- **유형**: SELECT
- **대상**: 모든 사용자 (인증되지 않은 사용자 포함)
- **조건**: `is_published = true`
- **설명**: 게시된 공지사항만 누구나 조회할 수 있습니다.

### 2. "Authenticated users can manage notices"
- **유형**: ALL (SELECT, INSERT, UPDATE, DELETE)
- **대상**: 인증된 사용자만
- **조건**: `auth.role() = 'authenticated'`
- **설명**: 관리자(인증된 사용자)만 공지사항을 생성, 수정, 삭제할 수 있습니다.

## 📧 **inquiries 테이블 정책**

### 1. "Anyone can create inquiries"
- **유형**: INSERT
- **대상**: 모든 사용자
- **조건**: `true` (제한 없음)
- **설명**: 누구나 문의사항을 생성할 수 있습니다.

### 2. "Only authenticated users can read inquiries"
- **유형**: SELECT
- **대상**: 인증된 사용자만
- **조건**: `auth.role() = 'authenticated'`
- **설명**: 관리자만 문의사항을 조회할 수 있습니다.

### 3. "Only authenticated users can update inquiries"
- **유형**: UPDATE
- **대상**: 인증된 사용자만
- **조건**: `auth.role() = 'authenticated'`
- **설명**: 관리자만 문의사항을 수정할 수 있습니다 (답변 등).

## 🔒 **보안 특징**

### 공지사항 (notices)
- ✅ **공개 읽기**: 게시된 공지사항은 누구나 조회 가능
- 🔒 **관리자 전용**: 모든 관리 작업은 인증된 사용자만 가능
- 🚫 **미게시 보호**: 미게시 공지사항은 일반 사용자에게 숨겨짐

### 문의사항 (inquiries)
- ✅ **자유 생성**: 누구나 문의사항 작성 가능 (고객 접근성)
- 🔒 **관리자 전용**: 조회 및 수정은 관리자만 가능 (개인정보 보호)
- 📧 **프라이버시**: 일반 사용자는 다른 사용자의 문의사항 조회 불가

## 🧪 **테스트 결과**

### RLS 정책 테스트 API: `/api/test-rls`
- **공지사항 조회**: ✅ 게시된 2개만 반환 (미게시 1개 숨김)
- **문의사항 조회**: ✅ anon 사용자는 0개 조회 (인증 필요)
- **문의사항 생성**: ✅ 성공적으로 생성됨

## 🔧 **구현 세부사항**

### 인증 상태 확인
```sql
auth.role() = 'authenticated'  -- 인증된 사용자
auth.role() = 'anon'          -- 익명 사용자
```

### 정책 적용 순서
1. RLS 활성화 (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)
2. 정책 생성 (`CREATE POLICY ...`)
3. 정책 테스트 및 검증

### 주의사항
- Service Role Key 사용 시 RLS 정책이 우회됩니다
- Anon Key 사용 시 모든 RLS 정책이 적용됩니다
- 정책 변경 후 클라이언트 재연결이 필요할 수 있습니다

## 📚 **관련 문서**
- [Supabase RLS 공식 문서](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS 문서](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) 