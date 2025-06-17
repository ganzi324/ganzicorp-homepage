import { Metadata } from 'next'
import ContactForm from '@/components/forms/ContactForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: '문의하기 - GanziCorp',
  description: 'GanziCorp에 프로젝트 문의나 상담을 요청하세요. 전문 개발팀이 최적의 솔루션을 제공해드립니다.',
  openGraph: {
    title: '문의하기 - GanziCorp',
    description: 'GanziCorp에 프로젝트 문의나 상담을 요청하세요. 전문 개발팀이 최적의 솔루션을 제공해드립니다.',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">Contact Us</Badge>
        <h1 className="text-4xl font-bold mb-4">문의하기</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          프로젝트에 대한 문의나 상담이 필요하시다면 언제든지 연락주세요. 
          전문 개발팀이 최적의 솔루션을 제공해드립니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>프로젝트 문의</CardTitle>
              <CardDescription>
                아래 양식을 작성해주시면 빠른 시일 내에 연락드리겠습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          {/* Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                연락처 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">이메일</p>
                  <p className="text-sm text-muted-foreground">contact@ganzicorp.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">전화번호</p>
                  <p className="text-sm text-muted-foreground">02-1234-5678</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">주소</p>
                  <p className="text-sm text-muted-foreground">
                    서울특별시 강남구 테헤란로 123<br />
                    GanziCorp 빌딩 10층
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                운영시간
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">평일</span>
                <span className="text-sm text-muted-foreground">09:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">토요일</span>
                <span className="text-sm text-muted-foreground">09:00 - 14:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">일요일</span>
                <span className="text-sm text-muted-foreground">휴무</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <p className="text-xs text-muted-foreground">
                  * 긴급한 경우 이메일로 연락주시면 24시간 내 답변드립니다.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>자주 묻는 질문</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-sm">프로젝트 견적은 어떻게 받을 수 있나요?</p>
                <p className="text-xs text-muted-foreground mt-1">
                  문의 양식을 작성해주시면 상세한 견적서를 제공해드립니다.
                </p>
              </div>
              <div>
                <p className="font-medium text-sm">개발 기간은 얼마나 걸리나요?</p>
                <p className="text-xs text-muted-foreground mt-1">
                  프로젝트 규모에 따라 2주~6개월까지 다양합니다.
                </p>
              </div>
              <div>
                <p className="font-medium text-sm">유지보수 서비스도 제공하나요?</p>
                <p className="text-xs text-muted-foreground mt-1">
                  네, 개발 완료 후 지속적인 유지보수 서비스를 제공합니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 