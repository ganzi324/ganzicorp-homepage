import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // 공개된 공지사항만 가져오기
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notices:', error)
      return NextResponse.json(
        { success: false, error: '공지사항을 불러오는데 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('Error in notices API:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 