# 📚 타입 정의 및 사용 가이드

## 🎯 **개요**

이 프로젝트는 **레이어별 타입 분리**를 통해 타입 안전성과 코드 유지보수성을 확보합니다.

### **📁 파일 구조**
```
src/lib/
├── types.ts          # 모든 타입 정의 (중앙화)
├── type-utils.ts     # 타입 변환 및 유틸리티 함수
├── schemas.ts        # Zod 스키마 (사용자 입력 검증용)
└── supabase.ts       # Supabase 클라이언트 및 DB 인터페이스
```

## 🏗️ **레이어별 타입 시스템**

### **1. Form Layer (폼 레이어) - Zod 스키마로 검증**
```typescript
// 사용자 입력 검증용 - 런타임 검증 포함
import { contactFormSchema, noticeFormSchema } from '@/lib/schemas'

// 사용 예시
const formData = contactFormSchema.parse(userInput) // 런타임 검증
```

### **2. API Layer (API 레이어) - Zod 스키마로 검증**
```typescript
// API 요청 검증용 - 런타임 검증 포함
import { noticeCreateApiSchema, inquiryCreateApiSchema } from '@/lib/schemas'

// 사용 예시
const apiData = noticeCreateApiSchema.parse(requestBody) // 런타임 검증
```

### **3. Database Layer (DB 레이어) - TypeScript 인터페이스만 사용**
```typescript
// DB 응답 타입 - 컴파일 타임 타입 안전성만 제공
import { Notice, Inquiry, Profile } from '@/lib/supabase'

// 사용 예시
const notice: Notice = data as Notice // 타입 어서션만 사용
```

## 🔄 **타입 변환 플로우**

### **✅ 권장 사용 패턴**

#### **1. 폼 데이터 → API 요청**
```typescript
import { noticeFormSchema, noticeCreateApiSchema } from '@/lib/schemas'
import { formToApiConverter } from '@/lib/type-utils'

// 폼 데이터 검증
const formData = noticeFormSchema.parse(userInput)

// API 요청 데이터로 변환
const apiData = formToApiConverter.noticeCreate(formData)

// API 요청 검증
const validatedApiData = noticeCreateApiSchema.parse(apiData)
```

#### **2. API 응답 → 컴포넌트 사용**
```typescript
import { Notice } from '@/lib/supabase'

// DB에서 받은 데이터 (TypeScript 타입만 사용)
const notices: Notice[] = data as Notice[]

// 컴포넌트에서 직접 사용
notices.forEach(notice => {
  console.log(notice.title, notice.is_published)
})
```

#### **3. 안전한 데이터 페칭**
```typescript
import { getNoticesSafe, getInquirySafe } from '@/lib/supabase'

// 안전한 데이터 페칭 (에러 처리 포함)
const result = await getNoticesSafe()

if (result.success) {
  // result.data는 Notice[] 타입으로 보장됨
  const notices = result.data
} else {
  // 에러 처리
  console.error(result.error)
}
```

## 🛡️ **검증 전략**

### **✅ Zod 스키마 사용 (런타임 검증)**
- **사용자 입력 데이터** (폼, API 요청)
- **신뢰할 수 없는 외부 데이터**
- **실시간 검증이 필요한 데이터**

### **✅ TypeScript 인터페이스만 사용 (컴파일 타임 검증)**
- **데이터베이스 응답** (Supabase는 신뢰할 수 있는 소스)
- **내부 API 응답** (자체 제어 가능한 데이터)
- **성능이 중요한 대용량 데이터**

## 📝 **실제 사용 예시**

### **Notice 생성 플로우**
```typescript
// 1. 사용자 입력 검증 (폼)
const formData = noticeFormSchema.parse(userInput)

// 2. API 요청 데이터 변환 및 검증
const apiData = noticeCreateApiSchema.parse({
  title: formData.title,
  content: formData.content,
  is_published: formData.published
})

// 3. DB 삽입
const { data, error } = await supabase
  .from('notices')
  .insert(apiData)
  .select()
  .single()

// 4. DB 응답 사용 (타입 어서션만)
const notice: Notice = data as Notice
```

