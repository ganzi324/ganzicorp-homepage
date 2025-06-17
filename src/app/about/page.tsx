import MainLayout from "@/components/layout/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Award, Lightbulb } from "lucide-react"

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
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">우리의 이야기</h2>
            <p className="text-muted-foreground">
              기술을 통해 세상을 더 나은 곳으로 만들고자 하는 열정으로 시작되었습니다.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">비전</h3>
              <p className="text-muted-foreground leading-relaxed">
                기술 혁신을 통해 고객의 비즈니스 가치를 극대화하고, 
                지속 가능한 디지털 생태계를 구축하여 모든 이해관계자가 
                함께 성장할 수 있는 미래를 만들어갑니다.
              </p>
              
              <h3 className="text-2xl font-semibold">미션</h3>
              <p className="text-muted-foreground leading-relaxed">
                최고 수준의 기술 전문성과 창의적인 문제 해결 능력을 바탕으로, 
                고객의 도전과제를 혁신적인 솔루션으로 해결하여 
                비즈니스 성공을 함께 이루어갑니다.
              </p>
            </div>
            
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle>GanziCorp at a Glance</CardTitle>
                <CardDescription>주요 현황 및 성과</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">설립년도</span>
                  <span className="font-semibold">2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">본사 위치</span>
                  <span className="font-semibold">서울, 대한민국</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">주요 기술</span>
                  <span className="font-semibold">Web, AI, Cloud</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">팀 규모</span>
                  <span className="font-semibold">10+ 전문가</span>
                </div>
              </CardContent>
            </Card>
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