import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Eye,
  Share2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface NoticePageProps {
  params: { id: string }
}

// 임시 데이터 - 실제로는 API에서 가져올 예정
const getNoticeById = (id: string) => {
  const notices = [
    {
      id: 1,
      title: "GanziCorp 공식 홈페이지 오픈",
      content: `안녕하세요. GanziCorp의 공식 홈페이지가 새롭게 오픈되었습니다.

저희 GanziCorp은 혁신적인 기술 솔루션을 제공하는 전문 기업으로, 고객의 성공을 위해 최선을 다하고 있습니다.

## 주요 특징

### 1. 최신 기술 스택
- Next.js 15 기반의 현대적인 웹 애플리케이션
- TypeScript를 활용한 안전한 개발 환경
- Tailwind CSS로 구성된 반응형 디자인
- Supabase를 통한 실시간 데이터베이스 연동

### 2. 사용자 중심 설계
- 직관적이고 깔끔한 사용자 인터페이스
- 모바일 최적화된 반응형 레이아웃
- 빠른 로딩 속도와 원활한 사용자 경험

### 3. 보안과 안정성
- 최신 보안 표준 준수
- 안전한 사용자 인증 시스템
- 데이터 보호를 위한 강화된 보안 정책

## 앞으로의 계획

앞으로 저희는 다음과 같은 서비스들을 순차적으로 선보일 예정입니다:

1. **AI 기반 솔루션**: 최신 인공지능 기술을 활용한 맞춤형 솔루션
2. **클라우드 서비스**: 안정적이고 확장 가능한 클라우드 인프라
3. **컨설팅 서비스**: 전문가들의 체계적인 기술 컨설팅

많은 관심과 지원 부탁드리며, 궁금한 사항이 있으시면 언제든지 연락주시기 바랍니다.

감사합니다.`,
      category: "공지",
      status: "published",
      isPinned: true,
      views: 245,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      author: "관리자",
      important: true
    },
    {
      id: 2,
      title: "새로운 AI 솔루션 서비스 출시",
      content: `최신 AI 기술을 활용한 맞춤형 솔루션 서비스를 출시했습니다.

## 서비스 개요

저희 GanziCorp에서 개발한 AI 솔루션은 다음과 같은 특징을 가지고 있습니다:

### 핵심 기능
- **자연어 처리**: 고도화된 NLP 기술로 정확한 언어 이해
- **머신러닝**: 데이터 기반의 지능적인 의사결정 지원
- **실시간 분석**: 빠른 데이터 처리와 즉시 결과 제공

### 적용 분야
1. 고객 서비스 자동화
2. 데이터 분석 및 인사이트 도출
3. 업무 프로세스 최적화
4. 예측 분석 및 추천 시스템

## 이용 방법

서비스 이용을 원하시는 분들은 다음 절차를 따라주세요:

1. 홈페이지에서 서비스 신청
2. 전문가 상담 진행
3. 맞춤형 솔루션 설계
4. 구현 및 배포
5. 지속적인 모니터링 및 개선

자세한 내용은 서비스 페이지를 확인해 주시거나, 직접 문의해 주시기 바랍니다.`,
      category: "서비스",
      status: "published",
      isPinned: false,
      views: 189,
      createdAt: "2024-01-10T14:20:00Z",
      updatedAt: "2024-01-10T14:20:00Z",
      author: "개발팀",
      important: false
    }
  ]
  
  return notices.find(notice => notice.id === parseInt(id))
}

// 관련 공지사항 가져오기
const getRelatedNotices = (currentId: number) => {
  const notices = [
    { id: 1, title: "GanziCorp 공식 홈페이지 오픈" },
    { id: 2, title: "새로운 AI 솔루션 서비스 출시" },
    { id: 3, title: "2024년 첫 번째 기술 세미나 개최 안내" },
  ]
  
  return notices.filter(notice => notice.id !== currentId).slice(0, 3)
}

export async function generateMetadata({ params }: NoticePageProps): Promise<Metadata> {
  const notice = getNoticeById(params.id)
  
  if (!notice) {
    return {
      title: '공지사항을 찾을 수 없습니다 | GanziCorp'
    }
  }

  return {
    title: `${notice.title} | GanziCorp`,
    description: notice.content.substring(0, 160).replace(/\n/g, ' ').trim() + '...',
    openGraph: {
      title: notice.title,
      description: notice.content.substring(0, 160).replace(/\n/g, ' ').trim() + '...',
      url: `https://ganzicorp.com/notices/${notice.id}`,
    },
  }
}

export default function NoticePage({ params }: NoticePageProps) {
  const notice = getNoticeById(params.id)
  
  if (!notice) {
    notFound()
  }

  const relatedNotices = getRelatedNotices(notice.id)

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
      case "공지": return "bg-blue-500/10 text-blue-600"
      case "서비스": return "bg-green-500/10 text-green-600"
      case "이벤트": return "bg-purple-500/10 text-purple-600"
      case "기술": return "bg-orange-500/10 text-orange-600"
      default: return "bg-gray-500/10 text-gray-600"
    }
  }

  return (
    <MainLayout>
      {/* Breadcrumb */}
      <section className="py-8 px-4 border-b">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">홈</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/notices" className="hover:text-primary">공지사항</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{notice.title}</span>
          </div>
          
          <Link href="/notices">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              목록으로 돌아가기
            </Button>
          </Link>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              {/* Meta Info */}
              <div className="flex items-center gap-3 mb-6">
                <Badge 
                  variant="secondary" 
                  className={getCategoryColor(notice.category)}
                >
                  {notice.category}
                </Badge>
                {notice.important && (
                  <Badge variant="destructive">중요</Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-foreground mb-6">
                {notice.title}
              </h1>

              {/* Article Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{notice.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(notice.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{notice.views.toLocaleString()}회</span>
                </div>
                <Button variant="ghost" size="sm" className="h-auto p-0">
                  <Share2 className="h-4 w-4 mr-1" />
                  공유
                </Button>
              </div>

              <Separator className="mb-8" />

              {/* Content */}
              <div className="prose prose-gray max-w-none">
                {notice.content.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-foreground">
                        {paragraph.replace('## ', '')}
                      </h2>
                    )
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-foreground">
                        {paragraph.replace('### ', '')}
                      </h3>
                    )
                  }
                  if (paragraph.startsWith('- ')) {
                    return (
                      <li key={index} className="ml-4 mb-2">
                        {paragraph.replace('- ', '')}
                      </li>
                    )
                  }
                  if (paragraph.match(/^\d+\. /)) {
                    return (
                      <li key={index} className="ml-4 mb-2 list-decimal">
                        {paragraph.replace(/^\d+\. /, '')}
                      </li>
                    )
                  }
                  if (paragraph.trim() === '') {
                    return <br key={index} />
                  }
                  return (
                    <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-8 px-4 border-t">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <Button variant="outline" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              이전 글
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              다음 글
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Related Notices */}
      {relatedNotices.length > 0 && (
        <section className="py-12 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">관련 공지사항</h2>
            <div className="grid gap-4">
              {relatedNotices.map((relatedNotice) => (
                <Card key={relatedNotice.id} className="hover-lift">
                  <CardContent className="p-4">
                    <Link 
                      href={`/notices/${relatedNotice.id}`}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      {relatedNotice.title}
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  )
} 