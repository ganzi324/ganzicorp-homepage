'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'

export default function AdminInquiryDetailPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const params = useParams()
  const inquiryId = params.id as string

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/admin/login')
    }
  }, [user, isAdmin, router])

  if (!user || !isAdmin) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/inquiries')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">문의 상세</h1>
            <p className="text-gray-600 mt-1">문의 ID: {inquiryId}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>문의 상세 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-gray-500">
              문의 상세 보기 기능을 구현 중입니다...
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 