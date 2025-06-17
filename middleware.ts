import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Protected admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page even without authentication
    if (req.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    // For all other admin routes, check for session token in cookies
    const sessionToken = req.cookies.get('sb-access-token') || 
                        req.cookies.get('supabase-auth-token') ||
                        req.cookies.get('sb-dsgclqtuwhcanznygeqh-auth-token')

    if (!sessionToken) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 