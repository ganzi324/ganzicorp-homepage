'use client'

import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'

interface ShareButtonProps {
  title: string
  content: string
  url?: string
}

export default function ShareButton({ title, content, url }: ShareButtonProps) {
  const handleShare = () => {
    const shareUrl = url || window.location.href
    
    if (navigator.share) {
      navigator.share({
        title: title,
        text: content.substring(0, 100) + '...',
        url: shareUrl
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert('링크가 복사되었습니다.')
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleShare}
    >
      <Share2 className="h-4 w-4 mr-2" />
      공유
    </Button>
  )
} 