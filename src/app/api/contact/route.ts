import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { contactFormSchema } from '@/lib/schemas'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Contact form submission received:', { 
      name: body.name, 
      email: body.email, 
      subject: body.subject 
    })
    
    // 입력 데이터 검증
    const validationResult = contactFormSchema.safeParse(body)
    
    if (!validationResult.success) {
      console.error('Validation failed:', validationResult.error.errors)
      return NextResponse.json(
        { 
          success: false, 
          error: '입력 데이터가 올바르지 않습니다',
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const { name, email, company, phone, subject, message } = validationResult.data

    // inquiries 테이블에 저장 (관리자 페이지와 통합)
    // 모든 필드를 포함하여 저장
    const { data, error } = await supabase
      .from('inquiries')
      .insert([{
        name,
        email,
        company: company || null,
        phone: phone || null,
        inquiry_type: 'contact_form',
        subject,
        message,
        status: 'pending'
      }])
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: '데이터베이스 저장 중 오류가 발생했습니다.',
          details: error.message
        },
        { status: 500 }
      )
    }

    // 성공 로그
    console.log('Contact form submission saved to inquiries table:', {
      id: data[0].id,
      name,
      email,
      subject,
      timestamp: new Date().toISOString(),
    })

    // TODO: 이메일 알림 전송 구현
    
    return NextResponse.json({
      success: true,
      message: '문의가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.',
      submissionId: data[0].id
    })

  } catch (error) {
    console.error('Contact form error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET 요청에 대한 처리 (옵션)
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Contact API endpoint is working',
      methods: ['POST'],
      description: 'Use POST method to submit contact form',
      table: 'inquiries'
    },
    { status: 200 }
  )
} 