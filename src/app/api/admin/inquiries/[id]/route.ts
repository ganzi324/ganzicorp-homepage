import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Inquiry not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching inquiry:', error)
      return NextResponse.json(
        { error: 'Failed to fetch inquiry', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ inquiry: data })
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/inquiries/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, response } = body

    const updateData: Record<string, unknown> = {}
    
    if (status) {
      updateData.status = status
    }
    
    if (response) {
      updateData.response = response
      updateData.responded_at = new Date().toISOString()
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('inquiries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Inquiry not found' },
          { status: 404 }
        )
      }
      console.error('Error updating inquiry:', error)
      return NextResponse.json(
        { error: 'Failed to update inquiry', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ inquiry: data })
  } catch (error) {
    console.error('Unexpected error in PATCH /api/admin/inquiries/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

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

    return NextResponse.json({ message: 'Inquiry deleted successfully' })
  } catch (error) {
    console.error('Unexpected error in DELETE /api/admin/inquiries/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 