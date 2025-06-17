'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Mail, CheckCircle } from 'lucide-react'

export default function NewsletterSubscription() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast({
        title: "이메일을 입력해주세요",
        description: "유효한 이메일 주소를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    // 간단한 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "유효하지 않은 이메일",
        description: "올바른 이메일 형식을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // TODO: 실제 뉴스레터 구독 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000)) // 임시 지연

      setIsSubscribed(true)
      toast({
        title: "구독 완료!",
        description: "뉴스레터 구독이 완료되었습니다. 최신 소식을 이메일로 받아보세요.",
      })
      setEmail('')
    } catch (error) {
      toast({
        title: "구독 실패",
        description: "뉴스레터 구독 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubscribed) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              구독 완료!
            </h2>
            <p className="text-green-700 mb-6">
              GanziCorp 뉴스레터 구독이 완료되었습니다.<br/>
              최신 소식과 공지사항을 이메일로 받아보실 수 있습니다.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsSubscribed(false)}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              다른 이메일로 추가 구독
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <Mail className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-foreground mb-4">
            뉴스레터 구독
          </h2>
          <p className="text-muted-foreground text-lg">
            GanziCorp의 최신 소식과 중요한 공지사항을<br/>
            이메일로 받아보세요.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input 
              type="email" 
              placeholder="이메일 주소를 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              disabled={isLoading}
            >
              {isLoading ? "구독 중..." : "구독하기"}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 space-y-2">
          <p className="text-sm text-muted-foreground">
            언제든지 구독을 취소할 수 있습니다.
          </p>
          <p className="text-xs text-muted-foreground/70">
            개인정보는 안전하게 보호되며, 마케팅 목적으로만 사용됩니다.
          </p>
        </div>

        {/* 구독 혜택 */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">
          <div className="bg-card border rounded-lg p-6">
            <div className="text-primary font-semibold mb-2">📢 최신 공지</div>
            <p className="text-sm text-muted-foreground">
              중요한 공지사항과 업데이트를 가장 먼저 받아보세요.
            </p>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <div className="text-primary font-semibold mb-2">🚀 신규 서비스</div>
            <p className="text-sm text-muted-foreground">
              새로운 서비스와 기능 출시 소식을 이메일로 알려드립니다.
            </p>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <div className="text-primary font-semibold mb-2">🎯 맞춤 정보</div>
            <p className="text-sm text-muted-foreground">
              관심 있는 분야의 전문 정보와 인사이트를 제공합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 