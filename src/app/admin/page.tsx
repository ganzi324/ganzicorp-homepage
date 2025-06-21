'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/layout/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Plus,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'

interface Notice {
  id: number
  title: string
  is_published: boolean
  is_pinned: boolean
  views: number
  created_at: string
  author: string
}

interface Inquiry {
  id: number
  name: string
  email: string
  subject: string
  status: string
  created_at: string
}

interface Stats {
  totalNotices: number
  totalInquiries: number
  pendingInquiries: number
  resolvedInquiries: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalNotices: 0,
    totalInquiries: 0,
    pendingInquiries: 0,
    resolvedInquiries: 0
  })
  const [recentNotices, setRecentNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // 공지사항과 문의 데이터를 병렬로 가져오기
      const [noticesResponse, inquiriesResponse] = await Promise.all([
        fetch('/api/admin/notices'),
        fetch('/api/admin/inquiries')
      ])

      if (!noticesResponse.ok || !inquiriesResponse.ok) {
        throw new Error('데이터를 불러오는데 실패했습니다.')
      }

      const [noticesData, inquiriesData] = await Promise.all([
        noticesResponse.json(),
        inquiriesResponse.json()
      ])

      if (noticesData.success && inquiriesData.inquiries) {
        const notices = noticesData.data || []
        const inquiries = inquiriesData.inquiries || []

        // 통계 계산
        const newStats = {
          totalNotices: notices.length,
          totalInquiries: inquiries.length,
          pendingInquiries: inquiries.filter((i: Inquiry) => i.status === 'pending').length,
          resolvedInquiries: inquiries.filter((i: Inquiry) => i.status === 'resolved').length
        }
        setStats(newStats)

        // 최근 공지사항 (최대 4개)
        setRecentNotices(notices.slice(0, 4))
      } else {
        throw new Error('데이터 형식이 올바르지 않습니다.')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError(error instanceof Error ? error.message : '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (is_published: boolean) => {
    return is_published 
      ? <Badge className="bg-green-100 text-green-800 border-green-200">발행됨</Badge>
      : <Badge variant="secondary">임시저장</Badge>
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">대시보드 데이터를 불러오는 중...</span>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-red-800 font-medium">오류가 발생했습니다</h3>
          </div>
          <p className="text-red-600 mt-2">{error}</p>
          <Button onClick={fetchDashboardData} variant="outline" className="mt-4">
            다시 시도
          </Button>
        </div>
      </AdminLayout>
    )
  }

  const statsData = [
    {
      title: '총 공지사항',
      value: stats.totalNotices.toString(),
      icon: FileText
    },
    {
      title: '총 문의',
      value: stats.totalInquiries.toString(),
      icon: MessageSquare
    },
    {
      title: '대기 중인 문의',
      value: stats.pendingInquiries.toString(),
      icon: Clock
    },
    {
      title: '해결된 문의',
      value: stats.resolvedInquiries.toString(),
      icon: CheckCircle
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
            <p className="text-gray-600 mt-1">GanziCorp 관리자 대시보드에 오신 것을 환영합니다</p>
          </div>
          <Button asChild className="flex items-center gap-2">
            <Link href="/admin/notices/new">
              <Plus className="h-4 w-4" />
              새 공지사항
            </Link>
          </Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        실시간 데이터
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 최근 공지사항 */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>최근 공지사항</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/notices">전체 보기</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentNotices.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">등록된 공지사항이 없습니다.</p>
                  <Button asChild className="mt-4">
                    <Link href="/admin/notices/new">첫 공지사항 작성하기</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentNotices.map((notice) => (
                    <div key={notice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{notice.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(notice.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {notice.views || 0}회
                          </span>
                          <span>{notice.author || '관리자'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(notice.is_published)}
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/notices/${notice.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" disabled title="삭제 기능 구현 필요 🚧">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 빠른 작업 */}
          <Card>
            <CardHeader>
              <CardTitle>빠른 작업</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/admin/notices/new">
                    <Plus className="h-4 w-4 mr-2" />
                    새 공지사항 작성
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" disabled title="사용자 관리 기능 - 아직 구현되지 않음 🚧">
                  <Users className="h-4 w-4 mr-2" />
                  사용자 관리 🚧
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/admin/notices?status=draft">
                    <FileText className="h-4 w-4 mr-2" />
                    임시저장 목록
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" disabled title="통계 페이지 - 아직 구현되지 않음 🚧">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  통계 보기 🚧
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 시스템 상태 */}
        <Card>
          <CardHeader>
            <CardTitle>시스템 상태</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">데이터베이스</p>
                  <p className="text-sm text-green-700">정상 작동</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">API 서버</p>
                  <p className="text-sm text-green-700">정상 작동</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-900">백업 시스템</p>
                  <p className="text-sm text-yellow-700">점검 중</p>
                </div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 