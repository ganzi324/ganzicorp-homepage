// Supabase 클라이언트 - 권장 방식으로 재작성
// 클라이언트 컴포넌트에서 사용할 때는 utils/supabase/client.ts를 사용
// 서버 컴포넌트에서 사용할 때는 utils/supabase/server.ts를 사용
// 이 파일은 하위 호환성을 위해 유지 (기존 코드가 많이 사용 중)
import { createClient } from '@supabase/supabase-js'
import { InquiryType } from './constants'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 레거시 클라이언트 (기존 코드 호환성 유지)
// 새로운 코드에서는 utils/supabase/client.ts 또는 utils/supabase/server.ts 사용 권장
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// =====================================================================================
// 데이터베이스 테이블 인터페이스 정의 (database_schema_final.sql 기반)
// =====================================================================================

// User Role 타입 정의 (database enum과 일치)
export type UserRole = 'user' | 'admin' | 'super_admin'

// Inquiry Status 타입 정의 (database enum과 일치)
export type InquiryStatus = 'pending' | 'in_progress' | 'resolved' | 'cancelled'

// =====================================================================================
// PROFILES 테이블 인터페이스 (새로 추가)
// =====================================================================================

export interface Profile {
  id: string                    // UUID REFERENCES auth.users(id)
  full_name?: string           // VARCHAR(100) - signUpSchema.fullName 기반
  email?: string               // VARCHAR(255) - signUpSchema.email 기반
  role: UserRole               // user_role DEFAULT 'user' NOT NULL
  created_at: string           // TIMESTAMPTZ DEFAULT NOW() NOT NULL
  updated_at: string           // TIMESTAMPTZ DEFAULT NOW() NOT NULL
}

// =====================================================================================
// NOTICES 테이블 인터페이스 (업데이트됨)
// =====================================================================================

export interface Notice {
  id: string                   // UUID DEFAULT gen_random_uuid() PRIMARY KEY
  title: string                // VARCHAR(200) NOT NULL - noticeSchema.title 기반
  content: string              // TEXT NOT NULL - noticeSchema.content 기반
  is_published: boolean        // BOOLEAN DEFAULT false NOT NULL - noticeSchema.published
  views: number                // INTEGER DEFAULT 0 NOT NULL - 조회수 필드 추가
  author_id?: string           // UUID REFERENCES public.profiles(id)
  created_at: string           // TIMESTAMPTZ DEFAULT NOW() NOT NULL
  updated_at: string           // TIMESTAMPTZ DEFAULT NOW() NOT NULL
}

// =====================================================================================
// INQUIRIES 테이블 인터페이스 (업데이트됨)
// =====================================================================================

export interface Inquiry {
  id: string                   // UUID DEFAULT gen_random_uuid() PRIMARY KEY
  // contactFormSchema 기반 필드들
  name: string                 // VARCHAR(100) NOT NULL - contactFormSchema.name
  email: string                // VARCHAR(255) NOT NULL - contactFormSchema.email
  company?: string             // VARCHAR(100) - contactFormSchema.company (optional)
  phone?: string               // VARCHAR(20) - contactFormSchema.phone (optional)
  subject: string              // VARCHAR(200) NOT NULL - contactFormSchema.subject
  message: string              // TEXT NOT NULL - contactFormSchema.message
  // 추가 관리 필드들
  inquiry_type: InquiryType    // VARCHAR(50) DEFAULT 'general' NOT NULL - 타입 안전성 강화
  status: InquiryStatus        // inquiry_status DEFAULT 'pending' NOT NULL - 통일된 상태 값
  // 관리자 응답 필드들
  response?: string            // TEXT - 관리자 응답 내용
  responded_at?: string        // TIMESTAMPTZ - 응답 일시
  admin_notes?: string         // TEXT - 관리자 내부 메모
  // 시간 추적
  created_at: string           // TIMESTAMPTZ DEFAULT NOW() NOT NULL
  updated_at: string           // TIMESTAMPTZ DEFAULT NOW() NOT NULL
}

// =====================================================================================
// 추가 유틸리티 타입들
// =====================================================================================

// 새 사용자 생성 시 사용하는 타입 (signUpSchema 기반)
export interface CreateUserProfile {
  id: string
  full_name?: string
  email?: string
  role?: UserRole
}

// 문의 생성 시 사용하는 타입 (contactFormSchema 기반)
export interface CreateInquiry {
  name: string
  email: string
  company?: string
  phone?: string
  subject: string
  message: string
  inquiry_type?: InquiryType
}

// 공지사항 생성 시 사용하는 타입 (noticeSchema 기반)
export interface CreateNotice {
  title: string
  content: string
  is_published?: boolean
  author_id?: string
}

// 관리자용 문의 업데이트 타입
export interface UpdateInquiry {
  status?: InquiryStatus
  response?: string
  responded_at?: string
  admin_notes?: string
}

// 공지사항 업데이트 타입
export interface UpdateNotice {
  title?: string
  content?: string
  is_published?: boolean
  views?: number
}

// =====================================================================================
// 안전한 데이터 페칭 유틸리티 함수들
// =====================================================================================

/**
 * 안전하게 Inquiry 데이터를 가져옵니다. (TypeScript 타입만 사용)
 */
export async function getInquirySafe(id: string): Promise<{ success: true; data: Inquiry } | { success: false; error: string }> {
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: data as Inquiry }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '데이터를 가져오는데 실패했습니다.' 
    }
  }
}

/**
 * 안전하게 모든 Inquiry 데이터를 가져옵니다. (TypeScript 타입만 사용)
 */
export async function getInquiriesSafe(): Promise<{ success: true; data: Inquiry[] } | { success: false; error: string }> {
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: data as Inquiry[] }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '데이터를 가져오는데 실패했습니다.' 
    }
  }
}

/**
 * 안전하게 Notice 데이터를 가져옵니다. (TypeScript 타입만 사용)
 */
export async function getNoticesSafe(): Promise<{ success: true; data: Notice[] } | { success: false; error: string }> {
  try {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: data as Notice[] }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '데이터를 가져오는데 실패했습니다.' 
    }
  }
}

/**
 * 안전하게 Profile 데이터를 가져옵니다. (TypeScript 타입만 사용)
 */
export async function getProfileSafe(userId: string): Promise<{ success: true; data: Profile } | { success: false; error: string }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: data as Profile }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '데이터를 가져오는데 실패했습니다.' 
    }
  }
} 