import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🔒 Testing RLS Policies...')

    // 1. 공지사항 조회 테스트 (게시된 것만 보여야 함)
    const { data: notices, error: noticesError } = await supabase
      .from('notices')
      .select('id, title, is_published')

    if (noticesError) {
      console.error('Notices query error:', noticesError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch notices', details: noticesError },
        { status: 500 }
      )
    }

    // 2. 문의사항 조회 테스트 (anon 사용자는 제한되어야 함)
    const { data: inquiries, error: inquiriesError } = await supabase
      .from('inquiries')
      .select('id, name, email, subject, status')

    // 3. 새 문의사항 생성 테스트 (anon 사용자도 가능해야 함)
    const testInquiry = {
      name: 'RLS 테스트',
      email: 'test@rls.com',
      subject: 'RLS 정책 테스트',
      message: 'Row Level Security 정책이 올바르게 작동하는지 테스트합니다.',
      status: 'pending'
    }

    const { data: newInquiry, error: createError } = await supabase
      .from('inquiries')
      .insert(testInquiry)
      .select()
      .single()

    return NextResponse.json({
      success: true,
      message: 'RLS 정책 테스트 완료 🔒',
      tests: {
        notices: {
          success: !noticesError,
          count: notices?.length || 0,
          publishedOnly: notices?.every(n => n.is_published) || false,
          data: notices
        },
        inquiriesRead: {
          success: !inquiriesError,
          count: inquiries?.length || 0,
          error: inquiriesError?.message || null
        },
        inquiryCreate: {
          success: !createError,
          created: !!newInquiry,
          id: newInquiry?.id || null,
          error: createError?.message || null
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('RLS test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'RLS 테스트 중 오류 발생',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 