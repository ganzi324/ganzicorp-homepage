'use client'

import AdminLayout from '@/components/layout/AdminLayout'
import NoticeForm, { NoticeFormData } from '@/components/forms/NoticeForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function NewNoticePage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: NoticeFormData, action: 'draft' | 'publish') => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          is_published: action === 'publish'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '공지사항 생성에 실패했습니다')
      }

      const result = await response.json()
      
      // 성공 시 목록 페이지로 리다이렉트
      window.location.href = '/admin/notices'
      
      return result
    } catch (error) {
      console.error('Notice creation error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 페이지 헤더 */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/notices">
              <ArrowLeft className="h-4 w-4 mr-2" />
              뒤로가기
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">새 공지사항 작성</h1>
            <p className="text-gray-600 mt-1">새로운 공지사항을 작성하고 발행할 수 있습니다</p>
          </div>
        </div>

        {/* 폼 */}
        <NoticeForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </AdminLayout>
  )
} 