import { Metadata } from "next"
import MainLayout from "@/components/layout/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "서비스",
  description: "웹 개발, 모바일 앱 개발, 클라우드 인프라, AI 솔루션 등 GanziCorp의 전문 기술 서비스를 소개합니다.",
  openGraph: {
    title: "서비스 - GanziCorp",
    description: "웹 개발, 모바일 앱 개발, 클라우드 인프라, AI 솔루션 등 전문 기술 서비스를 제공합니다.",
    url: "https://ganzicorp.com/services",
  },
}
import { 
  Code, 
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
      slug: "web-development",
      icon: Code,
      title: "웹 개발",
      description: "현대적이고 반응형인 웹 애플리케이션을 개발합니다. React, Next.js, TypeScript 등 최신 기술을 활용합니다.",
      features: ["React/Next.js", "TypeScript", "Tailwind CSS", "API 개발"],
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      slug: "mobile-development",
      icon: Smartphone,
      title: "모바일 앱 개발",
      description: "iOS와 Android를 지원하는 크로스플랫폼 모바일 애플리케이션을 개발합니다.",
      features: ["React Native", "Flutter", "네이티브 개발", "앱스토어 배포"],
      color: "bg-green-500/10 text-green-600"
    },
    {
      slug: "cloud-infrastructure",
      icon: Cloud,
      title: "클라우드 인프라",
      description: "AWS, Azure, GCP를 활용한 확장 가능하고 안정적인 클라우드 인프라를 구축합니다.",
      features: ["AWS/Azure", "Docker", "Kubernetes", "CI/CD"],
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      slug: "ai-solutions",
      icon: Brain,
      title: "AI 솔루션",
      description: "머신러닝과 인공지능 기술을 활용한 맞춤형 비즈니스 솔루션을 제공합니다.",
      features: ["머신러닝", "자연어 처리", "컴퓨터 비전", "예측 분석"],
      color: "bg-orange-500/10 text-orange-600"
    },
    {
      slug: "database-optimization",
      icon: Database,
      title: "데이터베이스 최적화",
      description: "데이터베이스 성능 분석과 최적화를 통해 시스템 효율성을 극대화합니다.",
      features: ["성능 튜닝", "쿼리 최적화", "스키마 설계", "백업 전략"],
      color: "bg-cyan-500/10 text-cyan-600"
    },
    {
      slug: "security-consulting",
      icon: Shield,
      title: "보안 컨설팅",
      description: "웹 애플리케이션과 시스템의 보안 취약점을 분석하고 개선 방안을 제시합니다.",
      features: ["보안 감사", "취약점 분석", "보안 정책", "컴플라이언스"],
      color: "bg-red-500/10 text-red-600"
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
                  <Button asChild variant="ghost" className="w-full mt-4 group-hover:bg-primary/10">
                    <Link href={`/services/${service.slug || service.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                      자세히 보기
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
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
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">기술 스택</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              검증된 최신 기술들을 활용하여 안정적이고 확장 가능한 솔루션을 제공합니다.
              지속적인 기술 연구를 통해 최적의 개발 환경을 구축합니다.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                category: "Frontend",
                technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js"],
                color: "bg-blue-500/10 text-blue-600"
              },
              {
                category: "Backend",
                technologies: ["Node.js", "Python", "Java", "Express", "FastAPI"],
                color: "bg-green-500/10 text-green-600"
              },
              {
                category: "Database",
                technologies: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Supabase"],
                color: "bg-purple-500/10 text-purple-600"
              },
              {
                category: "DevOps",
                technologies: ["AWS", "Docker", "Kubernetes", "GitHub Actions", "Terraform"],
                color: "bg-orange-500/10 text-orange-600"
              }
            ].map((stack, index) => (
              <Card key={index} className="hover-lift">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${stack.color}`}>
                    <Code className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{stack.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stack.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="mr-2 mb-2">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              왜 GanziCorp를 선택해야 할까요?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              풍부한 경험과 전문성을 바탕으로 고객의 성공을 위해 최선을 다합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "목표 중심 접근",
                description: "비즈니스 목표를 명확히 이해하고, 이를 달성하기 위한 최적의 기술 솔루션을 제공합니다.",
                stats: "100% 프로젝트 성공률"
              },
              {
                icon: "⚡",
                title: "빠른 개발 속도",
                description: "효율적인 개발 프로세스와 최신 도구를 활용하여 빠르고 안정적인 개발을 진행합니다.",
                stats: "평균 30% 개발 시간 단축"
              },
              {
                icon: "🔒",
                title: "보안과 품질",
                description: "엄격한 코드 리뷰와 보안 검토를 통해 높은 품질과 안전성을 보장합니다.",
                stats: "제로 보안 사고"
              }
            ].map((benefit, index) => (
              <Card key={index} className="text-center hover-lift">
                <CardHeader>
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <CardTitle className="text-xl mb-3">{benefit.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed mb-4">
                    {benefit.description}
                  </CardDescription>
                  <Badge variant="secondary" className="text-sm">
                    {benefit.stats}
                  </Badge>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Client Success Stories */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              고객 성공 사례
            </h2>
            <p className="text-lg text-muted-foreground">
              다양한 산업의 고객들과 함께 이룬 성공 스토리를 확인해보세요.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                industry: "E-commerce",
                title: "온라인 쇼핑몰 성능 최적화",
                result: "페이지 로딩 속도 70% 개선",
                description: "대규모 트래픽을 처리할 수 있는 확장 가능한 아키텍처 구축"
              },
              {
                industry: "Healthcare",
                title: "의료 데이터 관리 시스템",
                result: "업무 효율성 50% 향상",
                description: "HIPAA 준수 의료 정보 관리 플랫폼 개발 및 구축"
              },
              {
                industry: "FinTech",
                title: "금융 서비스 플랫폼",
                result: "고객 만족도 95% 달성",
                description: "보안성과 사용성을 모두 만족하는 핀테크 솔루션 개발"
              }
            ].map((story, index) => (
              <Card key={index} className="hover-lift">
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-3">{story.industry}</Badge>
                  <CardTitle className="text-lg mb-3">{story.title}</CardTitle>
                  <div className="text-2xl font-bold text-primary mb-3">{story.result}</div>
                  <CardDescription>{story.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            프로젝트를 시작해보세요
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            전문가와의 상담을 통해 비즈니스에 최적화된 솔루션을 찾아보세요. 
            무료 컨설팅으로 프로젝트의 가능성을 확인해보실 수 있습니다.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold">
                무료 상담 신청
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                회사 소개 보기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  )
} 