import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'

// Contact form 스키마 정의
const contactFormSchema = z.object({
  name: z.string().min(2, '이름은 최소 2글자 이상이어야 합니다'),
  email: z.string().email('올바른 이메일 형식을 입력해주세요'),
  company: z.string().optional(),
  phone: z.string().optional(),
  subject: z.string().min(1, '문의 유형을 선택해주세요'),
  message: z.string().min(10, '메시지는 최소 10글자 이상 작성해주세요'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 입력 데이터 검증
    const validationResult = contactFormSchema.safeParse(body)
    
    if (!validationResult.success) {
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

    // 데이터베이스에 저장
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name,
          email,
          company: company || null,
          phone: phone || null,
          subject,
          message,
          status: 'new'
        }
      ])
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: '데이터베이스 저장 중 오류가 발생했습니다.' 
        },
        { status: 500 }
      )
    }

    // 성공 로그
    console.log('Contact form submission saved:', {
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
        error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
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
      description: 'Use POST method to submit contact form'
    },
    { status: 200 }
  )
} 