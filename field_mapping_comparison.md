# API 인터페이스와 프론트엔드 코드 필드 매핑 비교

## 📋 **1. INQUIRIES 테이블 필드 매핑**

### 🗄️ **데이터베이스 스키마 (현재 테이블 구조)**
```sql
CREATE TABLE public.inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(100),
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    inquiry_type VARCHAR(50) DEFAULT 'general',
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### 🔗 **필드 매핑 비교표**

| 필드명 | 데이터베이스 | API 인터페이스 | 프론트엔드 폼 | TypeScript 인터페이스 | 상태 |
|--------|-------------|---------------|-------------|-------------------|------|
| **id** | `UUID PRIMARY KEY` | ✅ 사용됨 | ❌ 폼에서 미사용 | ✅ `string` | ✅ 일치 |
| **name** | `VARCHAR(100) NOT NULL` | ✅ 필수 검증 | ✅ 필수 입력 (최소 2자) | ✅ `string` | ✅ 일치 |
| **email** | `VARCHAR(255) NOT NULL` | ✅ 필수 검증 | ✅ 필수 입력 (이메일 형식) | ✅ `string` | ✅ 일치 |
| **company** | `VARCHAR(100)` | ✅ 선택적 | ✅ 선택적 입력 | ✅ `string?` | ✅ 일치 |
| **phone** | `VARCHAR(20)` | ✅ 선택적 | ✅ 선택적 입력 | ✅ `string?` | ✅ 일치 |
| **subject** | `VARCHAR(200) NOT NULL` | ✅ 필수 검증 | ✅ 필수 선택 | ✅ `string` | ✅ 일치 |
| **message** | `TEXT NOT NULL` | ✅ 필수 검증 | ✅ 필수 입력 (최소 10자) | ✅ `string` | ✅ 일치 |
| **inquiry_type** | `VARCHAR(50) DEFAULT 'general'` | ✅ 기본값 설정 | ✅ Contact 폼에서 'contact_form' | ✅ `string?` | ✅ 일치 |
| **status** | `VARCHAR(20) DEFAULT 'new'` | ⚠️ **불일치** | ❌ 폼에서 미사용 | ⚠️ **불일치** | ❌ **문제** |
| **admin_notes** | `TEXT` | ❌ API에서 미사용 | ❌ 폼에서 미사용 | ❌ 인터페이스 누락 | ⚠️ 누락 |
| **created_at** | `TIMESTAMPTZ DEFAULT NOW()` | ✅ 자동 생성 | ❌ 폼에서 미사용 | ✅ `string` | ✅ 일치 |
| **updated_at** | `TIMESTAMPTZ DEFAULT NOW()` | ✅ 자동 업데이트 | ❌ 폼에서 미사용 | ✅ `string?` | ✅ 일치 |
| **response** | ❌ **DB에 없음** | ❌ API에서 미사용 | ❌ 폼에서 미사용 | ✅ **인터페이스에만 존재** | ❌ **문제** |
| **responded_at** | ❌ **DB에 없음** | ❌ API에서 미사용 | ❌ 폼에서 미사용 | ✅ **인터페이스에만 존재** | ❌ **문제** |

### 🚨 **STATUS 필드 불일치 문제**

| 컨텍스트 | 사용하는 상태 값 | 위치 |
|---------|----------------|------|
| **데이터베이스** | `'new', 'in_progress', 'resolved', 'closed'` | `supabase_dashboard_reset.sql` |
| **API 검증** | `'pending', 'in_progress', 'resolved', 'cancelled'` | `src/app/api/admin/inquiries/[id]/route.ts:75` |
| **TypeScript 인터페이스** | `'pending', 'in_progress', 'resolved'` | `src/lib/supabase.ts:35` |
| **Contact API** | `'pending'` (기본값) | `src/app/api/contact/route.ts:48` |
| **Admin API** | `'pending'` (기본값) | `src/app/api/admin/inquiries/route.ts:83` |

---

## 📋 **2. NOTICES 테이블 필드 매핑**

### 🗄️ **데이터베이스 스키마 (현재 테이블 구조)**
```sql
CREATE TABLE public.notices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    is_published BOOLEAN DEFAULT false,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### 🔗 **필드 매핑 비교표**

