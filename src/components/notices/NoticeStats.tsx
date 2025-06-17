import { Card, CardContent } from '@/components/ui/card'

interface NoticeStatsProps {
  totalNotices: number
  monthlyNotices: number
  totalViews: number
}

export default function NoticeStats({ 
  totalNotices, 
  monthlyNotices, 
  totalViews 
}: NoticeStatsProps) {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            공지사항 현황
          </h2>
          <p className="text-muted-foreground">
            GanziCorp의 공지사항 활동 통계를 확인하세요.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">
                {totalNotices.toLocaleString()}
              </div>
              <p className="text-muted-foreground font-medium">전체 공지사항</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                지금까지 발행된 총 공지사항 수
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {monthlyNotices.toLocaleString()}
              </div>
              <p className="text-muted-foreground font-medium">이번 달 공지</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                이번 달 새로 발행된 공지사항
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {totalViews.toLocaleString()}
              </div>
              <p className="text-muted-foreground font-medium">총 조회수</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                모든 공지사항의 누적 조회수
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 