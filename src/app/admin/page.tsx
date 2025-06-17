import { Metadata } from 'next'
import AdminLayout from '@/components/layout/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Users, 
  Eye, 
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Calendar
} from 'lucide-react'

export const metadata: Metadata = {
  title: '관리자 대시보드 | GanziCorp',
  description: 'GanziCorp 관리자 대시보드',
}

// 임시 통계 데이터
const stats = [
  {
    title: '총 공지사항',
    value: '24',
    change: '+3',
    changeType: 'increase' as const,
    icon: FileText
  },
  {
    title: '총 사용자',
    value: '1,234',
    change: '+12',
    changeType: 'increase' as const,
    icon: Users
  },
  {
    title: '이번 달 조회수',
    value: '12,543',
    change: '+5.2%',
    changeType: 'increase' as const,
    icon: Eye
  },
  {
    title: '활성 공지사항',
    value: '18',
    change: '+2',
    changeType: 'increase' as const,
    icon: TrendingUp
  }
]

// 최근 공지사항 데이터
const recentNotices = [
  {
    id: 1,
    title: 'GanziCorp 공식 홈페이지 오픈',
    status: 'published',
    views: 245,
    createdAt: '2024-01-15',
    author: '관리자'
  },
  {
    id: 2,
    title: '새로운 AI 솔루션 서비스 출시',
    status: 'published',
    views: 189,
    createdAt: '2024-01-10',
    author: '개발팀'
  },
  {
    id: 3,
    title: '2024년 첫 번째 기술 세미나 개최 안내',
    status: 'draft',
    views: 0,
    createdAt: '2024-01-05',
    author: '기획팀'
  },
  {
    id: 4,
    title: '설날 연휴 운영 안내',
    status: 'published',
    views: 98,
    createdAt: '2024-01-03',
    author: '관리자'
  }
]

export default function AdminDashboard() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">발행됨</Badge>
      case 'draft':
        return <Badge variant="secondary">임시저장</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
            <p className="text-gray-600 mt-1">GanziCorp 관리자 대시보드에 오신 것을 환영합니다</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            새 공지사항
          </Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <p className="text-sm text-green-600 mt-1">
                        {stat.change} 지난 달 대비
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
              <Button variant="outline" size="sm">
                전체 보기
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotices.map((notice) => (
                  <div key={notice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{notice.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(notice.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {notice.views}회
                        </span>
                        <span>{notice.author}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(notice.status)}
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 빠른 작업 */}
          <Card>
            <CardHeader>
              <CardTitle>빠른 작업</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  새 공지사항 작성
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  사용자 관리
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  임시저장 목록
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  통계 보기
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                <p className="text-sm font-medium text-gray-900">데이터베이스</p>
                <p className="text-xs text-gray-500">정상 작동</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                <p className="text-sm font-medium text-gray-900">API 서버</p>
                <p className="text-xs text-gray-500">정상 작동</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                <p className="text-sm font-medium text-gray-900">백업 시스템</p>
                <p className="text-xs text-gray-500">점검 중</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 