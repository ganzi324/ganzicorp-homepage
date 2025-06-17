import './globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'GanziCorp - 혁신적인 기술 솔루션',
    template: '%s - GanziCorp'
  },
  description: '최신 기술로 비즈니스 혁신을 이끄는 GanziCorp입니다. 웹 개발, 모바일 앱, 클라우드 인프라, AI 솔루션 등 전문 기술 서비스를 제공합니다.',
  keywords: ['웹개발', '모바일앱', '클라우드', 'AI', '기술솔루션', '소프트웨어개발'],
  authors: [{ name: 'GanziCorp' }],
  creator: 'GanziCorp',
  publisher: 'GanziCorp',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://ganzicorp.com',
    siteName: 'GanziCorp',
    title: 'GanziCorp - 혁신적인 기술 솔루션',
    description: '최신 기술로 비즈니스 혁신을 이끄는 GanziCorp입니다.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GanziCorp - 혁신적인 기술 솔루션',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GanziCorp - 혁신적인 기술 솔루션',
    description: '최신 기술로 비즈니스 혁신을 이끄는 GanziCorp입니다.',
    images: ['/og-image.jpg'],
    creator: '@ganzicorp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          <div id="root">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
} 