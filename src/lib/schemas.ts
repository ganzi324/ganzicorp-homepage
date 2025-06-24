import { z } from 'zod'
import { INQUIRY_TYPE_VALUES } from './constants'

// =====================================================================================
// FORM DATA VALIDATION SCHEMAS (사용자 입력 검증용)
// =====================================================================================

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z.string().min(2, '이름은 최소 2글자 이상이어야 합니다'),
  email: z.string().email('올바른 이메일 형식을 입력해주세요'),
  company: z.string().optional(),
  phone: z.string().optional(),
  inquiry_type: z.enum(INQUIRY_TYPE_VALUES as [string, ...string[]], {
    errorMap: () => ({ message: '올바른 문의 유형을 선택해주세요' })
  }),
  subject: z.string().min(1, '제목을 입력해주세요'),
  message: z.string().min(10, '메시지는 최소 10글자 이상 작성해주세요'),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Notice Form Schemas
export const noticeFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(200, '제목은 200자 이하로 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요').max(10000, '내용은 10,000자 이하로 입력해주세요'),
  published: z.boolean()
})

export type NoticeFormData = z.infer<typeof noticeFormSchema>

// Auth Form Schemas
export const loginSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
})

export type LoginFormData = z.infer<typeof loginSchema>

// =====================================================================================
// API REQUEST VALIDATION SCHEMAS (외부 API 호출 시에만 사용)
// =====================================================================================

// Notice API Request Schemas (외부에서 API 호출 시 검증용)
export const noticeCreateApiSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(200, '제목은 200자 이하로 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요').max(10000, '내용은 10,000자 이하로 입력해주세요'),
  is_published: z.boolean().default(false)
})

export type NoticeCreateApiData = z.infer<typeof noticeCreateApiSchema>

export const noticeUpdateApiSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(200, '제목은 200자 이하로 입력해주세요').optional(),
  content: z.string().min(1, '내용을 입력해주세요').max(10000, '내용은 10,000자 이하로 입력해주세요').optional(),
  is_published: z.boolean().optional()
})

export type NoticeUpdateApiData = z.infer<typeof noticeUpdateApiSchema>

// Contact to Inquiry API Schema (외부에서 문의 API 호출 시 검증용)
export const inquiryCreateApiSchema = contactFormSchema.extend({
  inquiry_type: z.enum(INQUIRY_TYPE_VALUES as [string, ...string[]]).default('general')
})

export type InquiryCreateApiData = z.infer<typeof inquiryCreateApiSchema>

export const inquiryStatusUpdateSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'resolved', 'cancelled'], {
    errorMap: () => ({ message: '유효하지 않은 상태 값입니다.' })
  })
})

export type InquiryStatusUpdateData = z.infer<typeof inquiryStatusUpdateSchema>

export const inquiryUpdateApiSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'resolved', 'cancelled']).optional(),
  response: z.string().optional(),
  responded_at: z.string().optional(),
  admin_notes: z.string().optional()
})

export type InquiryUpdateApiData = z.infer<typeof inquiryUpdateApiSchema>

// Admin Inquiry Creation Schema
export const adminInquirySchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  email: z.string().email('유효한 이메일 형식을 입력해주세요'),
  company: z.string().optional(),
  phone: z.string().optional(),
  inquiry_type: z.enum(INQUIRY_TYPE_VALUES as [string, ...string[]]).default('general'),
  subject: z.string().min(1, '제목을 입력해주세요'),
  message: z.string().min(1, '메시지를 입력해주세요'),
  status: z.enum(['pending', 'in_progress', 'resolved', 'cancelled']).default('pending')
})

export type AdminInquiryData = z.infer<typeof adminInquirySchema> 