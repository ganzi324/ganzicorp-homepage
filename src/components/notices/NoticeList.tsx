'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search,
  Calendar,
  Eye,
  Pin,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

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
  important?: boolean
}

interface NoticeListProps {
  notices: Notice[]
  itemsPerPage?: number
  showSearch?: boolean
  showFilters?: boolean
  showPagination?: boolean
}

const categories = ["전체", "공지", "서비스", "이벤트", "기술"]

export default function NoticeList({ 
  notices, 
  itemsPerPage = 10,
  showSearch = true,
  showFilters = true,
  showPagination = true 
}: NoticeListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "공지": return "bg-blue-500/10 text-blue-600 border-blue-200"
      case "서비스": return "bg-green-500/10 text-green-600 border-green-200"
      case "이벤트": return "bg-purple-500/10 text-purple-600 border-purple-200"
      case "기술": return "bg-orange-500/10 text-orange-600 border-orange-200"
      default: return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // 필터링된 공지사항
  const filteredNotices = useMemo(() => {
    return notices.filter(notice => {
      const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notice.content.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === '전체' || notice.category === selectedCategory
      
      return matchesSearch && matchesCategory && notice.status === 'published'
    })
  }, [notices, searchTerm, selectedCategory])

  // 상단 고정 공지사항과 일반 공지사항 분리
  const pinnedNotices = filteredNotices.filter(notice => notice.isPinned)
  const regularNotices = filteredNotices.filter(notice => !notice.isPinned)

  // 페이지네이션
  const totalPages = Math.ceil(regularNotices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedNotices = regularNotices.slice(startIndex, endIndex)

  // 표시할 공지사항 (상단 고정 + 페이지네이션된 일반 공지사항)
  const displayNotices = currentPage === 1 
    ? [...pinnedNotices, ...paginatedNotices]
    : paginatedNotices

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // 스크롤을 맨 위로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getPageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index)
  }

  return (
    <div className="space-y-8">
      {/* 검색 및 필터 */}
      {(showSearch || showFilters) && (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {showSearch && (
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="공지사항 검색..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1) // 검색 시 첫 페이지로 이동
                  }}
                />
              </div>
            </div>
          )}
          
          {showFilters && (
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className="text-sm"
                  onClick={() => {
                    setSelectedCategory(category)
                    setCurrentPage(1) // 필터 변경 시 첫 페이지로 이동
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 공지사항 목록 */}
      <div className="space-y-4">
        {displayNotices.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">검색 결과가 없습니다</h3>
                <p>다른 검색어를 시도하거나 필터를 변경해보세요.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          displayNotices.map((notice) => (
            <Card key={notice.id} className="hover-lift group transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      {notice.isPinned && (
                        <Pin className="h-4 w-4 text-primary" />
                      )}
                      <Badge 
                        variant="secondary" 
                        className={getCategoryColor(notice.category)}
                      >
                        {notice.category}
                      </Badge>
                      {notice.important && (
                        <Badge variant="destructive" className="text-xs">
                          중요
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(notice.createdAt)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        작성자: {notice.author}
                      </span>
                    </div>
                    
                    <Link href={`/notices/${notice.id}`}>
                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors cursor-pointer">
                        {notice.title}
                      </h3>
                    </Link>
                    
                    <p className="text-muted-foreground line-clamp-2 mb-4">
                      {notice.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{notice.views.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/notices/${notice.id}`} className="flex items-center gap-1">
                          자세히 보기
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            총 {filteredNotices.length}개의 공지사항 
            {filteredNotices.length > 0 && (
              <span>
                ({startIndex + 1}-{Math.min(endIndex, regularNotices.length + pinnedNotices.length)}번째 표시)
              </span>
            )}
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              이전
            </Button>
            
            <div className="flex gap-1">
              {getPageNumbers().map((pageNum, index) => (
                <Button
                  key={index}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  className="min-w-[40px]"
                  onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
                  disabled={pageNum === '...'}
                >
                  {pageNum}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              다음
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 