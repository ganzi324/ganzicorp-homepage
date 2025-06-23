'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

// Disable static generation for admin pages
export const dynamic = 'force-dynamic'
import AdminLayout from "@/components/layout/AdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  FileText, 
  Settings,
  Activity,
  Database,
  Globe
} from "lucide-react"

export default function AdminDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: "총 사용자",
      value: "1,234",
      description: "전체 등록 사용자",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "공지사항",
      value: "45",
      description: "게시된 공지사항",
      icon: FileText,
      color: "text-green-600"
    },
    {
      title: "문의사항",
      value: "23",
      description: "대기 중인 문의",
      icon: Activity,
      color: "text-orange-600"
    },
    {
      title: "시스템 상태",
      value: "정상",
      description: "모든 서비스 운영 중",
      icon: Database,
      color: "text-green-600"
    }
  ]

  const quickActions = [
    {
      title: "공지사항 관리",
      description: "공지사항을 작성하고 관리합니다",
      icon: FileText,
      href: "/admin/notices"
    },
    {
      title: "사용자 관리",
      description: "사용자 계정을 관리합니다",
      icon: Users,
      href: "/admin/users"
    },
    {
      title: "사이트 설정",
      description: "웹사이트 설정을 변경합니다",
      icon: Settings,
      href: "/admin/settings"
    },
    {
      title: "사이트 보기",
      description: "공개 웹사이트를 확인합니다",
      icon: Globe,
      href: "/"
    }
  ]

  return (
    <AdminLayout>
      {/* 통계 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-8">시스템 현황</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 빠른 작업 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-8">빠른 작업</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <action.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="ghost" 
                  className="w-full group-hover:bg-primary/10"
                  onClick={() => router.push(action.href)}
                >
                  바로가기
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 최근 활동 */}
      <div>
        <h2 className="text-2xl font-bold mb-8">최근 활동</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>시스템 로그</CardTitle>
            <CardDescription>최근 시스템 활동 내역</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">새 공지사항 게시됨</p>
                  <p className="text-xs text-muted-foreground">2시간 전 • admin@testcorp.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">사용자 프로필 업데이트</p>
                  <p className="text-xs text-muted-foreground">4시간 전 • 사용자 관리</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">시스템 백업 완료</p>
                  <p className="text-xs text-muted-foreground">6시간 전 • 자동 백업</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 