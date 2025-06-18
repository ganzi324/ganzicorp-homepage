'use client'

import { useState, useMemo, useCallback, memo } from 'react'
import { Bell, X, Check, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNotifications, type Notification } from '@/hooks/useNotifications'

// Memoized notification item component for performance
const NotificationItem = memo(({ 
  notification, 
  onMarkAsRead, 
  onRemove 
}: {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onRemove: (id: string) => void
}) => {
  const typeColors = useMemo(() => ({
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200'
  }), [])

  const typeIcons = useMemo(() => ({
    info: '💬',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  }), [])

  const handleMarkAsRead = useCallback(() => {
    onMarkAsRead(notification.id)
  }, [notification.id, onMarkAsRead])

  const handleRemove = useCallback(() => {
    onRemove(notification.id)
  }, [notification.id, onRemove])

  const formattedTime = useMemo(() => {
    return notification.timestamp.toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }, [notification.timestamp])

  const containerClassName = useMemo(() => {
    const baseClass = `p-3 border rounded-lg ${typeColors[notification.type]}`
    return !notification.read ? `${baseClass} shadow-sm` : `${baseClass} opacity-75`
  }, [typeColors, notification.type, notification.read])

  return (
    <div className={containerClassName}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <span className="text-lg" role="img" aria-label={notification.type}>
            {typeIcons[notification.type]}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm">{notification.title}</h4>
              {!notification.read && (
                <div 
                  className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" 
                  aria-label="읽지 않음"
                />
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1 break-words">{notification.message}</p>
            <p className="text-xs text-gray-500 mt-2" title={notification.timestamp.toLocaleString('ko-KR')}>
              {formattedTime}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAsRead}
              className="h-6 w-6 p-0"
              aria-label="읽음 표시"
              title="읽음 표시"
            >
              <Check className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-6 w-6 p-0"
            aria-label="알림 삭제"
            title="알림 삭제"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
})

NotificationItem.displayName = 'NotificationItem'

// Memoized action buttons component
const NotificationActions = memo(({ 
  unreadCount, 
  totalCount, 
  onMarkAllAsRead, 
  onClearAll 
}: {
  unreadCount: number
  totalCount: number
  onMarkAllAsRead: () => void
  onClearAll: () => void
}) => {
  if (totalCount === 0) return null

  return (
    <div className="flex items-center space-x-1">
      {unreadCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onMarkAllAsRead}
          className="h-6 px-2 text-xs"
          aria-label="모든 알림을 읽음으로 표시"
        >
          <CheckCheck className="h-3 w-3 mr-1" />
          모두 읽음
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-6 px-2 text-xs"
        aria-label="모든 알림 삭제"
      >
        <X className="h-3 w-3 mr-1" />
        전체 삭제
      </Button>
    </div>
  )
})

NotificationActions.displayName = 'NotificationActions'

// Virtual scrolling for large notification lists
const VirtualizedNotificationList = memo(({ 
  notifications, 
  onMarkAsRead, 
  onRemove 
}: {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onRemove: (id: string) => void
}) => {
  const maxVisible = 10 // Show up to 10 notifications at once
  const visibleNotifications = useMemo(() => {
    return notifications.slice(0, maxVisible)
  }, [notifications, maxVisible])

  const hasMore = notifications.length > maxVisible

  return (
    <div className="space-y-2">
      {visibleNotifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onRemove={onRemove}
        />
      ))}
      {hasMore && (
        <div className="text-center py-2">
          <p className="text-xs text-gray-500">
            {notifications.length - maxVisible}개의 알림이 더 있습니다
          </p>
        </div>
      )}
    </div>
  )
})

VirtualizedNotificationList.displayName = 'VirtualizedNotificationList'

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearAll, 
    removeNotification 
  } = useNotifications()

  // Memoized handlers to prevent unnecessary re-renders
  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead()
  }, [markAllAsRead])

  const handleClearAll = useCallback(() => {
    clearAll()
    setIsOpen(false)
  }, [clearAll])

  // Memoized badge content for performance
  const badgeContent = useMemo(() => {
    if (unreadCount === 0) return null
    return unreadCount > 99 ? '99+' : unreadCount.toString()
  }, [unreadCount])

  // Memoized title for better accessibility
  const panelTitle = useMemo(() => {
    const count = notifications.length
    return count > 0 ? `알림 (${count}개)` : '알림'
  }, [notifications.length])

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className="relative p-2"
        aria-label={`알림 센터 ${unreadCount > 0 ? `- ${unreadCount}개의 읽지 않은 알림` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Bell className="h-4 w-4" />
        {badgeContent && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            aria-label={`${unreadCount}개의 읽지 않은 알림`}
          >
            {badgeContent}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-80 z-50"
          role="dialog"
          aria-label="알림 센터"
          aria-modal="false"
        >
          <Card className="shadow-lg border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium" id="notification-title">
                  {panelTitle}
                </CardTitle>
                <NotificationActions
                  unreadCount={unreadCount}
                  totalCount={notifications.length}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onClearAll={handleClearAll}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  새로운 알림이 없습니다
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  <VirtualizedNotificationList
                    notifications={notifications}
                    onMarkAsRead={markAsRead}
                    onRemove={removeNotification}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Backdrop to close notification panel */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={handleClose}
          aria-label="알림 센터 닫기"
          role="button"
          tabIndex={-1}
        />
      )}
    </div>
  )
} 