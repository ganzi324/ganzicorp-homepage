'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  isAdmin: boolean
  userProfile: UserProfile | null
  profileLoading: boolean
}

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: 'user' | 'admin' | 'super_admin'
  created_at: string
  updated_at: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const router = useRouter()

  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'super_admin'

  // 사용자 프로필 조회 함수
  const fetchUserProfile = async (userId: string) => {
    try {
      setProfileLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        setUserProfile(null)
        return null
      }
      
      setUserProfile(data)
      return data
    } catch (error) {
      console.error('Exception in fetchUserProfile:', error)
      setUserProfile(null)
      return null
    } finally {
      setProfileLoading(false)
    }
  }

  useEffect(() => {
    // 최초 세션 확인
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session
      setUser(session?.user ?? null)
      
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
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
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setLoading(false)
        return { error: error.message }
      }

      return {}
    } catch {
      setLoading(false)
      return { error: '로그인 중 오류가 발생했습니다.' }
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      setUserProfile(null)
      setProfileLoading(false)
      setLoading(false)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      setLoading(false)
    }
  }

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