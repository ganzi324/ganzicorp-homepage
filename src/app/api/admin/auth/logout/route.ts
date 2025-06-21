import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      
      // Supabase 세션 확인 및 로그아웃
      const { error } = await supabase.auth.admin.signOut(token)
      
      if (error) {
        console.error('Logout error:', error)
      }
    }

    return NextResponse.json({
      success: true,
      message: '로그아웃이 완료되었습니다.'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 