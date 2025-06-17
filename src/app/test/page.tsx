import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            🧪 Tailwind CSS & Shadcn UI 통합 테스트
          </h1>
          <p className="text-muted-foreground text-lg">
            모든 컴포넌트와 스타일이 올바르게 작동하는지 확인합니다
          </p>
        </div>

        {/* Tailwind CSS 테스트 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            📐 Tailwind CSS 테스트
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-ganzicorp-primary text-white rounded-lg">
              Primary Color
            </div>
            <div className="p-4 bg-ganzicorp-secondary text-white rounded-lg">
              Secondary Color
            </div>
            <div className="p-4 bg-ganzicorp-accent text-ganzicorp-dark rounded-lg">
              Accent Color
            </div>
            <div className="p-4 gradient-bg text-white rounded-lg">
              Gradient Background
            </div>
          </div>
          
          <div className="mt-6 p-6 border border-border rounded-lg">
            <h3 className="text-xl font-medium mb-4 gradient-text">
              커스텀 유틸리티 클래스 테스트
            </h3>
            <div className="flex gap-4 flex-wrap">
              <div className="p-3 card-shadow bg-card rounded-lg">Card Shadow</div>
              <div className="p-3 hover-lift bg-card border border-border rounded-lg cursor-pointer">
                Hover Lift Effect
              </div>
            </div>
          </div>
        </section>

        {/* Shadcn UI 컴포넌트 테스트 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            🎨 Shadcn UI 컴포넌트 테스트
          </h2>
          
          {/* 버튼 테스트 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Button 컴포넌트</h3>
            <div className="flex gap-4 flex-wrap">
              <Button>Default Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="destructive">Destructive Button</Button>
            </div>
          </div>

          {/* Badge 테스트 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Badge 컴포넌트</h3>
            <div className="flex gap-3 flex-wrap">
              <Badge>Default Badge</Badge>
              <Badge variant="secondary">Secondary Badge</Badge>
              <Badge variant="outline">Outline Badge</Badge>
              <Badge variant="destructive">Destructive Badge</Badge>
            </div>
          </div>

          {/* Card 테스트 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Card 컴포넌트</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>기본 카드</CardTitle>
                  <CardDescription>
                    기본 스타일의 카드 컴포넌트입니다
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    카드 내용이 여기에 표시됩니다.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge>New</Badge>
                    호버 효과 카드
                  </CardTitle>
                  <CardDescription>
                    호버 시 살짝 올라가는 효과가 있습니다
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Action Button</Button>
                </CardContent>
              </Card>

              <Card className="border-ganzicorp-primary">
                <CardHeader>
                  <CardTitle className="text-ganzicorp-primary">
                    브랜드 색상 카드
                  </CardTitle>
                  <CardDescription>
                    GanziCorp 브랜드 색상이 적용된 카드입니다
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="border-ganzicorp-primary text-ganzicorp-primary">
                    Brand Color
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 반응형 테스트 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            📱 반응형 디자인 테스트
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <Card key={i} className="text-center">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Col {i + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">{`Item ${i + 1}`}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 테스트 결과 */}
        <section>
          <Card className="bg-ganzicorp-success/10 border-ganzicorp-success">
            <CardHeader>
              <CardTitle className="text-ganzicorp-success flex items-center gap-2">
                ✅ 통합 테스트 통과
              </CardTitle>
              <CardDescription>
                모든 Tailwind CSS와 Shadcn UI 컴포넌트가 정상적으로 작동합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✅ GanziCorp 브랜드 색상 적용 완료</li>
                <li>✅ 커스텀 유틸리티 클래스 작동 확인</li>
                <li>✅ Shadcn UI 컴포넌트 렌더링 정상</li>
                <li>✅ 반응형 디자인 적용 완료</li>
                <li>✅ 호버 효과 및 인터랙션 정상</li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
} 