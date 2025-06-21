'use client'

import { useState, useEffect } from 'react'
import MainLayout from "@/components/layout/MainLayout"
import NoticeList from "@/components/notices/NoticeList"
import NoticeStats from "@/components/notices/NoticeStats"
import NewsletterSubscription from "@/components/notices/NewsletterSubscription"
import { Badge } from "@/components/ui/badge"

interface Notice {
  id: number
  title: string
  content: string
  category: string
  status: string
  isPinned: boolean
  views: number
  createdAt: string
  author: string
  important: boolean
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/notices')
        
        if (!response.ok) {
          throw new Error('공지사항을 불러오는데 실패했습니다.')
        }
        
        const data = await response.json()
        if (data.success && data.data) {
          // API 데이터를 컴포넌트에서 예상하는 형식으로 변환
          const transformedNotices = data.data.map((notice: any) => ({
            id: notice.id,
            title: notice.title,
            content: notice.content,
            category: notice.category || '공지',
            status: notice.is_published ? 'published' : 'draft',
            isPinned: notice.is_pinned || false,
            views: notice.views || 0,
            createdAt: notice.created_at,
            author: notice.author || '관리자',
            important: notice.is_pinned || false
          }))
          setNotices(transformedNotices)
        } else {
          setNotices([])
        }
      } catch (error) {
        console.error('Error fetching notices:', error)
        setError(error instanceof Error ? error.message : '오류가 발생했습니다.')
        setNotices([])
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
  }, [])

  if (loading) {
    return (
      <MainLayout>
        <section className="bg-gradient-bg py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Badge className="mb-4">Notice</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              공지사항
              <span className="block gradient-text bg-white text-transparent bg-clip-text">
                & 소식
              </span>
            </h1>
            <p className="text-xl text-ganzicorp-light/90 leading-relaxed">
              GanziCorp의 최신 소식과 중요한 공지사항을<br/>
              확인하실 수 있습니다.
            </p>
          </div>
        </section>
        
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-ganzicorp-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">공지사항을 불러오는 중입니다...</p>
          </div>
        </section>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <section className="bg-gradient-bg py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Badge className="mb-4">Notice</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              공지사항
              <span className="block gradient-text bg-white text-transparent bg-clip-text">
                & 소식
              </span>
            </h1>
            <p className="text-xl text-ganzicorp-light/90 leading-relaxed">
              GanziCorp의 최신 소식과 중요한 공지사항을<br/>
              확인하실 수 있습니다.
            </p>
          </div>
        </section>
        
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-md p-6">
              <h3 className="text-red-800 font-medium">오류가 발생했습니다</h3>
              <p className="text-red-600 mt-2">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                새로고침
              </button>
            </div>
          </div>
        </section>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-bg py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="mb-4">Notice</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            공지사항
            <span className="block gradient-text bg-white text-transparent bg-clip-text">
              & 소식
            </span>
          </h1>
          <p className="text-xl text-ganzicorp-light/90 leading-relaxed">
            GanziCorp의 최신 소식과 중요한 공지사항을<br/>
            확인하실 수 있습니다.
          </p>
        </div>
      </section>

      {/* Notices Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {notices.length > 0 ? (
            <NoticeList 
              notices={notices}
              itemsPerPage={5}
              showSearch={true}
              showFilters={true}
              showPagination={true}
            />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">공지사항이 없습니다</h3>
              <p className="text-gray-600">아직 등록된 공지사항이 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* Statistics */}
      <NoticeStats 
        totalNotices={notices.length}
        monthlyNotices={notices.filter(notice => {
          const noticeDate = new Date(notice.createdAt)
          const currentDate = new Date()
          return noticeDate.getMonth() === currentDate.getMonth() && 
                 noticeDate.getFullYear() === currentDate.getFullYear()
        }).length}
        totalViews={notices.reduce((sum, notice) => sum + notice.views, 0)}
      />

      {/* Newsletter Subscription */}
      <NewsletterSubscription />
    </MainLayout>
  )
} 