import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import NoticeForm from '@/components/forms/NoticeForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface NoticeFormData {
  title: string
  content: string
  category: string
  published: boolean
  isPinned: boolean
}

interface EditNoticePageProps {
  params: Promise<{ id: string }>
}

// 임시 데이터 - 실제로는 API에서 가져올 예정
const getNoticeById = async (id: string) => {
  const notices = [
    {
      id: 1,
      title: 'GanziCorp 공식 홈페이지 오픈',
      content: `안녕하세요. GanziCorp의 공식 홈페이지가 새롭게 오픈되었습니다.

저희 GanziCorp은 혁신적인 기술 솔루션을 제공하는 전문 기업으로, 고객의 성공을 위해 최선을 다하고 있습니다.

## 주요 특징

### 1. 최신 기술 스택
- Next.js 15 기반의 현대적인 웹 애플리케이션
- TypeScript로 작성된 안전하고 확장 가능한 코드
- Tailwind CSS와 Shadcn UI를 활용한 세련된 디자인

### 2. 사용자 중심 설계
- 직관적이고 사용하기 쉬운 인터페이스
- 반응형 디자인으로 모든 디바이스에서 최적화
- 빠른 로딩 속도와 우수한 성능

### 3. 포괄적인 서비스 정보
- 회사 소개 및 비전
- 제공 서비스 상세 정보
- 연락처 및 문의 방법

앞으로도 지속적인 업데이트와 개선을 통해 더 나은 서비스를 제공하겠습니다.

감사합니다.`,
      category: '공지',
      published: true,
      isPinned: true,
      author: '관리자',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      title: '새로운 AI 솔루션 서비스 출시',
      content: '최신 AI 기술을 활용한 맞춤형 솔루션 서비스를 출시했습니다.',
      category: '서비스',
      published: true,
      isPinned: false,
      author: '개발팀',
      createdAt: '2024-01-10T14:20:00Z'
    }
  ]
  
  return notices.find(notice => notice.id === parseInt(id))
}

export async function generateMetadata({ params }: EditNoticePageProps): Promise<Metadata> {
  const resolvedParams = await params
  const notice = await getNoticeById(resolvedParams.id)
  
  if (!notice) {
    return {
      title: '공지사항을 찾을 수 없음 | 관리자',
    }
  }

  return {
    title: `${notice.title} 편집 | 관리자`,
    description: `${notice.title} 공지사항을 편집합니다`,
  }
}

export default async function EditNoticePage({ params }: EditNoticePageProps) {
  const resolvedParams = await params
  const notice = await getNoticeById(resolvedParams.id)

  if (!notice) {
    notFound()
  }

  const handleSubmit = async (data: NoticeFormData, action: 'draft' | 'publish') => {
    try {
      const response = await fetch(`/api/notices/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          published: action === 'publish'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '공지사항 수정에 실패했습니다')
      }

      const result = await response.json()
      
      // 성공 시 목록 페이지로 리다이렉트
      if (action === 'publish') {
        window.location.href = '/admin/notices'
      }
      
      return result
    } catch (error) {
      console.error('Notice update error:', error)
      throw error
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 페이지 헤더 */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/notices">
              <ArrowLeft className="h-4 w-4 mr-2" />
              뒤로가기
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">공지사항 편집</h1>
            <p className="text-gray-600 mt-1">{notice.title}</p>
          </div>
        </div>

        {/* 폼 */}
        <NoticeForm 
          initialData={{
            id: notice.id,
            title: notice.title,
            content: notice.content,
            category: notice.category,
            published: notice.published,
            isPinned: notice.isPinned
          }}
          onSubmit={handleSubmit} 
        />
      </div>
    </AdminLayout>
  )
} 