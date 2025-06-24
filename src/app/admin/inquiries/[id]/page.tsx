'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, Phone, User, Calendar, MessageSquare, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { getInquiryTypeLabel } from '@/lib/constants'

interface Inquiry {
  id: string
  name: string
  company?: string
  email: string
  phone?: string
  inquiry_type: string
  subject: string
  message: string
  status: string
  created_at: string
  updated_at: string
}

export default function AdminInquiryDetailPage() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const inquiryId = params.id as string

  const [inquiry, setInquiry] = useState<Inquiry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  // 권한 확인을 useMemo로 최적화
  const isAuthorized = useMemo(() => {
    if (authLoading) return null // 로딩 중
    return user && isAdmin
  }, [user, isAdmin, authLoading])

  const fetchInquiryDetail = useCallback(async () => {
    if (!inquiryId) {
      setError('잘못된 문의 ID입니다.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('문의를 찾을 수 없습니다.')
        } else if (response.status === 403) {
          throw new Error('접근 권한이 없습니다.')
        } else {
          throw new Error('문의를 불러오는데 실패했습니다.')
        }
      }
      
      const data = await response.json()
      if (data.inquiry) {
        setInquiry(data.inquiry)
      } else {
        throw new Error('문의 데이터를 찾을 수 없습니다.')
      }
    } catch (error) {
      console.error('Error fetching inquiry:', error)
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [inquiryId])

  const updateStatus = useCallback(async (newStatus: string) => {
    if (!inquiry || updating) return

    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '상태 업데이트에 실패했습니다.')
      }

      const data = await response.json()
      if (data.inquiry) {
        setInquiry(data.inquiry)
      } else {
        setInquiry(prev => prev ? { ...prev, status: newStatus, updated_at: new Date().toISOString() } : null)
      }
      
      alert('상태가 업데이트되었습니다.')
    } catch (error) {
      console.error('Error updating status:', error)
      alert(error instanceof Error ? error.message : '상태 업데이트 중 오류가 발생했습니다.')
    } finally {
      setUpdating(false)
    }
  }, [inquiry, inquiryId, updating])

  // 권한 체크 effect
  useEffect(() => {
    if (isAuthorized === false) {
      router.push('/admin/login')
    }
  }, [isAuthorized, router])

  // 데이터 fetch effect
  useEffect(() => {
    if (isAuthorized === true) {
      fetchInquiryDetail()
    }
  }, [isAuthorized, fetchInquiryDetail])

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { variant: 'secondary' as const, label: '대기' },
      in_progress: { variant: 'default' as const, label: '처리중' },
      resolved: { variant: 'outline' as const, label: '완료' },
      cancelled: { variant: 'destructive' as const, label: '취소' }
    }
    
    const config = configs[status as keyof typeof configs] || configs.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return '날짜 정보 없음'
      }
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error('Error formatting date:', error)
      return '날짜 형식 오류'
    }
  }



  // 로딩 중이거나 권한 확인 중
  if (authLoading || isAuthorized === null) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">로딩 중...</span>
        </div>
      </AdminLayout>
    )
  }

  // 권한 없음
  if (isAuthorized === false) {
    return null
  }

  // 데이터 로딩 중
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">문의 정보를 불러오는 중...</span>
        </div>
      </AdminLayout>
    )
  }

  // 오류 또는 데이터 없음
  if (error || !inquiry) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin/inquiries')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              문의 목록으로 돌아가기
            </Button>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-md p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <h3 className="text-red-800 font-medium">문의를 찾을 수 없습니다</h3>
            </div>
            <div className="mt-2 text-red-600">
              <p>{error || '요청하신 문의를 찾을 수 없습니다.'}</p>
              <p className="text-sm mt-2">
                문의 ID: <code className="bg-red-100 px-2 py-1 rounded">{inquiryId}</code>
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={fetchInquiryDetail} variant="outline" disabled={loading}>
                {loading ? '다시 시도 중...' : '다시 시도'}
              </Button>
              <Button onClick={() => router.push('/admin/inquiries')} variant="default">
                문의 목록으로 이동
              </Button>
            </div>
          </div>
          
          {/* 도움말 정보 */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-blue-800 font-medium mb-2">문제 해결 방법:</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• 문의 목록에서 올바른 문의를 선택했는지 확인해주세요</li>
              <li>• 페이지를 새로고침하거나 잠시 후 다시 시도해주세요</li>
              <li>• 문제가 지속되면 시스템 관리자에게 문의해주세요</li>
            </ul>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin/inquiries')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              목록으로
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">문의 상세</h1>
              <p className="text-gray-600 mt-1">문의 ID: {inquiry.id}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusBadge(inquiry.status)}
          </div>
        </div>

        {/* 문의자 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              문의자 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">이름</label>
                <p className="text-gray-900 mt-1">{inquiry.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">회사</label>
                <p className="text-gray-900 mt-1">{inquiry.company || '정보 없음'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">이메일</label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a href={`mailto:${inquiry.email}`} className="text-blue-600 hover:underline">
                    {inquiry.email}
                  </a>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">전화번호</label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{inquiry.phone || '정보 없음'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 문의 내용 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              문의 내용
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">문의 유형</label>
              <p className="text-gray-900 mt-1">{getInquiryTypeLabel(inquiry.inquiry_type)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">제목</label>
              <p className="text-gray-900 mt-1 font-medium">{inquiry.subject}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">내용</label>
              <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-900 whitespace-pre-wrap">{inquiry.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 처리 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              처리 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">접수일시</label>
                <p className="text-gray-900 mt-1">{formatDate(inquiry.created_at)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">수정일시</label>
                <p className="text-gray-900 mt-1">{formatDate(inquiry.updated_at)}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-600">상태 변경</label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={inquiry.status === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateStatus('pending')}
                  disabled={updating}
                >
                  대기
                </Button>
                <Button
                  variant={inquiry.status === 'in_progress' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateStatus('in_progress')}
                  disabled={updating}
                >
                  처리중
                </Button>
                <Button
                  variant={inquiry.status === 'resolved' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateStatus('resolved')}
                  disabled={updating}
                >
                  완료
                </Button>
                <Button
                  variant={inquiry.status === 'cancelled' ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => updateStatus('cancelled')}
                  disabled={updating}
                >
                  취소
                </Button>
              </div>
              {updating && (
                <p className="text-sm text-gray-500 mt-2">상태를 업데이트하는 중...</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 답변 작성 */}
        <Card>
          <CardHeader>
            <CardTitle>답변 작성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <h3 className="text-yellow-800 font-medium">구현 중인 기능</h3>
              </div>
              <p className="text-yellow-700 mt-2">
                문의 답변 작성 기능이 아직 구현되지 않았습니다. 현재는 이메일로 직접 답변해주세요. 🚧
              </p>
              <Button
                className="mt-3"
                onClick={() => window.open(`mailto:${inquiry.email}?subject=Re: ${inquiry.subject}`)}
              >
                이메일로 답변하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 