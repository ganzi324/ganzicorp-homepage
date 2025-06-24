import toast from 'react-hot-toast';

// 재사용 가능한 토스트 스타일 설정
const commonToastStyle = {
  fontWeight: '500',
  fontSize: '14px',
} as const;

// 성공 토스트
export const showSuccessToast = (message: string, duration: number = 4000) => {
  return toast.success(message, {
    duration,
    style: commonToastStyle,
  });
};

// 에러 토스트
export const showErrorToast = (message: string, duration: number = 5000) => {
  return toast.error(message, {
    duration,
    style: commonToastStyle,
  });
};

// 로딩 토스트
export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    style: commonToastStyle,
  });
};

// 일반 토스트
export const showInfoToast = (message: string, duration: number = 4000) => {
  return toast(message, {
    duration,
    style: {
      ...commonToastStyle,
      background: 'white',
      color: 'hsl(var(--foreground))',
      border: '1px solid hsl(var(--border))',
    },
    iconTheme: {
      primary: 'hsl(var(--ganzicorp-primary))',
      secondary: 'white',
    },
  });
};

// Promise 기반 토스트 (API 호출에 유용)
export const showPromiseToast = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  }
) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    {
      style: commonToastStyle,
      success: {
        duration: 4000,
      },
      error: {
        duration: 5000,
      },
    }
  );
};

// 토스트 제거
export const dismissToast = (toastId?: string) => {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss();
  }
};

// 모든 토스트 제거
export const dismissAllToasts = () => {
  toast.dismiss();
}; 