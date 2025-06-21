import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // 모든 프로필에서 관리자 계정 찾기
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at')
      .in('role', ['admin', 'super_admin'])
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching admin profiles:', error)
      return NextResponse.json(
        { 
          success: false, 
          message: '관리자 계정 조회 실패',
          error: error.message 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '관리자 계정 조회 성공',
      data: {
        adminCount: profiles?.length || 0,
        admins: profiles || [],
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: '예상치 못한 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 