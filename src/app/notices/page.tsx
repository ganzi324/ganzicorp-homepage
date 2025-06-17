import { Metadata } from "next"
import MainLayout from "@/components/layout/MainLayout"
import NoticeList from "@/components/notices/NoticeList"
import NoticeStats from "@/components/notices/NoticeStats"
import NewsletterSubscription from "@/components/notices/NewsletterSubscription"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "공지사항 | GanziCorp",
  description: "GanziCorp의 최신 소식과 공지사항을 확인하세요.",
  openGraph: {
    title: "공지사항 - GanziCorp",
    description: "GanziCorp의 최신 소식과 공지사항을 확인하세요.",
    url: "https://ganzicorp.com/notices",
  },
}

export default function NoticesPage() {
  // 임시 데이터 - 실제로는 API에서 가져올 예정
  const notices = [
    {
      id: 1,
      title: "GanziCorp 공식 홈페이지 오픈",
      content: "안녕하세요. GanziCorp의 공식 홈페이지가 새롭게 오픈되었습니다. 앞으로 다양한 소식과 정보를 공유하겠습니다. 혁신적인 기술 솔루션을 제공하는 전문 기업으로서, 고객의 성공을 위해 최선을 다하고 있습니다.",
      category: "공지",
      status: "published",
      isPinned: true,
      views: 245,
      createdAt: "2024-01-15",
      author: "관리자",
      important: true
    },
    {
      id: 2,
      title: "새로운 AI 솔루션 서비스 출시",
      content: "최신 AI 기술을 활용한 맞춤형 솔루션 서비스를 출시했습니다. 자세한 내용은 서비스 페이지를 확인해 주세요. 고객의 비즈니스 성장을 위한 혁신적인 솔루션을 제공합니다.",
      category: "서비스",
      status: "published",
      isPinned: false,
      views: 189,
      createdAt: "2024-01-10",
      author: "개발팀",
      important: false
    },
    {
      id: 3,
      title: "2024년 첫 번째 기술 세미나 개최 안내",
      content: "최신 웹 개발 트렌드와 AI 기술에 대한 세미나를 개최합니다. 많은 관심과 참여 부탁드립니다. 업계 전문가들과 함께하는 유익한 시간이 될 것입니다.",
      category: "이벤트",
      status: "published",
      isPinned: false,
      views: 156,
      createdAt: "2024-01-05",
      author: "기획팀",
      important: false
    },
    {
      id: 4,
      title: "설날 연휴 운영 안내",
      content: "설날 연휴 기간 동안의 운영 일정을 안내드립니다. 긴급 문의사항은 이메일로 연락해 주세요. 연휴 기간에도 고객 지원을 위해 최선을 다하겠습니다.",
      category: "공지",
      status: "published",
      isPinned: false,
      views: 98,
      createdAt: "2024-01-03",
      author: "관리자",
      important: false
    },
    {
      id: 5,
      title: "클라우드 인프라 업그레이드 완료",
      content: "서비스 안정성 향상을 위한 클라우드 인프라 업그레이드가 성공적으로 완료되었습니다. 더욱 빠르고 안정적인 서비스를 제공할 수 있게 되었습니다.",
      category: "기술",
      status: "published",
      isPinned: false,
      views: 134,
      createdAt: "2023-12-28",
      author: "인프라팀",
      important: true
    },
    {
      id: 6,
      title: "보안 업데이트 완료 안내",
      content: "고객 정보 보호를 위한 보안 시스템 업데이트가 완료되었습니다. 더욱 강화된 보안으로 안전한 서비스를 제공합니다.",
      category: "기술",
      status: "published",
      isPinned: false,
      views: 87,
      createdAt: "2023-12-20",
      author: "보안팀",
      important: false
    },
    {
      id: 7,
      title: "고객 지원 센터 운영 시간 변경",
      content: "더 나은 고객 서비스 제공을 위해 고객 지원 센터 운영 시간이 변경됩니다. 자세한 내용을 확인해 주세요.",
      category: "공지",
      status: "published",
      isPinned: false,
      views: 76,
      createdAt: "2023-12-15",
      author: "고객지원팀",
      important: false
    },
    {
      id: 8,
      title: "연말 감사 인사",
      content: "2023년 한 해 동안 보내주신 관심과 사랑에 감사드립니다. 2024년에도 더 나은 서비스로 보답하겠습니다.",
      category: "공지",
      status: "published",
      isPinned: false,
      views: 156,
      createdAt: "2023-12-31",
      author: "대표이사",
      important: false
    }
  ]

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

      {/* Notices Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <NoticeList 
            notices={notices}
            itemsPerPage={5}
            showSearch={true}
            showFilters={true}
            showPagination={true}
          />
        </div>
      </section>

      {/* Statistics */}
      <NoticeStats 
        totalNotices={notices.length}
        monthlyNotices={notices.filter(notice => {
          const noticeDate = new Date(notice.createdAt)
          const currentDate = new Date()
          return noticeDate.getMonth() === currentDate.getMonth() && 
                 noticeDate.getFullYear() === currentDate.getFullYear()
        }).length}
        totalViews={notices.reduce((sum, notice) => sum + notice.views, 0)}
      />

      {/* Newsletter Subscription */}
      <NewsletterSubscription />
    </MainLayout>
  )
} 