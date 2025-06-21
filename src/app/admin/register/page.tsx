'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield, Lock, Mail, AlertCircle, CheckCircle, User, Key } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminRegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    secretKey: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAlert(null)

    try {
      if (!formData.email || !formData.password || !formData.secretKey) {
        throw new Error('모든 필수 필드를 입력해주세요.')
      }

      const response = await fetch('/api/admin/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '관리자 계정 생성에 실패했습니다.')
      }

      setAlert({
        type: 'success',
        message: '관리자 계정이 성공적으로 생성되었습니다! 로그인 페이지로 이동합니다.'
      })

      // 3초 후 로그인 페이지로 리다이렉트
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)

    } catch (err) {
      setAlert({
        type: 'error',
        message: err instanceof Error ? err.message : '오류가 발생했습니다.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">관리자 계정 생성</h1>
          <p className="text-muted-foreground">
            새로운 관리자 계정을 생성합니다
          </p>
          <Badge variant="destructive" className="mt-2">
            <Lock className="h-3 w-3 mr-1" />
            최고 보안 등급
          </Badge>
        </div>

        {/* 회원가입 폼 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">관리자 등록</CardTitle>
            <CardDescription>
              관리자 생성 키가 필요합니다. 시스템 관리자에게 문의하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 알림 메시지 */}
              {alert && (
                <Alert className={alert.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                  {alert.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={alert.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                    {alert.message}
                  </AlertDescription>
                </Alert>
              )}

              {/* 이름 */}
              <div className="space-y-2">
                <Label htmlFor="fullName">이름 (선택)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="관리자 이름"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* 이메일 */}
              <div className="space-y-2">
                <Label htmlFor="email">이메일 *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@ganzicorp.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* 비밀번호 */}
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호 *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
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

              {/* 관리자 생성 키 */}
              <div className="space-y-2">
                <Label htmlFor="secretKey">관리자 생성 키 *</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="secretKey"
                    type={showSecretKey ? "text" : "password"}
                    placeholder="관리자 생성 키를 입력하세요"
                    value={formData.secretKey}
                    onChange={(e) => handleInputChange('secretKey', e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    disabled={loading}
                  >
                    {showSecretKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* 등록 버튼 */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    관리자 계정 생성 중...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    관리자 계정 생성
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 안내사항 */}
        <Card className="mt-6 bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <h3 className="font-medium text-sm mb-2 text-yellow-800">⚠️ 중요 사항</h3>
            <div className="space-y-1 text-sm text-yellow-700">
              <p>• 관리자 생성 키는 시스템 관리자만 보유하고 있습니다</p>
              <p>• 생성된 계정은 즉시 관리자 권한을 부여받습니다</p>
              <p>• 보안상 이 페이지는 운영 환경에서 비활성화되어야 합니다</p>
            </div>
          </CardContent>
        </Card>

        {/* 링크 */}
        <div className="text-center mt-6 space-y-2">
          <Button asChild variant="ghost">
            <Link href="/auth/login">
              ← 로그인 페이지로
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">
              홈으로 돌아가기
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 