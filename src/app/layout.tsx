import './globals.css';
import { Inter } from 'next/font/google';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GanziCorp - 혁신적인 기술 솔루션',
  description: 'GanziCorp는 혁신적인 기술로 미래를 만들어가는 회사입니다.',
  keywords: 'GanziCorp, 기술, 솔루션, 혁신, IT서비스',
  authors: [{ name: 'GanziCorp' }],
  creator: 'GanziCorp',
  publisher: 'GanziCorp',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div id="root">{children}</div>
      </body>
    </html>
  );
} 