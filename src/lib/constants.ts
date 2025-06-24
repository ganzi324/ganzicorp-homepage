/**
 * 문의 유형 관련 상수 및 타입 정의
 * 중앙집중식 관리를 통해 타입 안전성과 일관성을 보장합니다.
 */

// 문의 유형 상수 정의
export const INQUIRY_TYPES = {
  service: {
    value: 'service',
    label: '서비스 문의'
  },
  partnership: {
    value: 'partnership', 
    label: '파트너십 문의'
  },
  support: {
    value: 'support',
    label: '기술 지원'
  },
  career: {
    value: 'career',
    label: '채용 문의'
  },
  general: {
    value: 'general',
    label: '일반 문의'
  }
} as const

// 문의 유형 타입 정의
export type InquiryType = keyof typeof INQUIRY_TYPES

// 문의 유형 값들의 배열 (zod enum에서 사용)
export const INQUIRY_TYPE_VALUES = Object.keys(INQUIRY_TYPES) as InquiryType[]

// 문의 유형 라벨 가져오기 유틸리티 함수
export function getInquiryTypeLabel(type: string): string {
  return INQUIRY_TYPES[type as InquiryType]?.label || type
}

// 모든 문의 유형을 배열로 반환하는 유틸리티 함수
export function getAllInquiryTypes() {
  return Object.values(INQUIRY_TYPES)
} 