import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'
import { Profile } from '@/lib/supabase'

export type UserRole = 'user' | 'admin' | 'super_admin'

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  role: UserRole
  created_at: string
  updated_at: string
}

// 현재 사용자 정보 가져오기
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// 현재 사용자의 프로필 정보 가져오기
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return profile
}

// 사용자 역할 확인
export async function getUserRole(userId?: string): Promise<UserRole> {
  const targetUserId = userId || (await getCurrentUser())?.id
  if (!targetUserId) return 'user'

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', targetUserId)
    .single()

  return profile?.role || 'user'
}

// 관리자 권한 확인
export async function isAdmin(userId?: string): Promise<boolean> {
  const role = await getUserRole(userId)
  return role === 'admin' || role === 'super_admin'
}

// 슈퍼 관리자 권한 확인
export async function isSuperAdmin(userId?: string): Promise<boolean> {
  const role = await getUserRole(userId)
  return role === 'super_admin'
}

// 사용자 프로필 업데이트
export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<UserProfile, 'full_name' | 'role'>>
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) {
    console.error('Error updating user profile:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// 모든 사용자 프로필 가져오기 (관리자 전용)
export async function getAllUserProfiles(): Promise<UserProfile[]> {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user profiles:', error)
    return []
  }

  return profiles || []
}

// 사용자 로그인
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, user: data.user }
}

// 사용자 회원가입
export async function signUp(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, user: data.user }
}

// 사용자 로그아웃
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

// 인증 상태 변경 리스너
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null)
  })
}

// 서버 측에서 사용자 인증 확인 (API 라우트용) - Supabase 권장 방식
export async function verifyAuth(_request: Request): Promise<{
  user: User | null
  profile: Profile | null
  isAuthenticated: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
}> {
  try {
    // Supabase 권장 방식으로 서버 클라이언트 생성
    const supabase = await createClient()
    
    // 사용자 인증 확인 (쿠키에서 자동으로 세션 추출)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        user: null,
        profile: null,
        isAuthenticated: false,
        isAdmin: false,
        isSuperAdmin: false,
      }
    }

    // 사용자 프로필 조회
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('프로필 조회 실패:', profileError)
      return {
        user,
        profile: null,
        isAuthenticated: true,
        isAdmin: false,
        isSuperAdmin: false,
      }
    }

    return {
      user,
      profile,
      isAuthenticated: true,
      isAdmin: profile.role === 'admin' || profile.role === 'super_admin',
      isSuperAdmin: profile.role === 'super_admin',
    }
  } catch (error) {
    console.error('verifyAuth 오류:', error)
    return {
      user: null,
      profile: null,
      isAuthenticated: false,
      isAdmin: false,
      isSuperAdmin: false,
    }
  }
} 