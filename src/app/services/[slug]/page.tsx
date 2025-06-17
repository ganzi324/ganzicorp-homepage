import MainLayout from "@/components/layout/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft,
  CheckCircle,
  Clock,
  Star,
  Users,
  Zap,
  ArrowRight,
  Code,
  Smartphone,
  Cloud,
  Brain,
  Database,
  Shield
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// 서비스 데이터
const services = [
  {
    slug: "web-development",
    icon: Code,
    title: "웹 개발",
    shortDescription: "현대적이고 반응형인 웹 애플리케이션 개발",
    description: "최신 기술 스택을 활용하여 확장 가능하고 성능 최적화된 웹 애플리케이션을 개발합니다.",
    features: ["React/Next.js", "TypeScript", "Tailwind CSS", "API 개발"],
    color: "bg-blue-500/10 text-blue-600",
    price: "₩500만원부터",
    duration: "4-12주",
    content: `
## 웹 개발 서비스

저희 GanziCorp의 웹 개발 서비스는 최신 기술과 모범 사례를 활용하여 고품질의 웹 애플리케이션을 제공합니다.

### 기술 스택

#### 프론트엔드
- **React/Next.js**: 현대적인 사용자 인터페이스 구축
- **TypeScript**: 타입 안전성과 개발 생산성 향상
- **Tailwind CSS**: 빠르고 일관된 스타일링
- **Framer Motion**: 부드러운 애니메이션과 상호작용

#### 백엔드
- **Node.js/Express**: 확장 가능한 서버 개발
- **Next.js API Routes**: 풀스택 애플리케이션 구축
- **GraphQL/REST API**: 효율적인 데이터 통신
- **Database Integration**: PostgreSQL, MongoDB 연동

### 개발 프로세스

1. **요구사항 분석**: 클라이언트와의 상세한 논의를 통한 요구사항 정의
2. **설계 및 기획**: UI/UX 설계와 시스템 아키텍처 구성
3. **개발**: 애자일 방법론을 통한 단계별 개발
4. **테스트**: 종합적인 품질 보증 테스트
5. **배포**: 안정적인 프로덕션 환경 배포
6. **유지보수**: 지속적인 모니터링과 업데이트

### 특징

- **반응형 디자인**: 모든 디바이스에서 최적화된 경험
- **성능 최적화**: 빠른 로딩 속도와 SEO 최적화
- **보안**: 최신 보안 표준 준수
- **확장성**: 비즈니스 성장에 따른 확장 가능한 구조

### 포트폴리오

지금까지 50+ 프로젝트를 성공적으로 완료했으며, 다양한 업종의 클라이언트와 함께 일해왔습니다.
    `,
    benefits: [
      "최신 기술 스택 활용",
      "반응형 디자인",
      "SEO 최적화",
      "성능 최적화",
      "보안 강화",
      "유지보수 지원"
    ],
    process: [
      { step: "분석", description: "요구사항 분석 및 기획" },
      { step: "설계", description: "UI/UX 설계 및 아키텍처" },
      { step: "개발", description: "단계별 개발 및 테스트" },
      { step: "배포", description: "프로덕션 배포 및 런칭" }
    ]
  },
  {
    slug: "mobile-development",
    icon: Smartphone,
    title: "모바일 앱 개발",
    shortDescription: "iOS/Android 네이티브 및 크로스플랫폼 앱 개발",
    description: "사용자 친화적이고 성능이 뛰어난 모바일 애플리케이션을 개발합니다.",
    features: ["React Native", "Flutter", "네이티브 개발", "앱스토어 배포"],
    color: "bg-green-500/10 text-green-600",
    price: "₩800만원부터",
    duration: "6-16주",
    content: `
## 모바일 앱 개발 서비스

네이티브와 크로스플랫폼 기술을 모두 활용하여 최적의 모바일 경험을 제공합니다.

### 개발 플랫폼

#### 크로스플랫폼
- **React Native**: JavaScript 기반 크로스플랫폼 개발
- **Flutter**: Dart 언어를 사용한 고성능 앱 개발
- **Expo**: 빠른 프로토타이핑과 배포

#### 네이티브 개발
- **iOS**: Swift/SwiftUI를 활용한 iOS 전용 앱
- **Android**: Kotlin/Java를 활용한 Android 전용 앱

### 주요 기능

- **사용자 인증**: 소셜 로그인, 생체 인증 등
- **푸시 알림**: 실시간 알림 시스템
- **오프라인 지원**: 네트워크 없이도 작동하는 기능
- **결제 시스템**: 인앱 결제 및 다양한 결제 수단 연동
- **지도 및 위치**: GPS 기반 위치 서비스
- **카메라/갤러리**: 이미지/비디오 처리 기능

### 앱스토어 배포

- App Store 및 Google Play Store 배포 지원
- 앱스토어 최적화 (ASO) 컨설팅
- 심사 과정 지원 및 관리

### 성과

- 100+ 앱 개발 경험
- 평균 4.5+ 앱스토어 평점
- 다운로드 수 1M+ 달성 앱 다수
    `,
    benefits: [
      "크로스플랫폼 지원",
      "네이티브 성능",
      "앱스토어 배포",
      "푸시 알림",
      "오프라인 지원",
      "지속적 업데이트"
    ],
    process: [
      { step: "기획", description: "앱 컨셉 및 기능 정의" },
      { step: "디자인", description: "UI/UX 디자인 및 프로토타입" },
      { step: "개발", description: "플랫폼별 개발 및 테스트" },
      { step: "출시", description: "앱스토어 배포 및 마케팅" }
    ]
  },
  {
    slug: "cloud-infrastructure",
    icon: Cloud,
    title: "클라우드 인프라",
    shortDescription: "확장 가능하고 안정적인 클라우드 인프라 구축",
    description: "AWS, Azure, GCP를 활용한 현대적인 클라우드 인프라를 구축하고 관리합니다.",
    features: ["AWS/Azure", "Docker", "Kubernetes", "CI/CD"],
    color: "bg-purple-500/10 text-purple-600",
    price: "₩300만원부터",
    duration: "2-8주",
    content: `
## 클라우드 인프라 서비스

현대적인 클라우드 기술을 활용하여 확장 가능하고 안정적인 인프라를 구축합니다.

### 클라우드 플랫폼

#### AWS (Amazon Web Services)
- EC2, ECS, EKS를 활용한 컴퓨팅 리소스
- RDS, DynamoDB를 활용한 데이터베이스 서비스
- S3, CloudFront를 활용한 스토리지 및 CDN
- Lambda를 활용한 서버리스 아키텍처

#### Microsoft Azure
- Azure App Service, AKS를 활용한 애플리케이션 호스팅
- Azure SQL Database, Cosmos DB 데이터베이스 서비스
- Azure Blob Storage, Azure CDN 스토리지 솔루션

#### Google Cloud Platform
- Google Kubernetes Engine (GKE)
- Cloud Run을 활용한 컨테이너 서비스
- BigQuery를 활용한 데이터 분석

### 컨테이너화 및 오케스트레이션

- **Docker**: 애플리케이션 컨테이너화
- **Kubernetes**: 컨테이너 오케스트레이션 및 관리
- **Helm**: Kubernetes 애플리케이션 패키지 관리

### CI/CD 파이프라인

- **GitHub Actions**: 자동화된 빌드 및 배포
- **GitLab CI/CD**: 통합 개발 환경
- **Jenkins**: 엔터프라이즈급 CI/CD

### 모니터링 및 로깅

- **Prometheus & Grafana**: 메트릭 수집 및 시각화
- **ELK Stack**: 로그 수집 및 분석
- **AWS CloudWatch**: 클라우드 모니터링

### 보안

- **IAM**: 접근 권한 관리
- **VPC**: 네트워크 보안
- **SSL/TLS**: 데이터 암호화
- **Security Groups**: 방화벽 설정
    `,
    benefits: [
      "자동 확장",
      "고가용성",
      "비용 최적화",
      "보안 강화",
      "모니터링",
      "백업/복구"
    ],
    process: [
      { step: "평가", description: "현재 인프라 평가 및 분석" },
      { step: "설계", description: "클라우드 아키텍처 설계" },
      { step: "마이그레이션", description: "클라우드 환경 구축 및 이전" },
      { step: "최적화", description: "성능 및 비용 최적화" }
    ]
  }
]

