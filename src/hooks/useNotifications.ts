import { useState, useEffect, useCallback, useMemo } from 'react'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
  autoClose?: boolean
  duration?: number
}

interface UseNotificationsResult {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  removeNotification: (id: string) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
}

// In-memory cache to prevent duplicate notifications
const notificationCache = new Map<string, number>()
const DUPLICATE_THRESHOLD = 5000 // 5 seconds

export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Memoized unread count for performance
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length
  }, [notifications])

  const removeNotification = useCallback((id: string) => {
    setNotifications(current => current.filter(n => n.id !== id))
  }, [])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    // Create a cache key based on notification content
    const cacheKey = `${notification.type}-${notification.title}-${notification.message}`
    const now = Date.now()
    
    // Check for duplicate notifications within threshold
    const lastNotificationTime = notificationCache.get(cacheKey)
    if (lastNotificationTime && (now - lastNotificationTime) < DUPLICATE_THRESHOLD) {
      console.log('Duplicate notification prevented:', notification.title)
      return // Skip duplicate notification
    }
    
    // Update cache
    notificationCache.set(cacheKey, now)
    
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
      autoClose: notification.autoClose ?? true,
      duration: notification.duration ?? 5000
    }

    setNotifications(current => {
      // Limit total notifications to prevent memory issues
      const maxNotifications = 50
      const updatedNotifications = [newNotification, ...current]
      
      if (updatedNotifications.length > maxNotifications) {
        return updatedNotifications.slice(0, maxNotifications)
      }
      
      return updatedNotifications
    })

    // Browser notification if permission is granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(newNotification.title, {
          body: newNotification.message,
          icon: '/favicon.ico',
          tag: newNotification.id,
          requireInteraction: !newNotification.autoClose
        })
      } catch (error) {
        console.warn('Failed to show browser notification:', error)
      }
    }

    // Auto remove if enabled
    if (newNotification.autoClose && newNotification.duration) {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, newNotification.duration)
    }

    return newNotification.id
  }, [removeNotification])

  const markAsRead = useCallback((id: string) => {
    setNotifications(current => 
      current.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(current => 
      current.map(notification => ({ ...notification, read: true }))
    )
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
    // Clear cache when all notifications are cleared
    notificationCache.clear()
  }, [])

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().catch(error => {
          console.warn('Failed to request notification permission:', error)
        })
      }
    }
  }, [])

  // Cleanup cache periodically to prevent memory leaks
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now()
      for (const [key, timestamp] of notificationCache.entries()) {
        if (now - timestamp > DUPLICATE_THRESHOLD * 2) {
          notificationCache.delete(key)
        }
      }
    }

    const intervalId = setInterval(cleanup, 60000) // Cleanup every minute

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll
  }
} 