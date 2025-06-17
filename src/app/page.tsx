import React from 'react';

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-24 gradient-bg">
        <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-white mb-6">
          <span className="block">GanziCorp에</span>
          <span className="block gradient-text bg-white text-transparent bg-clip-text">
            오신 것을 환영합니다
          </span>
        </h1>
        <p className="text-xl text-ganzicorp-light/90 mb-12 leading-relaxed">
          혁신적인 기술로 미래를 만들어가는 회사<br/>
          차세대 솔루션으로 비즈니스의 새로운 가능성을 열어갑니다
        </p>
        <div className="flex gap-6 justify-center flex-wrap">
          <Button size="lg" className="bg-white text-ganzicorp-primary hover:bg-ganzicorp-light font-semibold hover-lift">
            서비스 살펴보기
          </Button>
          <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-ganzicorp-primary font-semibold">
            문의하기
          </Button>
        </div>
        
        {/* Badge 컴포넌트로 브랜드 테마 테스트 */}
        <div className="flex gap-3 justify-center flex-wrap mt-8">
          <Badge variant="default" className="text-sm">
            ✨ 새로운 디자인
          </Badge>
          <Badge variant="secondary" className="text-sm">
            🎨 커스텀 테마
          </Badge>
          <Badge variant="outline" className="text-white border-white text-sm">
            🚀 GanziCorp 브랜드
          </Badge>
        </div>
        
        {/* Shadcn UI Card 컴포넌트 테스트 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 hover-lift">
            <CardHeader>
              <CardTitle className="text-white">🚀 최신 기술</CardTitle>
              <CardDescription className="text-ganzicorp-light/80">
                최첨단 기술 스택으로 혁신적인 솔루션을 제공합니다
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-white/10 border-white/20 hover-lift">
            <CardHeader>
              <CardTitle className="text-white">💡 혁신적 사고</CardTitle>
              <CardDescription className="text-ganzicorp-light/80">
                창의적인 아이디어로 새로운 가치를 창출합니다
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-white/10 border-white/20 hover-lift">
            <CardHeader>
              <CardTitle className="text-white">🤝 신뢰할 수 있는 파트너</CardTitle>
              <CardDescription className="text-ganzicorp-light/80">
                고객과 함께 성장하는 장기적인 파트너십을 구축합니다
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
    
    {/* 일반 배경에서 커스터마이징된 컴포넌트 테스트 */}
    <section className="py-16 px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            커스터마이징된 Shadcn UI 컴포넌트
          </h2>
          <p className="text-muted-foreground">
            GanziCorp 브랜드 색상이 적용된 컴포넌트들을 확인해보세요
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge>Primary</Badge>
                기본 버튼
              </CardTitle>
              <CardDescription>
                GanziCorp 브랜드 색상이 적용된 기본 버튼입니다
              </CardDescription>
            </CardHeader>
            <div className="p-6 pt-0">
              <Button className="w-full">클릭해보세요</Button>
            </div>
          </Card>
          
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">Secondary</Badge>
                보조 버튼
              </CardTitle>
              <CardDescription>
                보조 색상이 적용된 버튼 스타일입니다
              </CardDescription>
            </CardHeader>
            <div className="p-6 pt-0">
              <Button variant="secondary" className="w-full">보조 버튼</Button>
            </div>
          </Card>
          
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">Outline</Badge>
                외곽선 버튼
              </CardTitle>
              <CardDescription>
                외곽선 스타일의 버튼 디자인입니다
              </CardDescription>
            </CardHeader>
            <div className="p-6 pt-0">
              <Button variant="outline" className="w-full">외곽선 버튼</Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
    </>
  );
} 