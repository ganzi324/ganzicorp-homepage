'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Send, Loader2 } from 'lucide-react'
import { contactFormSchema, ContactFormData } from '@/lib/schemas'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import { getAllInquiryTypes } from '@/lib/constants'

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

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
        // 성공 토스트 표시 (2초 동안)
        showSuccessToast('문의가 성공적으로 전송되었습니다!', 2000)
        
        // 2초 후 홈페이지로 리다이렉트
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        // 에러 토스트 표시
        showErrorToast(result.error || '문의 전송 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      // 네트워크 에러 토스트
      showErrorToast('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">이름 *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="홍길동"
            className={errors.name ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">이메일 *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="example@email.com"
            className={errors.email ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="phone">연락처</Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            placeholder="010-1234-5678"
            className={errors.phone ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="company">회사명</Label>
          <Input
            id="company"
            {...register('company')}
            placeholder="회사명 (선택사항)"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="inquiry_type">문의 유형 *</Label>
        <Select 
          onValueChange={(value) => setValue('inquiry_type', value)}
          disabled={isSubmitting}
        >
          <SelectTrigger className={errors.inquiry_type ? 'border-red-500' : ''}>
            <SelectValue placeholder="문의 유형을 선택해주세요" />
          </SelectTrigger>
          <SelectContent>
            {getAllInquiryTypes().map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.inquiry_type && (
          <p className="text-sm text-red-600 mt-1">{errors.inquiry_type.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="subject">제목 *</Label>
        <Input
          id="subject"
          {...register('subject')}
          placeholder="문의 제목을 입력해주세요"
          className={errors.subject ? 'border-red-500' : ''}
          disabled={isSubmitting}
        />
        {errors.subject && (
          <p className="text-sm text-red-600 mt-1">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="message">문의 내용 *</Label>
        <Textarea
          id="message"
          {...register('message')}
          placeholder="구체적인 문의 내용을 작성해주세요"
          rows={6}
          className={errors.message ? 'border-red-500' : ''}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            전송 중...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            문의하기
          </>
        )}
      </Button>
    </form>
  )
} 