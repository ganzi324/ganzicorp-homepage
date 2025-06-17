'use client'
import MainLayout from "@/components/layout/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Eye, EyeOff, Shield, Lock, Mail, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { signIn, loading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (!email || !password) {
        throw new Error('이메일과 비밀번호를 입력해주세요.')
      }

      await signIn(email, password)
      router.push('/admin/dashboard')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.')
    }
  }

  return (
    <MainLayout>
      <section className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">관리자 로그인</h1>
            <p className="text-muted-foreground">
              GanziCorp 관리자 시스템에 접속하세요
            </p>
            <Badge variant="outline" className="mt-2">
              <Lock className="h-3 w-3 mr-1" />
              보안 인증 필요
            </Badge>
          </div>

          {/* 로그인 폼 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">로그인</CardTitle>
              <CardDescription>
                관리자 계정으로 로그인하여 시스템을 관리하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 오류 메시지 */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-destructive">{error}</span>
                  </div>
                )}

                {/* 이메일 */}
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@testcorp.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* 비밀번호 */}
                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="비밀번호를 입력하세요"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* 로그인 버튼 */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      로그인 중...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      로그인
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* 테스트 계정 정보 */}
          <Card className="mt-6 bg-muted/30">
            <CardContent className="p-4">
              <h3 className="font-medium text-sm mb-2">테스트 계정</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><strong>이메일:</strong> admin@testcorp.com</p>
                <p><strong>비밀번호:</strong> testadmin123</p>
              </div>
            </CardContent>
          </Card>

          {/* 홈으로 돌아가기 */}
          <div className="text-center mt-6">
            <Button asChild variant="ghost">
              <Link href="/">
                ← 홈으로 돌아가기
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  )
} 