interface ServiceDetailPageProps {
  params: {
    slug: string
  }
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const service = services.find(s => s.slug === params.slug)

  if (!service) {
    notFound()
  }

  const IconComponent = service.icon

  return (
    <MainLayout>
      {/* 헤더 */}
      <section className="bg-gradient-bg py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Button asChild variant="ghost" className="mb-6 text-white hover:bg-white/10">
            <Link href="/services" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              서비스 목록으로
            </Link>
          </Button>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-6 ${service.color}`}>
                <IconComponent className="h-8 w-8" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {service.title}
              </h1>
              
              <p className="text-xl text-ganzicorp-light/90 mb-8">
                {service.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  무료 상담 신청
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  포트폴리오 보기
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-white">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm opacity-80">개발 기간</span>
                      </div>
                      <p className="font-semibold">{service.duration}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4" />
                        <span className="text-sm opacity-80">시작 가격</span>
                      </div>
                      <p className="font-semibold">{service.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    주요 기술
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="bg-white/20 text-white">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 메인 콘텐츠 */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* 본문 */}
            <div className="lg:col-span-2">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: service.content.replace(/\n/g, '<br/>').replace(/## /g, '<h2>').replace(/### /g, '<h3>').replace(/#### /g, '<h4>') 
                }}
              />
            </div>

            {/* 사이드바 */}
            <div className="space-y-8">
              {/* 주요 혜택 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    주요 혜택
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* 진행 과정 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    진행 과정
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {service.process.map((step, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-sm font-semibold text-primary">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{step.step}</h4>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 상담 신청 */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">프로젝트 상담</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    전문가와 무료 상담을 통해 최적의 솔루션을 찾아보세요.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/contact">
                      상담 신청하기
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 관련 서비스 */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">다른 서비스</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services
              .filter(s => s.slug !== service.slug)
              .slice(0, 3)
              .map((relatedService) => {
                const RelatedIcon = relatedService.icon
                return (
                  <Card key={relatedService.slug} className="hover-lift group">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${relatedService.color}`}>
                        <RelatedIcon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{relatedService.title}</CardTitle>
                      <CardDescription>{relatedService.shortDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild variant="ghost" className="w-full group-hover:bg-primary/10">
                        <Link href={`/services/${relatedService.slug}`}>
                          자세히 보기
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </div>
      </section>
    </MainLayout>
  )
}

// 정적 생성을 위한 함수들
export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }))
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const service = services.find(s => s.slug === params.slug)

  if (!service) {
    return {
      title: '서비스를 찾을 수 없습니다 - GanziCorp',
    }
  }

  return {
    title: `${service.title} - GanziCorp`,
    description: service.description,
  }
} 