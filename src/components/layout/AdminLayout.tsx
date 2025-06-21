'use client'

import { ReactNode, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/AuthProvider'
import { 
  Menu, 
  X, 
  Home,
  FileText,
  Users,
  Settings,
  LogOut,
  MessageSquare
} from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
}

const sidebarItems = [
  {
    title: '대시보드',
    href: '/admin',
    icon: Home
  },
  {
    title: '공지사항 관리',
    href: '/admin/notices',
    icon: FileText
  },
  {
    title: '문의 관리',
    href: '/admin/inquiries',
    icon: MessageSquare
  },
  {
    title: '사용자 관리',
    href: '/admin/users',
    icon: Users
  },
  {
    title: '설정',
    href: '/admin/settings',
    icon: Settings
  }
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [wasAdminOnce, setWasAdminOnce] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAdmin, loading, signOut, userProfile, profileLoading } = useAuth()

  // 관리자 상태 기억 및 접근 제어
  useEffect(() => {
    if (!loading && !profileLoading) {
      if (isAdmin) {
        setWasAdminOnce(true)
      } else if (!user) {
        router.push('/auth/login')
      } else if (!isAdmin) {
        router.push('/')
      }
    }
  }, [user, isAdmin, loading, profileLoading, router])

  // 로딩 중일 때는 로딩 화면 표시 (한 번도 관리자였던 적이 없는 경우만)
  if ((loading || profileLoading) && !wasAdminOnce) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {loading ? '인증 정보를 확인하는 중...' : '사용자 정보를 불러오는 중...'}
          </p>
        </div>
      </div>
    )
  }

  // 로그인하지 않았거나 관리자가 아닌 경우 빈 화면 (리다이렉트 처리 중)
  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 사이드바 */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:relative lg:flex lg:flex-col"
      )}>
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Admin</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* 네비게이션 */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    isActive 
                      ? "bg-blue-50 text-blue-700 border border-blue-200" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              )
            })}
          </nav>

          {/* 하단 */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {userProfile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {userProfile?.full_name || '관리자'}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-gray-600 hover:text-gray-900"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* 상단 헤더 */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center justify-between px-6 py-4 h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 leading-none">관리자 대시보드</h1>
            </div>

            <div className="flex items-center space-x-3">
              {/* 홈페이지로 이동 */}
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  홈페이지
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* 페이지 콘텐츠 */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}