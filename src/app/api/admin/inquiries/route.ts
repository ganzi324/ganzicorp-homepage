import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching inquiries:', error)
      return NextResponse.json(
        { error: 'Failed to fetch inquiries', details: error.message },
        { status: 500 }
      )
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
    const { name, email, subject, message } = body

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

    return NextResponse.json({ inquiry: data }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/inquiries:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 