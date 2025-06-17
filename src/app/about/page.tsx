import { Metadata } from "next"
import MainLayout from "@/components/layout/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Award, Lightbulb } from "lucide-react"

export const metadata: Metadata = {
  title: "회사 소개",
  description: "GanziCorp의 비전, 미션, 핵심 가치와 팀을 소개합니다. 혁신적인 기술로 고객의 성공을 지원하는 전문 기술 회사입니다.",
  openGraph: {
    title: "회사 소개 - GanziCorp",
    description: "GanziCorp의 비전, 미션, 핵심 가치와 팀을 소개합니다.",
    url: "https://ganzicorp.com/about",
  },
}

export default function AboutPage() {
  const values = [
    {
      icon: Users,
      title: "고객 중심",
      description: "고객의 성공이 곧 우리의 성공입니다. 고객의 니즈를 깊이 이해하고 최적의 솔루션을 제공합니다."
    },
    {
      icon: Target,
      title: "목표 지향",
      description: "명확한 목표 설정과 체계적인 실행으로 프로젝트의 성공적인 완수를 보장합니다."
    },
    {
      icon: Award,
      title: "품질 우선",
      description: "타협하지 않는 품질로 신뢰할 수 있는 서비스와 솔루션을 제공합니다."
    },
    {
      icon: Lightbulb,
      title: "혁신 추구",
      description: "끊임없는 학습과 연구를 통해 최신 기술과 트렌드를 선도합니다."
    }
  ]

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-bg py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="mb-4">About GanziCorp</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            혁신으로 미래를 만드는
            <span className="block gradient-text bg-white text-transparent bg-clip-text">
              기술 파트너
            </span>
          </h1>
          <p className="text-xl text-ganzicorp-light/90 leading-relaxed">
            GanziCorp는 최첨단 기술과 창의적인 아이디어로<br/>
            고객의 비즈니스 성장을 돕는 전문 기술 서비스 회사입니다.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">우리의 이야기</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              2020년, 기술을 통해 세상을 더 나은 곳으로 만들고자 하는 열정으로 시작된 GanziCorp는 
              현재 국내외 50여 개 기업의 디지털 혁신 파트너로 성장했습니다.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">🎯 비전</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  기술 혁신을 통해 고객의 비즈니스 가치를 극대화하고, 
                  지속 가능한 디지털 생태계를 구축하여 모든 이해관계자가 
                  함께 성장할 수 있는 미래를 만들어갑니다.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">🚀 미션</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  최고 수준의 기술 전문성과 창의적인 문제 해결 능력을 바탕으로, 
                  고객의 도전과제를 혁신적인 솔루션으로 해결하여 
                  비즈니스 성공을 함께 이루어갑니다.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">💡 철학</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  &ldquo;기술은 수단이고, 고객의 성공이 목적이다&rdquo;라는 철학 하에 
                  최신 기술 트렌드를 선도하면서도 실용적이고 지속 가능한 
                  솔루션을 제공합니다.
                </p>
              </div>
            </div>
            
            <div className="grid gap-6">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-bold">📊</span>
                    </div>
                    회사 현황
                  </CardTitle>
                  <CardDescription>GanziCorp의 주요 지표와 성과</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">2020</div>
                      <div className="text-sm text-muted-foreground">설립년도</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">50+</div>
                      <div className="text-sm text-muted-foreground">고객사</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">100+</div>
                      <div className="text-sm text-muted-foreground">프로젝트</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">15+</div>
                      <div className="text-sm text-muted-foreground">전문가</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <span className="text-secondary font-bold">🏆</span>
                    </div>
                    주요 성과
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">고객 만족도</span>
                    <Badge variant="secondary">98%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">프로젝트 성공률</span>
                    <Badge variant="secondary">100%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">재계약률</span>
                    <Badge variant="secondary">85%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">기술 특허</span>
                    <Badge variant="secondary">3건</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-muted/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center mb-8">성장 히스토리</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { year: "2020", title: "회사 설립", desc: "혁신적인 기술 서비스 회사로 출발" },
                { year: "2021", title: "사업 확장", desc: "AI 및 클라우드 서비스 영역 진출" },
                { year: "2022", title: "글로벌 진출", desc: "해외 고객사 확보 및 서비스 확대" },
                { year: "2023", title: "기술 혁신", desc: "자체 플랫폼 개발 및 특허 출원" }
              ].map((milestone, index) => (
                <Card key={index} className="text-center hover-lift">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                    </div>
                    <CardTitle className="text-lg">{milestone.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{milestone.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">핵심 가치</h2>
            <p className="text-muted-foreground">
              GanziCorp의 모든 활동과 결정의 기준이 되는 핵심 가치들입니다.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover-lift">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">팀</h2>
          <p className="text-muted-foreground mb-8">
            다양한 배경과 전문성을 가진 인재들이 모여 시너지를 만들어갑니다.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {["개발팀", "디자인팀", "기획팀"].map((team, index) => (
              <Card key={index} className="hover-lift">
                <CardHeader>
                  <CardTitle>{team}</CardTitle>
                  <CardDescription>
                    전문성과 창의성을 바탕으로 최고의 결과물을 만들어갑니다.
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  )
} 