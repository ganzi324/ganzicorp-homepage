'use client'

import { useEffect, useMemo, useCallback, memo, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/AuthProvider'
import { useRealtimeInquiries } from '@/hooks/useRealtimeInquiries'
import { Inquiry } from '@/lib/supabase'

const getStatusBadge = (status: string) => {
  const configs = {
    pending: { variant: 'default' as const, label: '대기' },
    in_progress: { variant: 'secondary' as const, label: '처리중' },
    resolved: { variant: 'outline' as const, label: '완료' }
  }
  
  const config = configs[status as keyof typeof configs] || configs.pending
  return <Badge variant={config.variant}>{config.label}</Badge>
}

const getConnectionStatusBadge = (status: string) => {
  const configs = {
    connected: { variant: 'outline' as const, label: '연결됨', color: 'text-green-600' },
    connecting: { variant: 'secondary' as const, label: '연결중...', color: 'text-yellow-600' },
    disconnected: { variant: 'destructive' as const, label: '연결 끊김', color: 'text-red-600' }
  }
  
  const config = configs[status as keyof typeof configs] || configs.disconnected
  return (
    <Badge variant={config.variant} className={config.color}>
      {config.label}
    </Badge>
  )
}

// Memoized inquiry card component for better performance
const InquiryCard = memo(({ inquiry, onViewDetails }: {
  inquiry: Inquiry
  onViewDetails: (id: string) => void
}) => {
  const handleViewClick = useCallback(() => {
    onViewDetails(inquiry.id)
  }, [inquiry.id, onViewDetails])

  const formattedDate = useMemo(() => {
    return new Date(inquiry.created_at).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }, [inquiry.created_at])

  return (
    <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{inquiry.subject}</CardTitle>
            <CardDescription>
              {inquiry.name} ({inquiry.email})
            </CardDescription>
          </div>
          {getStatusBadge(inquiry.status)}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {inquiry.message}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{formattedDate}</span>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleViewClick}
          >
            상세보기
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})

InquiryCard.displayName = 'InquiryCard'

// Memoized status filter component
const StatusFilter = memo(({ selectedStatus, onStatusChange, totalCount }: {
  selectedStatus: string
  onStatusChange: (status: string) => void
  totalCount: number
}) => {
  const statusOptions = useMemo(() => [
    { value: 'all', label: `전체 (${totalCount})` },
    { value: 'pending', label: '대기' },
    { value: 'in_progress', label: '처리중' },
    { value: 'resolved', label: '완료' }
  ], [totalCount])

  return (
    <div className="flex space-x-2">
      {statusOptions.map(option => (
        <Button
          key={option.value}
          variant={selectedStatus === option.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onStatusChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
})

StatusFilter.displayName = 'StatusFilter'

export default function AdminInquiriesPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  
  // Memoized status filter state
  const [selectedStatus, setSelectedStatus] = useState('all')
  
  // 권한 체크 - 로딩이 완료된 후에만 체크
  const isAuthorized = useMemo(() => {
    if (loading) return null // 로딩 중
    return user && isAdmin // 권한 있음/없음
  }, [user, isAdmin, loading])

  // 권한이 없을 때만 리다이렉트 (한 번만 실행)
  useEffect(() => {
    if (isAuthorized === false) {
      router.push('/auth/login')
    }
  }, [isAuthorized, router])

  // 권한이 확인된 후에만 Realtime 훅 사용
  const { inquiries, loading: inquiriesLoading, error, connectionStatus } = useRealtimeInquiries({
    enabled: isAuthorized === true
  })

  // Memoized filtered inquiries for performance
  const filteredInquiries = useMemo(() => {
    if (selectedStatus === 'all') return inquiries
    return inquiries.filter(inquiry => inquiry.status === selectedStatus)
  }, [inquiries, selectedStatus])

  // Memoized statistics
  const stats = useMemo(() => {
    const total = inquiries.length
    const pending = inquiries.filter(i => i.status === 'pending').length
    const inProgress = inquiries.filter(i => i.status === 'in_progress').length
    const resolved = inquiries.filter(i => i.status === 'resolved').length
    
    return { total, pending, inProgress, resolved }
  }, [inquiries])

  // Memoized handlers
  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status)
  }, [])

  const handleViewDetails = useCallback((id: string) => {
    console.log('Navigating to inquiry detail:', id)
    
    // ID 유효성 검사
    if (!id || typeof id !== 'string') {
      alert('잘못된 문의 ID입니다.')
      return
    }
    
    // 해당 ID의 문의가 실제로 목록에 있는지 확인
    const inquiryExists = inquiries.find(inquiry => inquiry.id === id)
    if (!inquiryExists) {
      alert('해당 문의를 찾을 수 없습니다. 목록을 새로고침해주세요.')
      return
    }
    
    router.push(`/admin/inquiries/${id}`)
  }, [router, inquiries])

  // 로딩 중이거나 권한 확인 중
  if (loading || isAuthorized === null) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">권한을 확인하는 중...</span>
        </div>
      </AdminLayout>
    )
  }

  // 권한이 없음 (리다이렉트 처리 중)
  if (isAuthorized === false) {
    return null
  }

  // 권한이 있음 - 정상 렌더링
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">문의 관리</h1>
            <p className="text-gray-600 mt-1">
              고객 문의를 실시간으로 관리하고 응답하세요
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {getConnectionStatusBadge(connectionStatus)}
            <Button>
              새 문의 작성
            </Button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>전체 문의</CardDescription>
              <CardTitle className="text-2xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>대기 중</CardDescription>
              <CardTitle className="text-2xl text-orange-600">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>처리 중</CardDescription>
              <CardTitle className="text-2xl text-blue-600">{stats.inProgress}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>완료</CardDescription>
              <CardTitle className="text-2xl text-green-600">{stats.resolved}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* 필터 */}
        <div className="flex items-center justify-between">
          <StatusFilter
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
            totalCount={stats.total}
          />
        </div>

        {/* 문의 목록 */}
        <div className="space-y-4">
          {inquiriesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">문의 목록을 불러오는 중...</p>
              </div>
            </div>
          ) : error ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <p className="text-red-600 mb-2">문의 목록을 불러오는 중 오류가 발생했습니다.</p>
                  <p className="text-gray-600 text-sm">{error}</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredInquiries.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <p className="text-gray-600">
                    {selectedStatus === 'all' 
                      ? '등록된 문의가 없습니다.' 
                      : `${selectedStatus} 상태의 문의가 없습니다.`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredInquiries.map((inquiry) => (
                <InquiryCard
                  key={inquiry.id}
                  inquiry={inquiry}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
} 