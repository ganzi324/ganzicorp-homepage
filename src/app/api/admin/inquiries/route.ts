import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    console.log('Fetching inquiries with params:', { status, limit, offset })

    let query = supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query

    console.log('Inquiries query result:', { 
      dataCount: data?.length || 0, 
      totalCount: count,
      error: error?.message || null,
      firstInquiryId: data?.[0]?.id || 'none'
    })

    if (error) {
      console.error('Error fetching inquiries:', error)
      return NextResponse.json(
        { error: 'Failed to fetch inquiries', details: error.message },
        { status: 500 }
      )
    }

    // 데이터가 있는 경우 첫 번째 문의의 ID를 로그로 출력
    if (data && data.length > 0) {
      console.log('Available inquiry IDs:', data.map(inquiry => inquiry.id).slice(0, 5))
    }

    return NextResponse.json({
      inquiries: data || [],
      total: count || 0,
      limit,
      offset
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/inquiries:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message, company, phone, inquiry_type } = body

    console.log('Creating new inquiry:', { name, email, subject })

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('inquiries')
      .insert([{
        name,
        email,
        company: company || null,
        phone: phone || null,
        inquiry_type: inquiry_type || 'general',
        subject,
        message,
        status: 'pending'
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating inquiry:', error)
      return NextResponse.json(
        { error: 'Failed to create inquiry', details: error.message },
        { status: 500 }
      )
    }

    console.log('Successfully created inquiry:', data.id)
    return NextResponse.json({ inquiry: data }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/inquiries:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 