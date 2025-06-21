import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getInquirySafe } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('Fetching inquiry with ID:', id)
    
    // ID 형식 검증
    if (!id || typeof id !== 'string') {
      console.error('Invalid inquiry ID:', id)
      return NextResponse.json(
        { error: '잘못된 문의 ID입니다.' },
        { status: 400 }
      )
    }
    
    // 안전한 데이터 페칭 함수 사용 (런타임 검증 포함)
    const result = await getInquirySafe(id)

    if (!result.success) {
      console.error('데이터 페칭 또는 검증 실패:', result.error)
      
      // 404 에러 처리
      if (result.error.includes('No rows returned') || result.error.includes('PGRST116')) {
        return NextResponse.json(
          { error: '해당 ID의 문의를 찾을 수 없습니다.' },
          { status: 404 }
        )
      }
      
      // 기타 오류
      return NextResponse.json(
        { error: '데이터를 가져오는데 실패했습니다.', details: result.error },
        { status: 500 }
      )
    }

    console.log('Successfully fetched and validated inquiry:', result.data.id)
    return NextResponse.json({ inquiry: result.data })
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/inquiries/[id]:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    console.log('Updating inquiry status:', { id, status })

    if (!status) {
      return NextResponse.json(
        { error: '상태 값이 필요합니다.' },
        { status: 400 }
      )
    }

    // 유효한 상태 값 검증
    const validStatuses = ['pending', 'in_progress', 'resolved', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: '유효하지 않은 상태 값입니다.' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('inquiries')
      .update({ 
        status, 
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating inquiry status:', error)
      
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: '해당 ID의 문의를 찾을 수 없습니다.' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: '문의 상태 업데이트에 실패했습니다.', details: error.message },
        { status: 500 }
      )
    }

    console.log('Successfully updated inquiry status:', data.id)
    return NextResponse.json({ 
      success: true, 
      inquiry: data 
    })
  } catch (error) {
    console.error('Unexpected error in PATCH /api/admin/inquiries/[id]:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('Deleting inquiry with ID:', id)

    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting inquiry:', error)
      return NextResponse.json(
        { error: 'Failed to delete inquiry', details: error.message },
        { status: 500 }
      )
    }

    console.log('Successfully deleted inquiry:', id)
    return NextResponse.json({ message: 'Inquiry deleted successfully' })
  } catch (error) {
    console.error('Unexpected error in DELETE /api/admin/inquiries/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 