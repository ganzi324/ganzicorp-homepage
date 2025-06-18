import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Inquiry } from '@/lib/supabase'
import { useNotifications } from '@/hooks/useNotifications'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface UseRealtimeInquiriesResult {
  inquiries: Inquiry[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  connectionStatus: 'connected' | 'disconnected' | 'connecting'
}

interface PendingUpdate {
  type: 'insert' | 'update' | 'delete'
  payload: Inquiry
  timestamp: number
}

export function useRealtimeInquiries(): UseRealtimeInquiriesResult {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting')
  const { addNotification } = useNotifications()
  
  // Performance optimization: Batch updates
  const pendingUpdates = useRef<PendingUpdate[]>([])
  const updateTimeoutRef = useRef<NodeJS.Timeout>()
  const lastNotificationRef = useRef<number>(0)

  // Debounced batch update processor
  const processBatchUpdates = useCallback(() => {
    if (pendingUpdates.current.length === 0) return

    const updates = [...pendingUpdates.current]
    pendingUpdates.current = []

    setInquiries(currentInquiries => {
      let newInquiries = [...currentInquiries]
      
      // Process updates in chronological order
      updates.sort((a, b) => a.timestamp - b.timestamp)
      
      updates.forEach(update => {
        switch (update.type) {
          case 'insert':
            const newInquiry = update.payload as Inquiry
            // Avoid duplicates
            if (!newInquiries.find(i => i.id === newInquiry.id)) {
              newInquiries = [newInquiry, ...newInquiries]
            }
            break
            
          case 'update':
            const updatedInquiry = update.payload as Inquiry
            newInquiries = newInquiries.map(inquiry => 
              inquiry.id === updatedInquiry.id ? updatedInquiry : inquiry
            )
            break
            
          case 'delete':
            const deletedId = update.payload.id
            newInquiries = newInquiries.filter(inquiry => inquiry.id !== deletedId)
            break
        }
      })
      
      return newInquiries
    })
  }, [])

  // Throttled notification system
  const showNotificationThrottled = useCallback((
    type: 'info' | 'success' | 'warning' | 'error',
    title: string,
    message: string,
    autoClose = true
  ) => {
    const now = Date.now()
    const THROTTLE_DELAY = 1000 // 1 second throttle
    
    if (now - lastNotificationRef.current < THROTTLE_DELAY) {
      return // Skip notification if too frequent
    }
    
    lastNotificationRef.current = now
    addNotification({ type, title, message, autoClose })
  }, [addNotification])

  const fetchInquiries = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100) // Limit initial load for performance

      if (error) {
        console.error('Error fetching inquiries:', error)
        setError(error.message)
        setConnectionStatus('disconnected')
      } else {
        setInquiries(data || [])
        setConnectionStatus('connected')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('Unexpected error occurred')
      setConnectionStatus('disconnected')
    } finally {
      setLoading(false)
    }
  }, [])

  // Optimized event handlers with batching
  const handleInsert = useCallback((payload: Record<string, any>) => {
    console.log('New inquiry inserted:', payload.new)
    const newInquiry = payload.new as Inquiry
    
    // Add to pending updates for batch processing
    pendingUpdates.current.push({
      type: 'insert',
      payload: newInquiry,
      timestamp: Date.now()
    })
    
    // Debounce the batch update
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }
    
    updateTimeoutRef.current = setTimeout(processBatchUpdates, 100) // 100ms debounce
    
    // Show notification for new inquiry (throttled)
    showNotificationThrottled(
      'info',
      '새로운 문의가 도착했습니다',
      `${newInquiry.name}님이 "${newInquiry.subject}" 주제로 문의를 남겼습니다.`,
      false
    )
  }, [processBatchUpdates, showNotificationThrottled])

  const handleUpdate = useCallback((payload: Record<string, any>) => {
    console.log('Inquiry updated:', payload.new)
    const updatedInquiry = payload.new as Inquiry
    
    // Add to pending updates for batch processing
    pendingUpdates.current.push({
      type: 'update',
      payload: updatedInquiry,
      timestamp: Date.now()
    })
    
    // Debounce the batch update
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }
    
    updateTimeoutRef.current = setTimeout(processBatchUpdates, 100)
    
    // Show notification for status changes (throttled)
    if (payload.old?.status !== updatedInquiry.status) {
      const statusMessages = {
        pending: '대기 중',
        in_progress: '처리 중',
        resolved: '해결됨'
      }
      
      showNotificationThrottled(
        updatedInquiry.status === 'resolved' ? 'success' : 'info',
        '문의 상태가 변경되었습니다',
        `문의 "${updatedInquiry.subject}"의 상태가 "${statusMessages[updatedInquiry.status as keyof typeof statusMessages] || updatedInquiry.status}"로 변경되었습니다.`
      )
    }
  }, [processBatchUpdates, showNotificationThrottled])

  const handleDelete = useCallback((payload: Record<string, any>) => {
    console.log('Inquiry deleted:', payload.old)
    const deletedInquiry = payload.old as Inquiry
    
    // Add to pending updates for batch processing
    pendingUpdates.current.push({
      type: 'delete',
      payload: deletedInquiry,
      timestamp: Date.now()
    })
    
    // Debounce the batch update
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }
    
    updateTimeoutRef.current = setTimeout(processBatchUpdates, 100)
    
    // Show notification for deletion (throttled)
    showNotificationThrottled(
      'warning',
      '문의가 삭제되었습니다',
      `"${deletedInquiry.subject}" 문의가 삭제되었습니다.`
    )
  }, [processBatchUpdates, showNotificationThrottled])

  useEffect(() => {
    let channel: RealtimeChannel | null = null
    let retryTimeoutId: NodeJS.Timeout
    let connectionNotificationShown = false

    const setupSubscription = () => {
      setConnectionStatus('connecting')
      
      // Initial fetch
      fetchInquiries()

      // Set up realtime subscription with optimized parameters
      channel = supabase
        .channel('inquiries_realtime', {
          config: {
            broadcast: { self: false }, // Don't broadcast to self
            presence: { key: 'inquiries' }
          }
        })
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'inquiries' 
        }, handleInsert)
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'inquiries' 
        }, handleUpdate)
        .on('postgres_changes', { 
          event: 'DELETE', 
          schema: 'public', 
          table: 'inquiries' 
        }, handleDelete)
        .subscribe((status, err) => {
          console.log('Realtime subscription status:', status, err)
          
          if (status === 'SUBSCRIBED') {
            setConnectionStatus('connected')
            console.log('Successfully subscribed to inquiries realtime updates')
            
            // Show connection success notification (only once)
            if (!connectionNotificationShown) {
              connectionNotificationShown = true
              showNotificationThrottled(
                'success',
                '실시간 연결 성공',
                '문의 실시간 업데이트가 활성화되었습니다.'
              )
            }
          } else if (status === 'CHANNEL_ERROR') {
            setConnectionStatus('disconnected')
            setError('Failed to connect to realtime updates')
            
            showNotificationThrottled(
              'error',
              '실시간 연결 실패',
              '실시간 업데이트 연결에 실패했습니다. 5초 후 재시도합니다.'
            )
            
            // Retry after 5 seconds
            retryTimeoutId = setTimeout(() => {
              console.log('Retrying realtime connection...')
              setupSubscription()
            }, 5000)
          } else if (status === 'TIMED_OUT') {
            setConnectionStatus('disconnected')
            setError('Connection timeout')
            
            showNotificationThrottled(
              'warning',
              '연결 시간 초과',
              '연결이 시간 초과되었습니다. 3초 후 재시도합니다.'
            )
            
            // Retry after 3 seconds
            retryTimeoutId = setTimeout(() => {
              console.log('Retrying after timeout...')
              setupSubscription()
            }, 3000)
          } else if (status === 'CLOSED') {
            setConnectionStatus('disconnected')
            
            showNotificationThrottled(
              'info',
              '연결이 종료되었습니다',
              '2초 후 자동으로 재연결을 시도합니다.'
            )
            
            // Retry after 2 seconds
            retryTimeoutId = setTimeout(() => {
              console.log('Reconnecting after channel closed...')
              setupSubscription()
            }, 2000)
          }
        })
    }

    setupSubscription()

    return () => {
      // Cleanup
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
      
      if (retryTimeoutId) {
        clearTimeout(retryTimeoutId)
      }
      
      if (channel) {
        supabase.removeChannel(channel)
      }
      
      // Clear pending updates
      pendingUpdates.current = []
    }
  }, [fetchInquiries, handleInsert, handleUpdate, handleDelete, showNotificationThrottled])

  return { 
    inquiries, 
    loading, 
    error, 
    refetch: fetchInquiries,
    connectionStatus 
  }
} 