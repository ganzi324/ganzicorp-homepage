import { Metadata } from "next"
import MainLayout from "@/components/layout/MainLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export const metadata: Metadata = {
  title: "공지사항",
  description: "GanziCorp의 최신 소식과 공지사항을 확인하세요. 새로운 서비스 출시, 기술 세미나, 회사 소식 등을 안내합니다.",
  openGraph: {
    title: "공지사항 - GanziCorp",
    description: "GanziCorp의 최신 소식과 공지사항을 확인하세요.",
    url: "https://ganzicorp.com/notices",
  },
}
import { 
  Search,
  Calendar,
  Eye,
  Pin,
  ArrowRight
} from "lucide-react"

export default function NoticesPage() {
  // 임시 데이터 - 실제로는 Supabase에서 가져올 예정
  const notices = [
    {
      id: 1,
      title: "GanziCorp 공식 홈페이지 오픈",
      content: "안녕하세요. GanziCorp의 공식 홈페이지가 새롭게 오픈되었습니다. 앞으로 다양한 소식과 정보를 공유하겠습니다.",
      category: "공지",
      status: "published",
      isPinned: true,
      views: 245,
      createdAt: "2024-01-15",
      author: "관리자"
    },
    {
      id: 2,
      title: "새로운 AI 솔루션 서비스 출시",
      content: "최신 AI 기술을 활용한 맞춤형 솔루션 서비스를 출시했습니다. 자세한 내용은 서비스 페이지를 확인해 주세요.",
      category: "서비스",
      status: "published",
      isPinned: false,
      views: 189,
      createdAt: "2024-01-10",
      author: "개발팀"
    },
    {
      id: 3,
      title: "2024년 첫 번째 기술 세미나 개최 안내",
      content: "최신 웹 개발 트렌드와 AI 기술에 대한 세미나를 개최합니다. 많은 관심과 참여 부탁드립니다.",
      category: "이벤트",
      status: "published",
      isPinned: false,
      views: 156,
      createdAt: "2024-01-05",
      author: "기획팀"
    },
    {
      id: 4,
      title: "설날 연휴 운영 안내",
      content: "설날 연휴 기간 동안의 운영 일정을 안내드립니다. 긴급 문의사항은 이메일로 연락해 주세요.",
      category: "공지",
      status: "published",
      isPinned: false,
      views: 98,
      createdAt: "2024-01-03",
      author: "관리자"
    },
    {
      id: 5,
      title: "클라우드 인프라 업그레이드 완료",
      content: "서비스 안정성 향상을 위한 클라우드 인프라 업그레이드가 성공적으로 완료되었습니다.",
      category: "기술",
      status: "published",
      isPinned: false,
      views: 134,
      createdAt: "2023-12-28",
      author: "인프라팀"
    }
  ]

  const categories = ["전체", "공지", "서비스", "이벤트", "기술"]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "공지": return "bg-blue-500/10 text-blue-600"
      case "서비스": return "bg-green-500/10 text-green-600"
      case "이벤트": return "bg-purple-500/10 text-purple-600"
      case "기술": return "bg-orange-500/10 text-orange-600"
      default: return "bg-gray-500/10 text-gray-600"
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

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-bg py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="mb-4">Notice</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            공지사항
            <span className="block gradient-text bg-white text-transparent bg-clip-text">
              & 소식
            </span>
          </h1>
          <p className="text-xl text-ganzicorp-light/90 leading-relaxed">
            GanziCorp의 최신 소식과 중요한 공지사항을<br/>
            확인하실 수 있습니다.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 px-4 border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="공지사항 검색..." 
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  size="sm"
                  className="text-sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Notices List */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-4">
            {notices.map((notice, _index) => (
              <Card key={notice.id} className="hover-lift group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {notice.isPinned && (
                          <Pin className="h-4 w-4 text-primary" />
                        )}
                        <Badge 
                          variant="secondary" 
                          className={getCategoryColor(notice.category)}
                        >
                          {notice.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(notice.createdAt)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          작성자: {notice.author}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {notice.title}
                      </h3>
                      
                      <p className="text-muted-foreground line-clamp-2 mb-4">
                        {notice.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {notice.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(notice.createdAt)}
                          </div>
                        </div>
                        
                        <Button asChild variant="ghost" size="sm" className="group-hover:bg-primary/10">
                          <Link href={`/notices/${notice.id}`}>
                            자세히 보기
                            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                이전
              </Button>
              <Button variant="default" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">
                다음
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <Card>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">24</div>
                <p className="text-muted-foreground">전체 공지사항</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">5</div>
                <p className="text-muted-foreground">이번 달 공지</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">1,247</div>
                <p className="text-muted-foreground">총 조회수</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            뉴스레터 구독
          </h2>
          <p className="text-muted-foreground mb-8">
            GanziCorp의 최신 소식을 이메일로 받아보세요.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="이메일 주소를 입력하세요"
              className="flex-1"
            />
            <Button className="bg-gradient-to-r from-primary to-primary/80">
              구독하기
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            언제든지 구독을 취소할 수 있습니다.
          </p>
        </div>
      </section>
    </MainLayout>
  )
} 