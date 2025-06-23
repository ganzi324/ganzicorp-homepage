'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useOptionalAuth } from '@/components/auth/AuthProvider'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ShareButton from '@/components/notices/ShareButton'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Eye,
  Clock,
  AlertTriangle
} from 'lucide-react'

interface Notice {
  id: number
  title: string
  content: string
  category?: string
  is_published: boolean
  is_pinned: boolean
  views: number
  created_at: string
  updated_at?: string
  author?: string
}

interface NoticeDetailClientProps {
  noticeId: string
  fallbackNotice?: Notice | null
}

export default function NoticeDetailClient({ noticeId, fallbackNotice }: NoticeDetailClientProps) {
  const [notice, setNotice] = useState<Notice | null>(fallbackNotice || null)
  const [loading, setLoading] = useState(!fallbackNotice)
  const [error, setError] = useState<string | null>(null)
  const [wasAdminOnce, setWasAdminOnce] = useState(false)
  
  const searchParams = useSearchParams()
  const isPreview = searchParams.get('preview') === 'true'
  const { isAdmin, loading: authLoading, profileLoading } = useOptionalAuth()



  // 관리자 상태 기억
  useEffect(() => {
    if (!authLoading && !profileLoading && isAdmin) {
      setWasAdminOnce(true)
    }
  }, [authLoading, profileLoading, isAdmin])

  useEffect(() => {
    // 이미 데이터가 있거나 fallback이 있으면 다시 로딩하지 않음
    if (fallbackNotice || notice) return

    const fetchNotice = async () => {
      try {
        setLoading(true)
        setError(null)

        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        }

        // 미리보기 모드일 때 Authorization 헤더 추가
        if (isPreview) {
          const { data: session } = await supabase.auth.getSession()
          if (session.session?.access_token) {
            headers['Authorization'] = `Bearer ${session.session.access_token}`
          } else {
            setError('인증 토큰을 찾을 수 없습니다. 다시 로그인해주세요.')
            return
          }
        }

        const url = `/api/notices/${noticeId}${isPreview ? '?preview=true' : ''}`
        const response = await fetch(url, { headers })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          
          if (response.status === 403) {
            setError(errorData.error || '접근할 수 없는 공지사항입니다.')
          } else if (response.status === 404) {
            setError('공지사항을 찾을 수 없습니다.')
          } else {
            setError(errorData.error || '공지사항을 불러오는 중 오류가 발생했습니다.')
          }
          return
        }

        const result = await response.json()
        
        if (!result.success || !result.data) {
          setError(result.error || '공지사항을 찾을 수 없습니다.')
          return
        }

        setNotice(result.data)
      } catch (err) {
        console.error('Error fetching notice:', err)
        setError('공지사항을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    // 미리보기: 인증 완료 후, 일반: 즉시
    if ((isPreview && !authLoading && !profileLoading) || !isPreview) {
      fetchNotice()
    }
  }, [noticeId, isPreview, fallbackNotice, notice, authLoading, profileLoading])

  // 미리보기 모드에서 로딩 중 (한 번도 관리자였던 적이 없는 경우만)
  if (isPreview && (authLoading || profileLoading) && !wasAdminOnce) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">권한 확인 중...</h2>
            <p className="text-gray-600">잠시만 기다려주세요.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 미리보기 권한 확인 (한 번도 관리자였던 적이 없는 경우만)
  if (isPreview && !authLoading && !profileLoading && !isAdmin && !wasAdminOnce) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">관리자 권한이 필요합니다</h2>
            <p className="text-gray-600 mb-6">미리보기는 관리자만 볼 수 있습니다. 관리자 계정으로 로그인해주세요.</p>
            <div className="flex gap-2 justify-center">
              <Link href="/auth/login">
                <Button>로그인</Button>
              </Link>
              <Link href="/notices">
                <Button variant="outline">공지사항 목록</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 데이터 로딩 중일 때만 로딩 화면 표시 (인증 로딩은 제외)
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">공지사항을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !notice) {
    const isAccessError = error === '접근할 수 없는 공지사항입니다.' || error === '관리자 권한이 필요합니다.'
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <AlertTriangle className={`h-12 w-12 mx-auto mb-4 ${isAccessError ? 'text-orange-500' : 'text-red-500'}`} />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {isAccessError ? '접근 제한' : '오류가 발생했습니다'}
            </h2>
            <p className="text-gray-600 mb-6">
              {isAccessError 
                ? (isPreview 
                    ? '이 공지사항의 미리보기는 관리자만 볼 수 있습니다.' 
                    : '이 공지사항은 아직 발행되지 않았거나 접근이 제한되어 있습니다.')
                : (error || '공지사항을 불러올 수 없습니다.')
              }
            </p>
            <div className="flex gap-2 justify-center">
              <Link href="/notices">
                <Button variant="outline">공지사항 목록</Button>
              </Link>
              {isAccessError && isPreview ? (
                <Link href="/auth/login">
                  <Button>관리자 로그인</Button>
                </Link>
              ) : !isAccessError && (
                <Button onClick={() => window.location.reload()}>다시 시도</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "공지": return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "서비스": return "bg-green-500/10 text-green-600 border-green-500/20"
      case "이벤트": return "bg-purple-500/10 text-purple-600 border-purple-500/20"
      case "기술": return "bg-orange-500/10 text-orange-600 border-orange-500/20"
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-900">{line.substring(3)}</h2>
      } else if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-gray-800">{line.substring(4)}</h3>
      } else if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 mb-1">{line.substring(2)}</li>
      } else if (line.trim() === '') {
        return <br key={index} />
      } else {
        return <p key={index} className="mb-4 leading-relaxed">{line}</p>
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <section className="py-6 px-4 bg-white border-b">
        <div className="max-w-4xl mx-auto">
          <Link href="/notices">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              목록으로 돌아가기
            </Button>
          </Link>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Badge 
                variant="outline" 
                className={getCategoryColor(notice.category || '공지')}
              >
                {notice.category || '공지'}
              </Badge>
              {notice.is_pinned && (
                <Badge className="bg-yellow-500 text-white">
                  📌 중요 공지
                </Badge>
              )}
              {isPreview && (
                <Badge className="bg-orange-500 text-white">
                  👁️ 미리보기
                </Badge>
              )}
              {!notice.is_published && (
                <Badge variant="outline" className="bg-gray-100 text-gray-600">
                  📝 임시저장
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {notice.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{notice.author || '관리자'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(notice.created_at)}</span>
              </div>
              {notice.views !== undefined && (
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{notice.views}회 조회</span>
                </div>
              )}
              {notice.updated_at && notice.updated_at !== notice.created_at && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>수정: {formatDate(notice.updated_at)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <Card className="shadow-sm">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed">
                  {formatContent(notice.content)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Link href="/notices">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4 mr-2" />
                공지사항 목록
              </Button>
            </Link>
            
            <div className="flex gap-2">
              <ShareButton 
                title={notice.title}
                content={notice.content}
              />
            </div>
          </div>
        </div>
      </section>
          </div>
    )
  }