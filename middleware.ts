import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Supabase 세션 업데이트 (권장 방식)
  const response = await updateSession(request)
  
  // 관리자 페이지 보호 (선택적)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 기본적인 경로 보호만 수행
    // 실제 권한 확인은 각 API와 컴포넌트에서 처리
    // 이렇게 하면 미들웨어는 세션 관리에만 집중할 수 있음
  }

  return response
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 