import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 타입 정의
export interface Notice {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  is_published: boolean
  author_id?: string
}

export interface Inquiry {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
  status: 'pending' | 'in_progress' | 'resolved'
  response?: string
  responded_at?: string
} 