import { Metadata } from 'next'
import Link from 'next/link'
import AdminLayout from '@/components/layout/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  MoreHorizontal,
  Pin,
  Archive
} from 'lucide-react'

export const metadata: Metadata = {
  title: '공지사항 관리 | 관리자',
  description: '공지사항 관리 페이지',
}

// 임시 공지사항 데이터
const notices = [
  {
    id: 1,
    title: 'GanziCorp 공식 홈페이지 오픈',
    content: '안녕하세요. GanziCorp의 공식 홈페이지가 새롭게 오픈되었습니다...',
    status: 'published',
    isPinned: true,
    views: 245,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    author: '관리자',
    category: '공지'
  },
  {
    id: 2,
    title: '새로운 AI 솔루션 서비스 출시',
    content: '최신 AI 기술을 활용한 맞춤형 솔루션 서비스를 출시했습니다...',
    status: 'published',
    isPinned: false,
    views: 189,
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
    author: '개발팀',
    category: '서비스'
  },
  {
    id: 3,
    title: '2024년 첫 번째 기술 세미나 개최 안내',
    content: '최신 웹 개발 트렌드와 AI 기술에 대한 세미나를 개최합니다...',
    status: 'draft',
    isPinned: false,
    views: 0,
    createdAt: '2024-01-05T11:15:00Z',
    updatedAt: '2024-01-05T11:15:00Z',
    author: '기획팀',
    category: '이벤트'
  },
  {
    id: 4,
    title: '설날 연휴 운영 안내',
    content: '설날 연휴 기간 동안의 운영 일정을 안내드립니다...',
    status: 'published',
    isPinned: false,
    views: 98,
    createdAt: '2024-01-03T09:00:00Z',
    updatedAt: '2024-01-03T09:00:00Z',
    author: '관리자',
    category: '공지'
  },
  {
    id: 5,
    title: '클라우드 인프라 업그레이드 완료',
    content: '서비스 안정성 향상을 위한 클라우드 인프라 업그레이드가 성공적으로 완료되었습니다...',
    status: 'published',
    isPinned: false,
    views: 134,
    createdAt: '2023-12-28T16:45:00Z',
    updatedAt: '2023-12-28T16:45:00Z',
    author: '인프라팀',
    category: '기술'
  }
]

export default function AdminNoticesPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 border-green-200">발행됨</Badge>
      case 'draft':
        return <Badge variant="secondary">임시저장</Badge>
      case 'archived':
        return <Badge variant="outline">보관됨</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    const colors = {
      '공지': 'bg-blue-100 text-blue-800 border-blue-200',
      '서비스': 'bg-green-100 text-green-800 border-green-200',
      '이벤트': 'bg-purple-100 text-purple-800 border-purple-200',
      '기술': 'bg-orange-100 text-orange-800 border-orange-200'
    }
    return (
      <Badge className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'}>
        {category}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 페이지 헤더 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">공지사항 관리</h1>
            <p className="text-gray-600 mt-1">공지사항을 생성, 수정, 삭제할 수 있습니다</p>
          </div>
          <Button asChild>
            <Link href="/admin/notices/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              새 공지사항 작성
            </Link>
          </Button>
        </div>

        {/* 필터 및 검색 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="공지사항 제목 검색..."
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  전체
                </Button>
                <Button variant="outline" size="sm">
                  발행됨
                </Button>
                <Button variant="outline" size="sm">
                  임시저장
                </Button>
                <Button variant="outline" size="sm">
                  보관됨
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 공지사항 목록 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>공지사항 목록</span>
              <Badge variant="secondary">{notices.length}개</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">제목</th>
                    <th className="text-left p-4 font-medium text-gray-900">카테고리</th>
                    <th className="text-left p-4 font-medium text-gray-900">상태</th>
                    <th className="text-left p-4 font-medium text-gray-900">작성자</th>
                    <th className="text-left p-4 font-medium text-gray-900">조회수</th>
                    <th className="text-left p-4 font-medium text-gray-900">작성일</th>
                    <th className="text-left p-4 font-medium text-gray-900">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {notices.map((notice) => (
                    <tr key={notice.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {notice.isPinned && (
                            <Pin className="h-4 w-4 text-blue-600" />
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                              <Link href={`/admin/notices/${notice.id}`}>
                                {notice.title}
                              </Link>
                            </h4>
                            <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                              {notice.content}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {getCategoryBadge(notice.category)}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(notice.status)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{notice.author}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{notice.views}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{formatDate(notice.createdAt)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/notices/${notice.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/notices/${notice.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Archive className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            총 {notices.length}개의 공지사항
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              이전
            </Button>
            <Button variant="default" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              다음
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 