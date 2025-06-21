import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import NoticeDetailClient from '@/components/notices/NoticeDetailClient'

interface NoticePageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ preview?: string }>
}

// 서버 사이드에서 기본 공지사항 데이터 조회 (SEO 및 초기 로딩용)
const getNoticeById = async (id: string, isPreview: boolean = false) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const url = `${baseUrl}/api/notices/${id}${isPreview ? '?preview=true' : ''}`
    
    const fetchOptions: RequestInit = {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    
    if (isPreview) {
      const { cookies } = await import('next/headers')
      const cookieStore = await cookies()
      const allCookies = cookieStore.getAll()
      const cookieString = allCookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')
      
      if (cookieString) {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Cookie': cookieString
        }
      }
    }
    
    const response = await fetch(url, fetchOptions)
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.success ? data.data : null
  } catch (error) {
    console.error('Error fetching notice:', error)
    return null
  }
}

export async function generateMetadata({ params, searchParams }: NoticePageProps): Promise<Metadata> {
  const { id } = await params
  const { preview } = await searchParams
  const isPreview = preview === 'true'
  
  // 미리보기 모드일 때는 서버 사이드에서 데이터 조회하지 않음 (클라이언트에서 처리)
  if (isPreview) {
    return {
      title: '공지사항 미리보기 | GanziCorp',
      description: '관리자 미리보기 모드입니다.',
    }
  }
  
  const notice = await getNoticeById(id, false)
  
  if (!notice) {
    return {
      title: '공지사항을 찾을 수 없습니다 | GanziCorp'
    }
  }
  
  return {
    title: `${notice.title} | GanziCorp`,
    description: notice.content.substring(0, 160).replace(/\n/g, ' ').trim() + '...',
    openGraph: {
      title: notice.title,
      description: notice.content.substring(0, 160).replace(/\n/g, ' ').trim() + '...',
      url: `https://ganzicorp.com/notices/${notice.id}`,
    },
  }
}

export default async function NoticePage({ params, searchParams }: NoticePageProps) {
  const { id } = await params
  const { preview } = await searchParams
  const isPreview = preview === 'true'
  
  // 미리보기 모드가 아닌 경우에만 서버 사이드에서 데이터를 미리 조회
  // 미리보기 모드는 클라이언트에서 인증과 함께 처리
  let fallbackNotice = null
  if (!isPreview) {
    fallbackNotice = await getNoticeById(id, false)
    // 발행되지 않은 공지사항에 접근하려고 하면 404 처리
    if (!fallbackNotice) {
      notFound()
    }
  }

  return (
    <MainLayout>
      <Suspense 
        fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">공지사항을 불러오는 중...</p>
            </div>
          </div>
        }
      >
        <NoticeDetailClient 
          noticeId={id} 
          fallbackNotice={fallbackNotice}
        />
      </Suspense>
    </MainLayout>
  )
} 