import { Metadata } from 'next'
import AdminLayout from '@/components/layout/AdminLayout'
import NoticeForm from '@/components/forms/NoticeForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface NoticeFormData {
  title: string
  content: string
  category: string
  published: boolean
  isPinned: boolean
}

export const metadata: Metadata = {
  title: '새 공지사항 작성 | 관리자',
  description: '새로운 공지사항을 작성합니다',
}

export default function NewNoticePage() {
  const handleSubmit = async (data: NoticeFormData, action: 'draft' | 'publish') => {
    try {
      const response = await fetch('/api/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          published: action === 'publish'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '공지사항 생성에 실패했습니다')
      }

      const result = await response.json()
      
      // 성공 시 목록 페이지로 리다이렉트
      if (action === 'publish') {
        window.location.href = '/admin/notices'
      }
      
      return result
    } catch (error) {
      console.error('Notice creation error:', error)
      throw error
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
        <NoticeForm onSubmit={handleSubmit} />
      </div>
    </AdminLayout>
  )
} 