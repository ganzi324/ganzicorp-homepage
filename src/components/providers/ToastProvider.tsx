'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{
        top: 80, // 헤더 아래에 위치
      }}
      toastOptions={{
        // 글로벌 설정
        className: 'font-medium text-sm',
        duration: 4000,
        style: {
          borderRadius: '0.5rem', // --radius와 일치
          padding: '12px 16px',
          fontSize: '14px',
          maxWidth: '400px',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        },
        // 성공 토스트 스타일
        success: {
          iconTheme: {
            primary: 'hsl(var(--ganzicorp-primary))',
            secondary: 'white',
          },
          style: {
            background: 'white',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        },
        // 에러 토스트 스타일
        error: {
          iconTheme: {
            primary: 'white',
            secondary: 'hsl(var(--destructive))',
          },
          style: {
            background: 'hsl(var(--destructive))',
            color: 'hsl(var(--destructive-foreground))',
          },
        },
        // 로딩 토스트 스타일
        loading: {
          iconTheme: {
            primary: 'hsl(var(--ganzicorp-primary))',
            secondary: 'white',
          },
          style: {
            background: 'white',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        },
      }}
    />
  );
} 