'use client'

import { useState, useEffect } from 'react'
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
  AlertTriangle
} from 'lucide-react'

interface Notice {
  id: number
  title: string
  content: string
  category: string
  is_published: boolean
  is_pinned: boolean
  views: number
  created_at: string
  updated_at: string
  author: string
}

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchNotices()
  }, [])

  const fetchNotices = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/notices')
      
      if (!response.ok) {
        throw new Error('공지사항을 불러오는데 실패했습니다.')
      }
      
      const data = await response.json()
      if (data.success) {
        setNotices(data.data || [])
      } else {
        throw new Error(data.error || '데이터를 불러오는데 실패했습니다.')
      }
    } catch (error) {
      console.error('Error fetching notices:', error)
      setError(error instanceof Error ? error.message : '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const deleteNotice = async (id: number) => {
    if (!confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/notices/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('삭제에 실패했습니다.')
      }
      
      await fetchNotices()
      alert('공지사항이 삭제되었습니다.')
    } catch (error) {
      console.error('Error deleting notice:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const getStatusBadge = (is_published: boolean) => {
    return is_published 
      ? <Badge className="bg-green-100 text-green-800 border-green-200">발행됨</Badge>
      : <Badge variant="secondary">임시저장</Badge>
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

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && notice.is_published) ||
                         (statusFilter === 'draft' && !notice.is_published)
    return matchesSearch && matchesStatus
  })

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

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-red-800 font-medium">오류가 발생했습니다</h3>
          </div>
          <p className="text-red-600 mt-2">{error}</p>
          <Button onClick={fetchNotices} variant="outline" className="mt-4">
            다시 시도
          </Button>
        </div>
      </AdminLayout>
    )
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button 
                  variant={statusFilter === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  전체
                </Button>
                <Button 
                  variant={statusFilter === 'published' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setStatusFilter('published')}
                >
                  발행됨
                </Button>
                <Button 
                  variant={statusFilter === 'draft' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setStatusFilter('draft')}
                >
                  임시저장
                </Button>
                <Button variant="outline" size="sm" disabled title="아직 구현되지 않은 기능입니다">
                  보관됨 🚧
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
              <Badge variant="secondary">{filteredNotices.length}개</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredNotices.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || statusFilter !== 'all' ? '검색 결과가 없습니다' : '공지사항이 없습니다'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all' 
                    ? '다른 검색어나 필터를 시도해보세요.' 
                    : '첫 번째 공지사항을 작성해보세요.'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button asChild className="mt-4">
                    <Link href="/admin/notices/new">새 공지사항 작성</Link>
                  </Button>
                )}
              </div>
            ) : (
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
                    {filteredNotices.map((notice) => (
                      <tr key={notice.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {notice.is_pinned && (
                              <Pin className="h-4 w-4 text-yellow-600" />
                            )}
                            <div>
                              <div className="font-medium text-gray-900">
                                {notice.title}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {notice.content.substring(0, 60)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {getCategoryBadge(notice.category || '공지')}
                        </td>
                        <td className="p-4">
                          {getStatusBadge(notice.is_published)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{notice.author || '관리자'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{notice.views || 0}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{formatDate(notice.created_at)}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/notices/${notice.id}/edit`} title="공지사항 편집">
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link 
                                href={`/notices/${notice.id}${!notice.is_published ? '?preview=true' : ''}`} 
                                target="_blank" 
                                title={notice.is_published ? "공지사항 보기" : "미리보기 (임시저장)"}
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotice(notice.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="공지사항 삭제"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled
                              title="추가 기능 - 아직 구현되지 않음 🚧"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">전체 공지사항</p>
                <p className="text-2xl font-bold text-gray-900">{notices.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">발행된 공지</p>
                <p className="text-2xl font-bold text-green-600">
                  {notices.filter(n => n.is_published).length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">임시저장</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {notices.filter(n => !n.is_published).length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">총 조회수</p>
                <p className="text-2xl font-bold text-blue-600">
                  {notices.reduce((sum, n) => sum + (n.views || 0), 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
} 