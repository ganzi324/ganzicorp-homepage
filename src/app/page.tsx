import React from 'react';
import { Metadata } from 'next';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";

export const metadata: Metadata = {
  title: "홈",
  description: "GanziCorp는 혁신적인 기술로 미래를 만들어가는 회사입니다. 차세대 솔루션으로 비즈니스의 새로운 가능성을 열어갑니다.",
  openGraph: {
    title: "GanziCorp - 혁신적인 기술 솔루션",
    description: "혁신적인 기술로 미래를 만들어가는 회사, 차세대 솔루션으로 비즈니스의 새로운 가능성을 열어갑니다.",
    url: "https://ganzicorp.com",
  },
};

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-24 gradient-bg">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="block">혁신적인 기술로</span>
            <span className="block gradient-text bg-white text-transparent bg-clip-text">
              미래를 만들어갑니다
            </span>
          </h1>
          <p className="text-lg md:text-xl text-ganzicorp-light/90 mb-12 leading-relaxed max-w-3xl mx-auto">
            GanziCorp는 차세대 기술 솔루션을 통해 비즈니스의 새로운 가능성을 열어갑니다.<br/>
            고객과 함께 성장하며, 지속가능한 혁신을 추구합니다.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/services">
              <Button size="lg" className="bg-white text-ganzicorp-primary hover:bg-ganzicorp-light font-semibold hover-lift">
                서비스 살펴보기
              </Button>
            </Link>
            <Link href="/contact">
    <Button 
      variant="outline" 
      size="lg" 
      className="border-2 border-white text-white hover:bg-white hover:text-ganzicorp-primary font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 bg-transparent backdrop-blur-sm"
    >
      문의하기
    </Button>
  </Link>
          </div>
          
          {/* 핵심 가치 카드 */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/10 border-white/20 hover-lift">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <CardTitle className="text-white text-xl">최신 기술</CardTitle>
                <CardDescription className="text-ganzicorp-light/80">
                  AI, 클라우드, 빅데이터 등 최첨단 기술로 비즈니스 혁신을 이끕니다
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-white/10 border-white/20 hover-lift">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <CardTitle className="text-white text-xl">혁신적 사고</CardTitle>
                <CardDescription className="text-ganzicorp-light/80">
                  창의적인 아이디어와 독창적인 접근으로 새로운 가치를 창출합니다
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-white/10 border-white/20 hover-lift">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <CardTitle className="text-white text-xl">신뢰할 수 있는 파트너</CardTitle>
                <CardDescription className="text-ganzicorp-light/80">
                  고객과 함께 성장하는 장기적인 파트너십을 구축합니다
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* 주요 서비스 섹션 */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              주요 서비스
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              GanziCorp의 전문적이고 혁신적인 서비스로 비즈니스 성공을 실현하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI 솔루션",
                description: "머신러닝과 딥러닝 기술을 활용한 지능형 비즈니스 솔루션",
                icon: "🤖",
                color: "bg-blue-500"
              },
              {
                title: "클라우드 서비스",
                description: "안전하고 확장 가능한 클라우드 인프라 구축 및 관리",
                icon: "☁️",
                color: "bg-green-500"
              },
              {
                title: "데이터 분석",
                description: "빅데이터 분석을 통한 인사이트 도출 및 의사결정 지원",
                icon: "📊",
                color: "bg-purple-500"
              },
              {
                title: "웹 개발",
                description: "현대적이고 반응형인 웹 애플리케이션 개발 서비스",
                icon: "💻",
                color: "bg-orange-500"
              },
              {
                title: "모바일 앱",
                description: "iOS, Android 네이티브 및 크로스 플랫폼 앱 개발",
                icon: "📱",
                color: "bg-pink-500"
              },
              {
                title: "컨설팅",
                description: "디지털 전환 및 기술 도입을 위한 전문 컨설팅",
                icon: "🎯",
                color: "bg-indigo-500"
              }
            ].map((service, index) => (
              <Card key={index} className="hover-lift group">
                <CardHeader>
                  <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <span className="text-xl text-white">{service.icon}</span>
                  </div>
                  <CardTitle className="text-xl mb-3">{service.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button size="lg" variant="outline" className="hover-lift">
                모든 서비스 보기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 회사 소개 섹션 */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                GanziCorp와 함께하는<br/>
                디지털 혁신 여정
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                2020년 설립 이래, GanziCorp는 혁신적인 기술 솔루션으로 100여 개 기업의 
                디지털 전환을 성공적으로 이끌어왔습니다. 우리는 단순한 기술 제공을 넘어서, 
                고객의 비즈니스 성장을 위한 진정한 파트너가 되고자 합니다.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">100+</div>
                  <div className="text-sm text-muted-foreground">프로젝트 완료</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50+</div>
                  <div className="text-sm text-muted-foreground">만족한 고객</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">4년</div>
                  <div className="text-sm text-muted-foreground">업계 경험</div>
                </div>
              </div>
              <Link href="/about">
                <Button size="lg" className="hover-lift">
                  회사 소개 보기
                </Button>
              </Link>
            </div>
            <div className="lg:order-first">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏢</div>
                  <p className="text-muted-foreground">
                    혁신적인 기술로<br/>
                    미래를 만들어갑니다
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA 섹션 */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            GanziCorp와 함께 비즈니스의 디지털 혁신을 시작해보세요. 
            전문가 상담을 통해 최적의 솔루션을 찾아드립니다.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold">
                무료 상담 신청
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                더 알아보기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
} 