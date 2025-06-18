'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { 
  Save, 
  Eye, 
  Send,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'

// 폼 validation 스키마
const noticeSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(200, '제목은 200자 이하로 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요').max(10000, '내용은 10,000자 이하로 입력해주세요'),
  category: z.string().min(1, '카테고리를 선택해주세요'),
  published: z.boolean(),
  isPinned: z.boolean()
})

type NoticeFormData = z.infer<typeof noticeSchema>

interface NoticeFormProps {
  initialData?: Partial<NoticeFormData> & { id?: number }
  onSubmit: (data: NoticeFormData, action: 'draft' | 'publish') => Promise<void>
  isLoading?: boolean
}

const categories = [
  { value: '공지', label: '공지' },
  { value: '서비스', label: '서비스' },
  { value: '이벤트', label: '이벤트' },
  { value: '기술', label: '기술' }
]

export default function NoticeForm({ initialData, onSubmit, isLoading = false }: NoticeFormProps) {
  const [submitAction, setSubmitAction] = useState<'draft' | 'publish' | null>(null)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm<NoticeFormData>({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      category: initialData?.category || '',
      published: initialData?.published ?? false,
      isPinned: initialData?.isPinned ?? false
    }
  })

  const watchedValues = watch()
  const isEdit = Boolean(initialData?.id)

  const handleFormSubmit = async (data: NoticeFormData) => {
    if (!submitAction) return

    try {
      setAlert(null)
      await onSubmit(data, submitAction)
      setAlert({
        type: 'success',
        message: submitAction === 'draft' 
          ? '임시저장되었습니다.' 
          : isEdit 
            ? '공지사항이 수정되었습니다.'
            : '공지사항이 발행되었습니다.'
      })
    } catch (error) {
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : '오류가 발생했습니다.'
      })
    }
  }

  const handleSaveDraft = () => {
    setSubmitAction('draft')
    handleSubmit(handleFormSubmit)()
  }

  const handlePublish = () => {
    setSubmitAction('publish')
    handleSubmit(handleFormSubmit)()
  }

  const getCharacterCount = (text: string, max: number) => {
    const count = text.length
    const isOverLimit = count > max
    return (
      <span className={`text-sm ${isOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
        {count}/{max}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* 알림 메시지 */}
      {alert && (
        <Alert className={alert.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          {alert.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={alert.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 메인 폼 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 제목 */}
            <Card>
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="공지사항 제목을 입력하세요"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.title && (
                      <p className="text-sm text-red-600">{errors.title.message}</p>
                    )}
                    <div className="ml-auto">
                      {getCharacterCount(watchedValues.title || '', 200)}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">카테고리 *</Label>
                  <Select
                    value={watchedValues.category}
                    onValueChange={(value) => setValue('category', value, { shouldDirty: true })}
                  >
                    <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                      <SelectValue placeholder="카테고리를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 내용 */}
            <Card>
              <CardHeader>
                <CardTitle>내용</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="content">내용 *</Label>
                  <Textarea
                    id="content"
                    {...register('content')}
                    placeholder="공지사항 내용을 입력하세요"
                    rows={15}
                    className={`resize-none ${errors.content ? 'border-red-500' : ''}`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.content && (
                      <p className="text-sm text-red-600">{errors.content.message}</p>
                    )}
                    <div className="ml-auto">
                      {getCharacterCount(watchedValues.content || '', 10000)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    마크다운 문법을 사용할 수 있습니다. (## 제목, ### 소제목, - 목록 등)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 발행 설정 */}
            <Card>
              <CardHeader>
                <CardTitle>발행 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="published"
                    checked={watchedValues.published}
                    onCheckedChange={(checked) => setValue('published', checked as boolean, { shouldDirty: true })}
                  />
                  <Label htmlFor="published" className="text-sm font-medium">
                    즉시 발행
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPinned"
                    checked={watchedValues.isPinned}
                    onCheckedChange={(checked) => setValue('isPinned', checked as boolean, { shouldDirty: true })}
                  />
                  <Label htmlFor="isPinned" className="text-sm font-medium">
                    상단 고정
                  </Label>
                </div>

                <div className="pt-2">
                  <Badge variant={watchedValues.published ? 'default' : 'secondary'}>
                    {watchedValues.published ? '발행됨' : '임시저장'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* 미리보기 */}
            <Card>
              <CardHeader>
                <CardTitle>미리보기</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">제목:</span>
                    <p className="mt-1 line-clamp-2">{watchedValues.title || '제목 없음'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">카테고리:</span>
                    <p className="mt-1">{watchedValues.category || '선택 안됨'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">내용:</span>
                    <p className="mt-1 line-clamp-3 text-gray-600">
                      {watchedValues.content || '내용 없음'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <Eye className="h-4 w-4 mr-2" />
                  전체 미리보기
                </Button>
              </CardContent>
            </Card>

            {/* 작업 버튼 */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleSaveDraft}
                  disabled={isLoading || !isDirty}
                >
                  {isLoading && submitAction === 'draft' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  임시저장
                </Button>
                
                <Button
                  type="button"
                  className="w-full"
                  onClick={handlePublish}
                  disabled={isLoading}
                >
                  {isLoading && submitAction === 'publish' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {isEdit ? '수정하기' : '발행하기'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
} 