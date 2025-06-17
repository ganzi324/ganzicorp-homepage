import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Supabase 연결 테스트
    const { data, error } = await supabase
      .from('notices')
      .select('count(*)')
      .single()

    if (error) {
      console.error('Supabase connection error:', error)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Supabase 연결 실패',
          error: error.message 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase 연결 성공! 🎉',
      data: {
        timestamp: new Date().toISOString(),
        noticesCount: data?.count || 0,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^https?:\/\//, '') || 'Not configured'
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