// =====================================================================================
// TYPE CONVERSION UTILITIES (타입 변환 유틸리티)
// 검증된 데이터 간의 안전한 변환만 수행 (중복 검증 없음)
// =====================================================================================

import {
  // Form types (이미 검증된 데이터)
  NoticeFormData, ContactFormData,
  // API types for external validation
  NoticeCreateApiData, InquiryCreateApiData
} from './schemas'

import {
  // Utility types
  CreateNotice, CreateInquiry
} from './supabase'

// =====================================================================================
// 1. FORM TO DATABASE CONVERTERS (폼 → DB 직접 변환)
// 내부 애플리케이션에서는 중간 API 검증 생략
// =====================================================================================

/**
 * Notice 폼 데이터를 DB 삽입용 데이터로 직접 변환
 * @param formData 이미 검증된 폼 데이터
 * @returns DB 삽입용 데이터
 */
export function convertNoticeFormToDb(formData: NoticeFormData): CreateNotice {
  return {
    title: formData.title,
    content: formData.content,
    is_published: formData.published, // 필드명 변환
    // author_id는 별도로 설정
  }
}

/**
 * Contact 폼 데이터를 Inquiry DB 삽입용 데이터로 직접 변환
 * @param formData 이미 검증된 폼 데이터
 * @returns DB 삽입용 데이터
 */
export function convertContactFormToInquiry(formData: ContactFormData): CreateInquiry {
  return {
    name: formData.name,
    email: formData.email,
    company: formData.company,
    phone: formData.phone,
    subject: formData.subject,
    message: formData.message,
    inquiry_type: 'general' // 기본값
  }
}

// =====================================================================================
// 2. EXTERNAL API CONVERTERS (외부 API 호출용)
// 외부에서 API를 호출할 때만 사용 (추가 검증 필요)
// =====================================================================================

/**
 * 검증된 폼 데이터를 외부 API 형식으로 변환
 * 주의: 외부 API 호출 시에는 추가 검증이 필요할 수 있음
 */
export function convertFormToExternalApi(formData: NoticeFormData): NoticeCreateApiData {
  return {
    title: formData.title,
    content: formData.content,
    is_published: formData.published
  }
}

/**
 * 검증된 Contact 폼 데이터를 외부 API 형식으로 변환
 */
export function convertContactToExternalApi(formData: ContactFormData): InquiryCreateApiData {
  return {
    ...formData,
    inquiry_type: 'general'
  }
}

// =====================================================================================
// 3. RESPONSE HELPERS (응답 헬퍼)
// =====================================================================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiListResponse<T> {
  success: boolean
  data?: T[]
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * 성공 응답 생성
 */
export function createSuccessResponse<T>(
  data: T, 
  message?: string
): ApiResponse<T> {
  return {
    success: true,
    data,
    message
  }
}

/**
 * 에러 응답 생성
 */
export function createErrorResponse(error: string): ApiResponse<never> {
  return {
    success: false,
    error
  }
}

/**
 * 리스트 성공 응답 생성
 */
export function createListResponse<T>(
  data: T[],
  pagination?: {
    page: number
    limit: number
    total: number
  },
  message?: string
): ApiListResponse<T> {
  return {
    success: true,
    data,
    message,
    pagination: pagination ? {
      ...pagination,
      totalPages: Math.ceil(pagination.total / pagination.limit)
    } : undefined
  }
}

// =====================================================================================
// 4. TYPE GUARDS (타입 가드)
// =====================================================================================

/**
 * 성공 응답인지 확인하는 타입 가드
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { success: true; data: T } {
  return response.success === true && response.data !== undefined
}

/**
 * 에러 응답인지 확인하는 타입 가드
 */
export function isErrorResponse<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { success: false; error: string } {
  return response.success === false && response.error !== undefined
} 