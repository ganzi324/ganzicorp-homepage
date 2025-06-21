import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, fullName, secretKey } = body

    // 필수 필드 검증
    if (!email || !password || !secretKey) {
      return NextResponse.json(
        { success: false, error: '이메일, 비밀번호, 관리자 키를 모두 입력해주세요.' },
        { status: 400 }
      )
    }

    // 관리자 생성 시크릿 키 확인 (환경변수에서 관리)
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: '관리자 생성 권한이 없습니다.' },
        { status: 403 }
      )
    }

    // 기존 관리자 중복 확인
    const { data: existingAdmin } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single()

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: '이미 존재하는 이메일입니다.' },
        { status: 409 }
      )
    }

    // Supabase Auth에 사용자 생성
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // 이메일 확인 없이 바로 활성화
      user_metadata: {
        full_name: fullName || email,
        role: 'admin'
      }
    })

    if (authError) {
      console.error('Auth user creation error:', authError)
      return NextResponse.json(
        { success: false, error: '관리자 계정 생성에 실패했습니다.' },
        { status: 500 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: '사용자 생성에 실패했습니다.' },
        { status: 500 }
      )
    }

    // profiles 테이블에 관리자 프로필 생성
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        full_name: fullName || email,
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // 생성된 Auth 사용자 삭제 (롤백)
      await supabase.auth.admin.deleteUser(authData.user.id)
      
      return NextResponse.json(
        { success: false, error: '관리자 프로필 생성에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '관리자 계정이 성공적으로 생성되었습니다.',
      admin: {
        id: authData.user.id,
        email: authData.user.email,
        full_name: fullName || email,
        role: 'admin'
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 