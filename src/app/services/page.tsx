import MainLayout from "@/components/layout/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Code, 
  Palette, 
  Cloud, 
  Brain, 
  Smartphone, 
  Database,
  Shield,
  Zap,
  ArrowRight
} from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      icon: Code,
      title: "웹 개발",
      description: "현대적이고 반응형인 웹 애플리케이션 개발",
      features: ["React/Next.js", "TypeScript", "Tailwind CSS", "API 개발"],
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      icon: Smartphone,
      title: "모바일 앱 개발",
      description: "iOS/Android 네이티브 및 크로스플랫폼 앱 개발",
      features: ["React Native", "Flutter", "네이티브 개발", "앱스토어 배포"],
      color: "bg-green-500/10 text-green-600"
    },
    {
      icon: Cloud,
      title: "클라우드 인프라",
      description: "확장 가능하고 안정적인 클라우드 인프라 구축",
      features: ["AWS/Azure", "Docker", "Kubernetes", "CI/CD"],
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      icon: Brain,
      title: "AI/ML 솔루션",
      description: "인공지능과 머신러닝을 활용한 스마트 솔루션",
      features: ["자연어 처리", "컴퓨터 비전", "예측 분석", "챗봇"],
      color: "bg-orange-500/10 text-orange-600"
    },
    {
      icon: Database,
      title: "데이터베이스 설계",
      description: "효율적이고 확장 가능한 데이터베이스 아키텍처",
      features: ["관계형 DB", "NoSQL", "데이터 마이그레이션", "성능 최적화"],
      color: "bg-red-500/10 text-red-600"
    },
    {
      icon: Shield,
      title: "보안 컨설팅",
      description: "종합적인 보안 감사 및 취약점 분석",
      features: ["보안 감사", "취약점 분석", "보안 정책", "규정 준수"],
      color: "bg-indigo-500/10 text-indigo-600"
    }
  ]

  const process = [
    {
      step: "01",
      title: "요구사항 분석",
      description: "고객의 비즈니스 목표와 기술적 요구사항을 면밀히 분석합니다."
    },
    {
      step: "02", 
      title: "솔루션 설계",
      description: "최적의 기술 스택과 아키텍처를 선택하여 솔루션을 설계합니다."
    },
    {
      step: "03",
      title: "개발 및 구현",
      description: "애자일 방법론을 통해 단계별로 개발하고 지속적으로 피드백을 반영합니다."
    },
    {
      step: "04",
      title: "테스트 및 배포",
      description: "철저한 테스트를 거쳐 안정적으로 배포하고 운영을 지원합니다."
    }
  ]

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-bg py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="mb-4">Our Services</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            비즈니스 성장을 위한
            <span className="block gradient-text bg-white text-transparent bg-clip-text">
              전문 기술 서비스
            </span>
          </h1>
          <p className="text-xl text-ganzicorp-light/90 leading-relaxed">
            최신 기술과 풍부한 경험을 바탕으로<br/>
            고객의 디지털 혁신을 성공으로 이끌어갑니다.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">핵심 서비스</h2>
            <p className="text-muted-foreground">
              다양한 분야의 전문성을 바탕으로 종합적인 기술 서비스를 제공합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover-lift group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${service.color}`}>
                    <service.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <Zap className="h-3 w-3 mr-2 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="ghost" className="w-full mt-4 group-hover:bg-primary/10">
                    자세히 보기
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">프로젝트 진행 과정</h2>
            <p className="text-muted-foreground">
              체계적이고 투명한 프로세스로 프로젝트를 성공적으로 완수합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, index) => (
              <Card key={index} className="text-center hover-lift">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">{step.step}</span>
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">기술 스택</h2>
          <p className="text-muted-foreground mb-8">
            검증된 최신 기술들을 활용하여 안정적이고 확장 가능한 솔루션을 제공합니다.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "React", "Next.js", "TypeScript", "Node.js",
              "Python", "AWS", "Docker", "PostgreSQL",
              "MongoDB", "Redis", "GraphQL", "Tailwind CSS"
            ].map((tech, index) => (
              <Badge key={index} variant="secondary" className="p-3 text-sm">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            프로젝트를 시작할 준비가 되셨나요?
          </h2>
          <p className="text-muted-foreground mb-8">
            전문가와 상담을 통해 최적의 솔루션을 찾아보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80">
              무료 상담 신청
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              포트폴리오 보기
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  )
} 