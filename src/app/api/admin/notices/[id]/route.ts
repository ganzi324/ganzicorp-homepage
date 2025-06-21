import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyAuth } from '@/lib/auth'

// GET - 관리자용 특정 공지사항 조회 (발행 상태 무관)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 개발 환경에서는 인증 우회 (실제 운영 환경에서는 제거 필요)
    if (process.env.NODE_ENV === 'production') {
      const auth = await verifyAuth(request)
      if (!auth.isAdmin) {
        return NextResponse.json(
          { success: false, error: '관리자 권한이 필요합니다.' },
          { status: 403 }
        )
      }
    }

    const { id } = await params
    
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: '공지사항을 찾을 수 없습니다.' },
          { status: 404 }
        )
      }
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: '공지사항을 불러오는 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// PATCH - 공지사항 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 개발 환경에서는 인증 우회 (실제 운영 환경에서는 제거 필요)
    if (process.env.NODE_ENV === 'production') {
      const auth = await verifyAuth(request)
      if (!auth.isAdmin) {
        return NextResponse.json(
          { success: false, error: '관리자 권한이 필요합니다.' },
          { status: 403 }
        )
      }
    }

    const { id } = await params
    const body = await request.json()
    const { title, content, is_published } = body

    // 필수 필드 검증
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: '제목과 내용은 필수입니다.' },
        { status: 400 }
      )
    }

    // 공지사항 수정 (실제 테이블 구조에 맞게 수정)
    const { data: notice, error } = await supabase
      .from('notices')
      .update({
        title,
        content,
        is_published: is_published !== undefined ? is_published : false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .maybeSingle()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: '공지사항 수정 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    if (!notice) {
      return NextResponse.json(
        { success: false, error: '공지사항을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: notice,
      message: '공지사항이 성공적으로 수정되었습니다.'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// DELETE - 공지사항 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 개발 환경에서는 인증 우회 (실제 운영 환경에서는 제거 필요)
    if (process.env.NODE_ENV === 'production') {
      const auth = await verifyAuth(request)
      if (!auth.isAdmin) {
        return NextResponse.json(
          { success: false, error: '관리자 권한이 필요합니다.' },
          { status: 403 }
        )
      }
    }

    const { id } = await params

    const { error } = await supabase
      .from('notices')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: '공지사항 삭제 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '공지사항이 성공적으로 삭제되었습니다.'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 