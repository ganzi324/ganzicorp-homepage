import React from 'react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          GanziCorp에 오신 것을 환영합니다
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          혁신적인 기술로 미래를 만들어가는 회사
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            서비스 보기
          </button>
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            문의하기
          </button>
        </div>
      </div>
    </main>
  );
} 