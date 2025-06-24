'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'
import { Profile } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  isAdmin: boolean
  userProfile: Profile | null
  profileLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const router = useRouter()

  // Supabase 클라이언트 인스턴스
  const supabase = createClient()

  // 사용자 프로필 가져오기
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      setProfileLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('프로필 가져오기 실패:', error)
        return
      }

      setUserProfile(data)
    } catch (error) {
      console.error('프로필 가져오기 오류:', error)
    } finally {
      setProfileLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    // 최초 세션 확인
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session
      setUser(session?.user ?? null)
      setLoading(false)

      if (session?.user) {
        fetchUserProfile(session.user.id)
      }
    })

    // 세션 변경 감지
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
        setProfileLoading(false)
      }
      
      setLoading(false)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [supabase.auth, fetchUserProfile])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error: error?.message }
    } catch (error) {
      console.error('로그인 오류:', error)
      return { error: error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.' }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      setUserProfile(null)
      setProfileLoading(false)
      router.push('/')
    } catch (error) {
      console.error('로그아웃 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  // 관리자 권한 확인 (슈퍼 어드민 포함)
  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'super_admin'

  const value = {
    user,
    loading,
    signIn,
    signOut,
    isAdmin,
    userProfile,
    profileLoading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// AuthProvider가 없어도 사용할 수 있는 안전한 훅
export function useOptionalAuth() {
  const context = useContext(AuthContext)
  
  // AuthProvider가 없으면 기본값 반환
  if (context === undefined) {
    return {
      user: null,
      loading: false,
      signIn: async () => ({ error: '인증이 설정되지 않았습니다.' }),
      signOut: async () => {},
      isAdmin: false,
      userProfile: null,
      profileLoading: false,
    }
  }
  
  return context
} 