### **Inquiry 조회 플로우**
```typescript
// 1. 안전한 데이터 페칭
const result = await getInquirySafe(id)

// 2. 결과 처리
if (result.success) {
  const inquiry: Inquiry = result.data
  
  // 3. 컴포넌트에서 사용
  return (
    <div>
      <h1>{inquiry.subject}</h1>
      <p>상태: {inquiry.status}</p>
      <p>작성자: {inquiry.name}</p>
    </div>
  )
} else {
  // 에러 처리
  return <div>에러: {result.error}</div>
}
```

## 🔧 **타입 변환 유틸리티**

### **폼 → API 변환**
```typescript
import { formToApiConverter } from '@/lib/type-utils'

// Notice 폼 데이터를 API 요청으로 변환
const apiData = formToApiConverter.noticeCreate(formData)

// Contact 폼 데이터를 Inquiry API 요청으로 변환
const inquiryData = formToApiConverter.contactToInquiry(contactData)
```

### **API → DB 변환**
```typescript
import { apiToDbConverter } from '@/lib/type-utils'

// API 요청을 DB 삽입 데이터로 변환
const dbData = apiToDbConverter.noticeCreate(apiData)
```

## 🎯 **핵심 원칙**

### **✅ DO (권장사항)**
- **사용자 입력은 항상 Zod로 검증**
- **DB 응답은 TypeScript 타입 어서션만 사용**
- **타입 변환 시 유틸리티 함수 활용**
- **에러 처리를 위한 안전한 페칭 함수 사용**

### **❌ DON'T (피해야 할 것)**
- **DB 응답에 Zod 검증 사용 (성능 저하)**
- **사용자 입력을 검증 없이 직접 사용**
- **타입 변환 로직을 여러 곳에 중복 작성**
- **에러 처리 없는 직접적인 DB 호출**

## 🚀 **성능 최적화**

### **Zod 검증 최소화**
- 사용자 입력과 API 요청만 검증
- DB 응답은 TypeScript 타입만 사용하여 런타임 오버헤드 제거

### **타입 변환 최적화**
- 유틸리티 함수로 변환 로직 중앙화
- 불필요한 객체 생성 최소화

### **에러 처리 표준화**
- 모든 DB 호출에 일관된 에러 처리 패턴 적용
- 안전한 페칭 함수로 예외 상황 처리

이 가이드를 따르면 **타입 안전성**, **성능**, **유지보수성**을 모두 확보할 수 있습니다. 

# 🎯 Ganzi Homepage 타입 시스템 가이드

이 문서는 Ganzi Homepage 프로젝트에서 사용하는 타입 시스템과 검증 전략을 설명합니다.

