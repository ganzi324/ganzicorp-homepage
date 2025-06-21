import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Authorization header missing or invalid' 
        },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    // Supabase에서 토큰 검증
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return NextResponse.json(
        { 
          valid: false, 
          error: error?.message || 'Invalid token' 
        },
        { status: 401 }
      )
    }

    // 사용자 프로필 조회 (선택적)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        ...user
      },
      profile: profileError ? null : profile
    })

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { 
        valid: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
} 