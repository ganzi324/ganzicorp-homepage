'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Send, Loader2 } from 'lucide-react'
import { contactFormSchema, ContactFormData } from '@/lib/schemas'

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message,
        })
        reset() // 폼 초기화
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || '문의 전송 중 오류가 발생했습니다.',
        })
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus({
        type: 'error',
        message: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 성공/에러 메시지 */}
      {submitStatus.type && (
        <Alert variant={submitStatus.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{submitStatus.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 이름과 회사명 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">이름 *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="홍길동"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">회사명</Label>
            <Input
              id="company"
              {...register('company')}
              placeholder="회사명 (선택사항)"
            />
          </div>
        </div>

        {/* 이메일과 전화번호 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일 *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="example@company.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="010-1234-5678"
            />
          </div>
        </div>

        {/* 문의 유형 */}
        <div className="space-y-2">
          <Label htmlFor="subject">문의 유형 *</Label>
          <Select onValueChange={(value: string) => setValue('subject', value)}>
            <SelectTrigger className={errors.subject ? 'border-red-500' : ''}>
              <SelectValue placeholder="문의 유형을 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">일반 문의</SelectItem>
              <SelectItem value="project">프로젝트 상담</SelectItem>
              <SelectItem value="partnership">파트너십</SelectItem>
              <SelectItem value="support">기술 지원</SelectItem>
              <SelectItem value="other">기타</SelectItem>
            </SelectContent>
          </Select>
          {errors.subject && (
            <p className="text-sm text-red-500">{errors.subject.message}</p>
          )}
        </div>

        {/* 메시지 */}
        <div className="space-y-2">
          <Label htmlFor="message">메시지 *</Label>
          <Textarea
            id="message"
            {...register('message')}
            rows={6}
            placeholder="문의하실 내용을 자세히 적어주세요..."
            className={`resize-none ${errors.message ? 'border-red-500' : ''}`}
          />
          {errors.message && (
            <p className="text-sm text-red-500">{errors.message.message}</p>
          )}
        </div>

        {/* 제출 버튼 */}
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              전송 중...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              문의하기
            </>
          )}
        </Button>

        {/* 필수 항목 안내 */}
        <p className="text-sm text-muted-foreground">
          * 표시된 항목은 필수 입력 사항입니다.
        </p>
      </form>
    </div>
  )
} 