| 필드명 | 데이터베이스 | API 인터페이스 | 프론트엔드 폼 | TypeScript 인터페이스 | 상태 |
|--------|-------------|---------------|-------------|-------------------|------|
| **id** | `UUID PRIMARY KEY` | ✅ 사용됨 | ❌ 폼에서 미사용 | ✅ `string` | ✅ 일치 |
| **title** | `TEXT NOT NULL` | ✅ 필수 검증 | ✅ 필수 입력 (1-200자) | ✅ `string` | ✅ 일치 |
| **content** | `TEXT NOT NULL` | ✅ 필수 검증 | ✅ 필수 입력 (1-10000자) | ✅ `string` | ✅ 일치 |
| **excerpt** | `TEXT` | ❌ API에서 미사용 | ❌ 폼에서 미사용 | ❌ 인터페이스 누락 | ⚠️ 누락 |
| **is_published** | `BOOLEAN DEFAULT false` | ✅ `is_published` | ✅ `published` (boolean) | ✅ `boolean` | ⚠️ 필드명 차이 |
| **author_id** | `UUID REFERENCES profiles(id)` | ❌ API에서 미사용 | ❌ 폼에서 미사용 | ✅ `string?` | ⚠️ 미사용 |
| **created_at** | `TIMESTAMPTZ DEFAULT NOW()` | ✅ 자동 생성 | ❌ 폼에서 미사용 | ✅ `string` | ✅ 일치 |
| **updated_at** | `TIMESTAMPTZ DEFAULT NOW()` | ✅ 자동 업데이트 | ❌ 폼에서 미사용 | ✅ `string` | ✅ 일치 |
| **views** | ❌ **DB에 없음** | ✅ 조회수 증가 로직 | ❌ 폼에서 미사용 | ❌ 인터페이스 누락 | ❌ **문제** |

---

## 📋 **3. PROFILES 테이블 필드 매핑**

### 🗄️ **데이터베이스 스키마 (현재 테이블 구조)**
```sql
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE,
    role user_role DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
```

### 🔗 **필드 매핑 비교표**

| 필드명 | 데이터베이스 | API 인터페이스 | 프론트엔드 폼 | TypeScript 인터페이스 | 상태 |
|--------|-------------|---------------|-------------|-------------------|------|
| **id** | `UUID PRIMARY KEY` | ✅ 사용됨 | ❌ 폼에서 미사용 | ❌ 인터페이스 누락 | ⚠️ 누락 |
| **full_name** | `TEXT` | ❌ API에서 미사용 | ✅ SignUp 폼에서 사용 | ❌ 인터페이스 누락 | ⚠️ 불일치 |
| **email** | `TEXT UNIQUE` | ❌ API에서 미사용 | ✅ 로그인/회원가입 폼 | ❌ 인터페이스 누락 | ⚠️ 불일치 |
| **role** | `user_role ENUM` | ✅ 권한 검증에 사용 | ❌ 폼에서 미사용 | ❌ 인터페이스 누락 | ⚠️ 불일치 |
| **created_at** | `TIMESTAMPTZ DEFAULT NOW()` | ✅ 자동 생성 | ❌ 폼에서 미사용 | ❌ 인터페이스 누락 | ⚠️ 누락 |
| **updated_at** | `TIMESTAMPTZ DEFAULT NOW()` | ✅ 자동 업데이트 | ❌ 폼에서 미사용 | ❌ 인터페이스 누락 | ⚠️ 누락 |

---

## 🚨 **주요 문제점 및 해결 방안**

### 1. **INQUIRIES 상태 값 불일치** 
**문제**: 데이터베이스, API, TypeScript 인터페이스에서 서로 다른 상태 값 사용
**해결 방안**:
```sql
-- 데이터베이스 상태 값을 API와 일치시키기
ALTER TABLE public.inquiries 
DROP CONSTRAINT inquiries_status_check;

ALTER TABLE public.inquiries 
ADD CONSTRAINT inquiries_status_check 
CHECK (status IN ('pending', 'in_progress', 'resolved', 'cancelled'));
```

### 2. **NOTICES views 필드 누락**
**문제**: API에서 조회수 기능을 사용하지만 데이터베이스 테이블에 필드가 없음
**해결 방안**:
```sql
-- notices 테이블에 views 컬럼 추가
ALTER TABLE public.notices 
ADD COLUMN views INTEGER DEFAULT 0;
```

### 3. **INQUIRIES response/responded_at 필드 불일치**
**문제**: TypeScript 인터페이스에는 있지만 데이터베이스에는 없음
**해결 방안**:
```sql
-- inquiries 테이블에 응답 관련 필드 추가
ALTER TABLE public.inquiries 
ADD COLUMN response TEXT,
ADD COLUMN responded_at TIMESTAMPTZ;
```

### 4. **TypeScript 인터페이스 누락**
**문제**: profiles 테이블 전용 인터페이스 부재
**해결 방안**: `src/lib/supabase.ts`에 Profile 인터페이스 추가 필요

---

## ✅ **권장 수정 사항**

1. **즉시 수정 필요**: INQUIRIES 상태 값 통일
2. **기능 개선**: NOTICES views 필드 추가  
3. **완전성 향상**: INQUIRIES 응답 관련 필드 추가
4. **타입 안정성**: 누락된 TypeScript 인터페이스 추가
5. **일관성 개선**: 필드명 통일 (is_published vs published) 