## 📋 목차
- [레이어별 타입 구분](#레이어별-타입-구분)
- [검증 전략](#검증-전략)
- [파일 구조](#파일-구조)
- [사용 패턴](#사용-패턴)
- [Best Practices](#best-practices)

---

## 🏗️ 레이어별 타입 구분

### 1. **Form Layer** (사용자 입력)
- **목적**: 사용자가 폼에 입력하는 데이터 검증
- **위치**: `src/lib/schemas.ts`
- **검증**: Zod 스키마로 런타임 검증
- **예시**: `NoticeFormData`, `ContactFormData`

### 2. **API Layer** (API 요청/응답)
- **목적**: API 엔드포인트 간 데이터 전송
- **위치**: `src/lib/supabase.ts`
- **검증**: TypeScript 타입 어서션만 사용
- **예시**: `CreateNotice`, `UpdateNotice`

### 3. **Database Layer** (DB 스키마)
- **목적**: 데이터베이스 레코드 구조
- **위치**: `src/lib/supabase.ts`
- **검증**: TypeScript 타입 어서션만 사용
- **예시**: `Notice`, `Inquiry`, `Profile`

---

## ✅ 검증 전략

### **🎯 핵심 원칙: 중복 검증 제거**

**❌ 기존 문제점**
```typescript
// 1. 폼에서 검증
const formData = noticeFormSchema.parse(userInput)

// 2. API에서 또 검증 (중복!)
const apiData = noticeCreateApiSchema.parse({
  title: formData.title,
  content: formData.content,
  is_published: formData.published
})
```

**✅ 개선된 방법**
```typescript
// 1. 폼에서만 검증
const formData = noticeFormSchema.parse(userInput)

// 2. 검증된 데이터를 바로 DB용으로 변환
const dbData = convertNoticeFormToDb(formData)
```

### **🔄 검증 플로우**

#### **내부 애플리케이션 (권장)**
```
사용자 입력 → Zod 검증 → 타입 변환 → DB 저장
     ↓           ↓          ↓        ↓
  Raw Data → FormData → CreateNotice → DB
```

#### **외부 API 호출 (필요시에만)**
```
외부 요청 → API 스키마 검증 → 타입 변환 → DB 저장
    ↓            ↓             ↓        ↓
Raw Data → ApiRequestData → CreateNotice → DB
```

### **📝 검증 규칙**

1. **사용자 입력**: 항상 Zod로 검증
2. **DB 응답**: TypeScript 타입 어서션만 사용 (성능 최적화)
3. **외부 API**: 필요시에만 별도 검증 스키마 사용
4. **내부 변환**: 검증된 데이터 간 변환은 검증 생략

---

## 📁 파일 구조

```
src/lib/
├── schemas.ts       # Zod 스키마 (사용자 입력 검증용)
├── supabase.ts      # TypeScript 인터페이스 (DB/API 타입)
├── type-utils.ts    # 타입 변환 유틸리티
└── types.ts         # 공통 타입 정의 (삭제 예정)
```

### **schemas.ts** - 검증 스키마
```typescript
// 폼 데이터 검증 (런타임)
export const noticeFormSchema = z.object({...})
export const contactFormSchema = z.object({...})

// 외부 API 검증 (필요시에만)
export const noticeCreateApiSchema = z.object({...})
```

### **supabase.ts** - 타입 정의
```typescript
// DB 레코드 타입 (컴파일 타임)
export interface Notice { id: string; title: string; ... }
export interface Inquiry { id: string; name: string; ... }

// 유틸리티 타입 (컴파일 타임)
export type CreateNotice = Omit<Notice, 'id' | 'created_at' | 'updated_at'>
export type UpdateNotice = Partial<CreateNotice>
```

### **type-utils.ts** - 변환 함수
```typescript
// 검증된 데이터 간 변환 (검증 없음)
export function convertNoticeFormToDb(formData: NoticeFormData): CreateNotice
export function convertContactFormToInquiry(formData: ContactFormData): CreateInquiry
```

---

## 💡 사용 패턴

### **1. Notice 생성 (내부)**
```typescript
// ✅ 권장 방법
async function createNotice(userInput: unknown) {
  // 1. 사용자 입력만 검증
  const formData = noticeFormSchema.parse(userInput)
  
  // 2. 검증된 데이터를 DB용으로 변환
  const dbData = convertNoticeFormToDb(formData)
  
  // 3. DB에 저장 (추가 검증 없음)
  const result = await supabase.from('notices').insert({
    ...dbData,
    author_id: userId
  })
  
  return result
}
```

### **2. Contact 문의 처리**
```typescript
// ✅ 권장 방법
async function submitContact(userInput: unknown) {
  // 1. 폼 데이터 검증
  const formData = contactFormSchema.parse(userInput)
  
  // 2. Inquiry로 변환하여 저장
  const inquiryData = convertContactFormToInquiry(formData)
  
  // 3. DB에 저장
  const result = await supabase.from('inquiries').insert(inquiryData)
  
  return result
}
```

### **3. 외부 API 엔드포인트 (필요시에만)**
```typescript
// 외부에서 API를 호출할 때만 사용
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // 외부 요청은 별도 스키마로 검증
    const apiData = noticeCreateApiSchema.parse(body)
    
    // API 데이터를 DB용으로 변환
    const dbData: CreateNotice = {
      title: apiData.title,
      content: apiData.content,
      is_published: apiData.is_published
    }
    
    // DB에 저장
    const result = await supabase.from('notices').insert(dbData)
    
    return NextResponse.json(createSuccessResponse(result))
  } catch (error) {
    return NextResponse.json(createErrorResponse('검증 실패'))
  }
}
```

---

## 🎯 Best Practices

### **✅ DO (권장사항)**

1. **단일 검증 지점**
   ```typescript
   // 사용자 입력은 한 번만 검증
   const formData = noticeFormSchema.parse(userInput)
   const dbData = convertNoticeFormToDb(formData) // 변환만, 검증 없음
   ```

2. **타입 안전성 유지**
   ```typescript
   // TypeScript로 컴파일 타임 타입 체크
   const notice: Notice = result.data as Notice
   ```

3. **명확한 레이어 분리**
   ```typescript
   // 각 레이어별로 적절한 타입 사용
   FormData → CreateNotice → Notice
   ```

4. **성능 최적화**
   ```typescript
   // DB 응답은 타입 어서션만 사용 (런타임 검증 없음)
   const notices = data as Notice[]
   ```

### **❌ DON'T (지양사항)**

1. **중복 검증**
   ```typescript
   // ❌ 같은 데이터를 여러 번 검증하지 마세요
   const formData = noticeFormSchema.parse(userInput)
   const apiData = noticeCreateApiSchema.parse(formData) // 불필요!
   ```

2. **DB 응답 런타임 검증**
   ```typescript
   // ❌ 성능 저하 원인
   const notices = noticeResponseSchema.parse(data) // 불필요!
   ```

3. **타입 불일치**
   ```typescript
   // ❌ 필드명이 다르면 변환 함수 사용
   const dbData = { ...formData, published: formData.is_published } // 잘못됨
   const dbData = convertNoticeFormToDb(formData) // ✅ 올바름
   ```

---

## 🔧 마이그레이션 가이드

### **기존 코드에서 개선하기**

#### **Before (중복 검증)**
```typescript
const formData = noticeFormSchema.parse(userInput)
const apiData = noticeCreateApiSchema.parse({
  title: formData.title,
  content: formData.content,
  is_published: formData.published
})
const result = await supabase.from('notices').insert(apiData)
```

#### **After (효율적 검증)**
```typescript
const formData = noticeFormSchema.parse(userInput)
const dbData = convertNoticeFormToDb(formData)
const result = await supabase.from('notices').insert({
  ...dbData,
  author_id: userId
})
```

---

## 📊 검증 성능 비교

| 방법 | 검증 횟수 | 성능 | 복잡도 | 권장도 |
|------|-----------|------|--------|--------|
| 중복 검증 | 2-3회 | 느림 | 높음 | ❌ |
| 단일 검증 | 1회 | 빠름 | 낮음 | ✅ |
| 타입 어서션 | 0회 | 매우 빠름 | 매우 낮음 | ✅ |

---

## 🚀 결론

**핵심 메시지**: 
- **사용자 입력**만 Zod로 검증하고, **DB 응답**은 TypeScript 타입 어서션 사용
- **중복 검증을 제거**하여 성능 최적화
- **명확한 레이어 분리**로 코드 가독성 향상

이 가이드를 따르면 **타입 안전성**을 유지하면서도 **성능을 최적화**할 수 있습니다. 