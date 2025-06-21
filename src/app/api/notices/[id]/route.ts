import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 관리자 권한 확인 함수
async function checkAdminAuth(request: NextRequest): Promise<boolean> {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false
    }

    const token = authHeader.substring(7)
    
    // Supabase에서 토큰 검증
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return false
    }

    // 사용자 프로필에서 역할 확인
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return false
    }

    return profile.role === 'admin'
  } catch (error) {
    console.error('Admin auth check error:', error)
    return false
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const preview = searchParams.get('preview') === 'true'
    
    console.log('=== NOTICE API REQUEST ===')
    console.log('Notice ID:', id)
    console.log('Preview mode:', preview)
    console.log('Request timestamp:', new Date().toISOString())
    
    // 미리보기 모드일 경우
    if (preview) {
      console.log('Preview mode - checking admin permissions...')
      const isAdmin = await checkAdminAuth(request)
      console.log('Admin check result:', isAdmin)
      
      if (!isAdmin) {
        console.log('PREVIEW DENIED: Not admin')
        return NextResponse.json(
          { success: false, error: '관리자 권한이 필요합니다.' },
          { status: 403 }
        )
      }
      
      console.log('PREVIEW GRANTED: Admin access confirmed')
      // 관리자는 모든 공지사항 조회 가능 (발행 상태 무관)
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching notice:', error)
        if (error.code === 'PGRST116') {
          return NextResponse.json(
            { success: false, error: '공지사항을 찾을 수 없습니다.' },
            { status: 404 }
          )
        }
        return NextResponse.json(
          { success: false, error: '공지사항을 불러오는 중 오류가 발생했습니다.' },
          { status: 500 }
        )
      }

      if (!data) {
        return NextResponse.json(
          { success: false, error: '공지사항을 찾을 수 없습니다.' },
          { status: 404 }
        )
      }

      // 미리보기에서는 조회수 증가 안함
      return NextResponse.json({
        success: true,
        data
      })
    } else {
      // 미리보기가 아닌 경우 - 발행된 공지사항만 조회
      console.log('Regular mode - published notices only')
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single()

      if (error) {
        console.error('Error fetching notice:', error)
        if (error.code === 'PGRST116') {
          return NextResponse.json(
            { success: false, error: '접근할 수 없는 공지사항입니다.' },
            { status: 403 }
          )
        }
        return NextResponse.json(
          { success: false, error: '공지사항을 불러오는 중 오류가 발생했습니다.' },
          { status: 500 }
        )
      }

      if (!data) {
        return NextResponse.json(
          { success: false, error: '접근할 수 없는 공지사항입니다.' },
          { status: 403 }
        )
      }

      // 조회수 증가
      await supabase
        .from('notices')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id)
        
      return NextResponse.json({
        success: true,
        data: { ...data, views: (data.views || 0) + 1 }
      })
    }
  } catch (error) {
    console.error('Error in notice API:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 