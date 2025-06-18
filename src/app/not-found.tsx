import MainLayout from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ArrowLeft, Search } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <MainLayout>
      <section className="py-20 px-4 min-h-[60vh] flex items-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-bold text-primary/20 mb-4">
              404
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              페이지를 찾을 수 없습니다
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">다음 방법을 시도해보세요:</h2>
              <ul className="text-left space-y-2 text-muted-foreground">
                <li>• URL을 다시 확인해보세요</li>
                <li>• 브라우저의 뒤로 가기 버튼을 사용해보세요</li>
                <li>• 홈페이지에서 원하는 페이지를 찾아보세요</li>
                <li>• 검색 기능을 이용해보세요</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                홈으로 돌아가기
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link href="/services">
                <Search className="h-4 w-4 mr-2" />
                서비스 둘러보기
              </Link>
            </Button>
            
            <Button asChild variant="ghost" size="lg">
              <Link href="javascript:history.back()">
                <ArrowLeft className="h-4 w-4 mr-2" />
                이전 페이지
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  )
} 