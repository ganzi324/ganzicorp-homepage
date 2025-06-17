import MainLayout from "@/components/layout/MainLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft,
  Calendar,
  Eye,
  User,
  Share2,
  Print,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// 임시 데이터 - 실제로는 Supabase에서 가져올 예정
const notices = [
  {
    id: 1,
    title: "GanziCorp 공식 홈페이지 오픈",
    content: `안녕하세요. GanziCorp의 공식 홈페이지가 새롭게 오픈되었습니다.

이번에 새롭게 오픈한 홈페이지는 다음과 같은 특징을 가지고 있습니다:

## 주요 특징

### 1. 현대적인 디자인
- 반응형 웹 디자인으로 모든 디바이스에서 최적화된 경험을 제공합니다
- 직관적인 사용자 인터페이스로 쉽게 원하는 정보를 찾을 수 있습니다

### 2. 빠른 성능
- Next.js 15를 기반으로 구축되어 빠른 로딩 속도를 자랑합니다
- 최신 웹 기술을 활용하여 사용자 경험을 극대화했습니다

### 3. 풍부한 콘텐츠
- 회사 소개, 서비스 안내, 포트폴리오 등 다양한 정보를 제공합니다
- 정기적으로 업데이트되는 공지사항과 기술 블로그를 통해 최신 소식을 전해드립니다

## 앞으로의 계획

앞으로도 지속적으로 콘텐츠를 업데이트하고 사용자 경험을 개선해 나가겠습니다. 
궁금한 점이나 문의사항이 있으시면 언제든지 연락해 주세요.

감사합니다.`,
    category: "공지",
    status: "published",
    isPinned: true,
    views: 245,
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
    author: "관리자",
    tags: ["홈페이지", "오픈", "공지"]
  },
  {
    id: 2,
    title: "새로운 AI 솔루션 서비스 출시",
    content: `최신 AI 기술을 활용한 맞춤형 솔루션 서비스를 출시했습니다.

## 서비스 개요

저희 GanziCorp에서는 고객의 다양한 비즈니스 요구사항에 맞춘 AI 솔루션을 제공합니다.

### 주요 서비스

1. **자연어 처리 (NLP)**
   - 챗봇 개발
   - 문서 분석 및 요약
   - 감정 분석

2. **컴퓨터 비전**
   - 이미지 인식 및 분류
   - 객체 탐지
   - OCR (광학 문자 인식)

3. **예측 분석**
   - 매출 예측
   - 고객 행동 분석
   - 리스크 평가

## 도입 효과

- **업무 효율성 향상**: 반복적인 작업을 자동화하여 생산성을 크게 향상시킵니다
- **비용 절감**: 인력 비용을 절약하고 운영 효율성을 높입니다
- **정확도 개선**: 인간의 실수를 줄이고 일관된 품질을 보장합니다

자세한 내용은 서비스 페이지를 확인해 주세요.`,
    category: "서비스",
    status: "published",
    isPinned: false,
    views: 189,
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
    author: "개발팀",
    tags: ["AI", "솔루션", "서비스"]
  },
  {
    id: 3,
    title: "2024년 첫 번째 기술 세미나 개최 안내",
    content: `최신 웹 개발 트렌드와 AI 기술에 대한 세미나를 개최합니다.

## 세미나 정보

**일시**: 2024년 2월 15일 (목) 오후 2시 - 5시
**장소**: 서울 강남구 GanziCorp 본사 세미나실
**참가비**: 무료

## 프로그램

### 세션 1: 웹 개발 트렌드 (14:00 - 15:00)
- Next.js 15 새로운 기능
- React Server Components 활용법
- 성능 최적화 전략

### 세션 2: AI 기술 동향 (15:30 - 16:30)
- 생성형 AI의 비즈니스 활용
- 머신러닝 모델 배포 전략
- AI 윤리와 책임

### 세션 3: Q&A 및 네트워킹 (16:30 - 17:00)
- 자유로운 질의응답 시간
- 참가자 간 네트워킹

## 신청 방법

이메일(contact@ganzicorp.com) 또는 전화(02-1234-5678)로 신청해 주세요.
선착순 50명까지 접수 가능합니다.

많은 관심과 참여 부탁드립니다.`,
    category: "이벤트",
    status: "published",
    isPinned: false,
    views: 156,
    createdAt: "2024-01-05T11:15:00Z",
    updatedAt: "2024-01-05T11:15:00Z",
    author: "기획팀",
    tags: ["세미나", "기술", "이벤트"]
  }
]

