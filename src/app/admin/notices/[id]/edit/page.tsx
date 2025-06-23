'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import NoticeForm from '@/components/forms/NoticeForm'
import { NoticeFormData } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Notice {
  id: string
  title: string
  content: string
  is_published: boolean
}

export default function EditNoticePage() {
  const params = useParams()
  const [notice, setNotice] = useState<Notice | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await fetch(`/api/admin/notices/${params.id}`)
        if (!response.ok) {
          throw new Error('공지사항을 불러올 수 없습니다')
        }
        const data = await response.json()
        if (data.success) {
          setNotice(data.data)
        } else {
          throw new Error(data.error || '공지사항을 불러올 수 없습니다')
        }
      } catch (error) {
        console.error('Error fetching notice:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchNotice()
    }
  }, [params.id])

  const handleSubmit = async (data: NoticeFormData, action: 'draft' | 'publish') => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/notices/${params.id}`, {
        method: 'PATCH',
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
        throw new Error(errorData.error || '공지사항 수정에 실패했습니다')
      }

      const result = await response.json()
      
      // 성공 시 목록 페이지로 리다이렉트
      window.location.href = '/admin/notices'
      
      return result
    } catch (error) {
      console.error('Notice update error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">공지사항을 불러오는 중...</span>
        </div>
      </AdminLayout>
    )
  }

  if (!notice) {
    notFound()
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
            <h1 className="text-3xl font-bold text-gray-900">공지사항 편집</h1>
            <p className="text-gray-600 mt-1">{notice.title}</p>
          </div>
        </div>

        {/* 폼 */}
        <NoticeForm 
          initialData={{
            title: notice.title,
            content: notice.content,
            published: notice.is_published
          }}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </AdminLayout>
  )
} 