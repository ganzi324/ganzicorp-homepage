import React from 'react';

export default function HomePage() {
  return (
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
          <button className="px-8 py-4 bg-white text-ganzicorp-primary rounded-lg hover-lift card-shadow hover:shadow-lg transition-all duration-300 font-semibold">
            서비스 살펴보기
          </button>
          <button className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-ganzicorp-primary transition-all duration-300 font-semibold">
            문의하기
          </button>
        </div>
        <div className="mt-16">
          <p className="text-ganzicorp-light/70 text-sm">
            🚀 최신 기술 • 💡 혁신적 사고 • 🤝 신뢰할 수 있는 파트너
          </p>
        </div>
      </div>
    </main>
  );
} 