interface NoticeDetailPageProps {
  params: {
    id: string
  }
}

export default function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const noticeId = parseInt(params.id)
  const notice = notices.find(n => n.id === noticeId)

  if (!notice) {
    notFound()
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
      case "공지": return "bg-blue-500/10 text-blue-600"
      case "서비스": return "bg-green-500/10 text-green-600"
      case "이벤트": return "bg-purple-500/10 text-purple-600"
      case "기술": return "bg-orange-500/10 text-orange-600"
      default: return "bg-gray-500/10 text-gray-600"
    }
  }

  // 이전/다음 공지사항 찾기
  const currentIndex = notices.findIndex(n => n.id === noticeId)
  const prevNotice = currentIndex > 0 ? notices[currentIndex - 1] : null
  const nextNotice = currentIndex < notices.length - 1 ? notices[currentIndex + 1] : null

  return (
    <MainLayout>
      {/* 헤더 */}
      <section className="py-8 px-4 border-b">
        <div className="max-w-4xl mx-auto">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/notices" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              공지사항 목록으로
            </Link>
          </Button>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className={getCategoryColor(notice.category)}>
                {notice.category}
              </Badge>
              {notice.isPinned && (
                <Badge variant="secondary">
                  고정
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {notice.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {notice.author}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(notice.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {notice.views}회
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 본문 */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* 메인 콘텐츠 */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-8">
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: notice.content.replace(/\n/g, '<br/>').replace(/## /g, '<h2>').replace(/### /g, '<h3>') 
                    }}
                  />
                </CardContent>
              </Card>

              {/* 태그 */}
              {notice.tags && notice.tags.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">태그</h3>
                  <div className="flex flex-wrap gap-2">
                    {notice.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* 이전/다음 공지사항 */}
              <div className="mt-12 space-y-4">
                {nextNotice && (
                  <Card className="hover-lift">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">다음 글</p>
                          <Link 
                            href={`/notices/${nextNotice.id}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {nextNotice.title}
                          </Link>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {prevNotice && (
                  <Card className="hover-lift">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">이전 글</p>
                          <Link 
                            href={`/notices/${prevNotice.id}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {prevNotice.title}
                          </Link>
                        </div>
                        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* 사이드바 */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* 공유 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">공유하기</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Share2 className="h-4 w-4 mr-2" />
                      링크 복사
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Print className="h-4 w-4 mr-2" />
                      인쇄하기
                    </Button>
                  </CardContent>
                </Card>

                {/* 관련 공지사항 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">관련 공지사항</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {notices
                      .filter(n => n.id !== notice.id && n.category === notice.category)
                      .slice(0, 3)
                      .map((relatedNotice) => (
                        <Link
                          key={relatedNotice.id}
                          href={`/notices/${relatedNotice.id}`}
                          className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">
                            {relatedNotice.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(relatedNotice.createdAt)}
                          </p>
                        </Link>
                      ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}

// 정적 생성을 위한 함수들 (옵션)
export async function generateStaticParams() {
  return notices.map((notice) => ({
    id: notice.id.toString(),
  }))
}

export async function generateMetadata({ params }: NoticeDetailPageProps) {
  const noticeId = parseInt(params.id)
  const notice = notices.find(n => n.id === noticeId)

  if (!notice) {
    return {
      title: '공지사항을 찾을 수 없습니다 - GanziCorp',
    }
  }

  return {
    title: `${notice.title} - GanziCorp`,
    description: notice.content.slice(0, 160) + '...',
  }
} 