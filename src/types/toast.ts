import { DefaultToastOptions } from 'react-hot-toast';

// 토스트 타입 정의
export type ToastType = 'success' | 'error' | 'loading' | 'info';

// 토스트 옵션 확장
export interface CustomToastOptions extends Partial<DefaultToastOptions> {
  type?: ToastType;
  autoClose?: boolean;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

// Promise 토스트 메시지 타입
export interface PromiseToastMessages<T = any> {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((error: any) => string);
}

// 폼 제출 상태 타입
export type FormSubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

// 토스트 스타일 테마
export interface ToastTheme {
  colors: {
    primary: string;
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  fontSize: string;
  borderRadius: string;
  padding: string;
  maxWidth: string;
} 