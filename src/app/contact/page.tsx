import MainLayout from "@/components/layout/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageSquare,
  Users,
  Calendar
} from "lucide-react"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: "이메일",
      content: "contact@ganzicorp.com",
      description: "언제든지 문의해 주세요"
    },
    {
      icon: Phone,
      title: "전화",
      content: "+82-2-1234-5678",
      description: "평일 09:00 - 18:00"
    },
    {
      icon: MapPin,
      title: "주소",
      content: "서울특별시 강남구 테헤란로 123",
      description: "GanziCorp 본사"
    },
    {
      icon: Clock,
      title: "운영시간",
      content: "평일 09:00 - 18:00",
      description: "주말 및 공휴일 휴무"
    }
  ]

  const services = [
    {
      icon: MessageSquare,
      title: "일반 문의",
      description: "서비스에 대한 궁금한 점이나 일반적인 문의사항"
    },
    {
      icon: Users,
      title: "프로젝트 상담",
      description: "새로운 프로젝트나 기술 파트너십에 대한 상담"
    },
    {
      icon: Calendar,
      title: "미팅 예약",
      description: "직접 만나서 자세한 논의를 원하시는 경우"
    }
  ]

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-bg py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="mb-4">Contact Us</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            언제든지
            <span className="block gradient-text bg-white text-transparent bg-clip-text">
              문의해 주세요
            </span>
          </h1>
          <p className="text-xl text-ganzicorp-light/90 leading-relaxed">
            궁금한 점이 있으시거나 프로젝트 상담을 원하신다면<br/>
            언제든지 연락해 주세요. 빠르게 답변드리겠습니다.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">연락처 정보</h2>
            <p className="text-muted-foreground">
              다양한 방법으로 연락하실 수 있습니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover-lift">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <info.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                  <CardDescription>{info.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-foreground">{info.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form & Info */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="h-5 w-5 mr-2" />
                  문의 양식
                </CardTitle>
                <CardDescription>
                  아래 양식을 작성해 주시면 빠르게 답변드리겠습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름 *</Label>
                    <Input id="name" placeholder="홍길동" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">회사명</Label>
                    <Input id="company" placeholder="회사명 (선택사항)" />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일 *</Label>
                    <Input id="email" type="email" placeholder="example@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">전화번호</Label>
                    <Input id="phone" placeholder="010-1234-5678" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">문의 유형 *</Label>
                  <select 
                    id="subject" 
                    className="w-full p-2 border border-input rounded-md bg-background"
                  >
                    <option value="">문의 유형을 선택해 주세요</option>
                    <option value="general">일반 문의</option>
                    <option value="project">프로젝트 상담</option>
                    <option value="partnership">파트너십</option>
                    <option value="support">기술 지원</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">메시지 *</Label>
                  <Textarea 
                    id="message" 
                    rows={6}
                    placeholder="문의하실 내용을 자세히 적어주세요..."
                    className="resize-none"
                  />
                </div>

                <Button className="w-full bg-gradient-to-r from-primary to-primary/80">
                  <Send className="h-4 w-4 mr-2" />
                  문의하기
                </Button>

                <p className="text-sm text-muted-foreground">
                  * 표시된 항목은 필수 입력 사항입니다.
                </p>
              </CardContent>
            </Card>

            {/* Contact Services */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">문의 유형</h3>
                <p className="text-muted-foreground mb-6">
                  문의 유형에 따라 담당자가 배정되어 더 정확한 답변을 드립니다.
                </p>
              </div>

              <div className="space-y-4">
                {services.map((service, index) => (
                  <Card key={index} className="hover-lift">
                    <CardContent className="flex items-start p-6">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <service.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">{service.title}</h4>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-2">빠른 응답 보장</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    모든 문의사항에 대해 24시간 이내에 답변드리며, 
                    긴급한 사안의 경우 더 빠른 응답을 제공합니다.
                  </p>
                  <div className="flex items-center text-sm text-primary">
                    <Clock className="h-4 w-4 mr-2" />
                    평균 응답 시간: 2-4시간
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">자주 묻는 질문</h2>
            <p className="text-muted-foreground">
              고객들이 자주 문의하시는 질문들을 모았습니다.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "프로젝트 진행 기간은 얼마나 걸리나요?",
                answer: "프로젝트 규모와 복잡도에 따라 다르지만, 일반적으로 소규모 프로젝트는 2-4주, 중간 규모는 2-3개월, 대규모 프로젝트는 6개월 이상 소요됩니다."
              },
              {
                question: "개발 비용은 어떻게 산정되나요?",
                answer: "프로젝트 요구사항, 기능 복잡도, 개발 기간 등을 종합적으로 고려하여 견적을 제공합니다. 무료 상담을 통해 정확한 견적을 받아보세요."
              },
              {
                question: "유지보수 서비스도 제공하나요?",
                answer: "네, 개발 완료 후에도 지속적인 유지보수와 기술 지원 서비스를 제공합니다. 다양한 유지보수 패키지를 준비하고 있습니다."
              },
              {
                question: "어떤 기술 스택을 주로 사용하나요?",
                answer: "React, Next.js, Node.js, Python, AWS 등 최신 기술 스택을 활용하며, 프로젝트 특성에 맞는 최적의 기술을 선택합니다."
              }
            ].map((faq, index) => (
              <Card key={index} className="hover-lift">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  )
} 