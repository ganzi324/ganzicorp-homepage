import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Inquiry } from '@/lib/supabase'
import { useNotifications } from '@/hooks/useNotifications'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface UseRealtimeInquiriesOptions {
  enabled?: boolean
}

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

export function useRealtimeInquiries(options: UseRealtimeInquiriesOptions = {}): UseRealtimeInquiriesResult {
  const { enabled = true } = options
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting')
  const { addNotification } = useNotifications()
  
  // Performance optimization: Batch updates
  const pendingUpdates = useRef<PendingUpdate[]>([])
  const updateTimeoutRef = useRef<NodeJS.Timeout>()
  const lastNotificationRef = useRef<number>(0)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout>()
  const isSubscribingRef = useRef(false)
  const connectionNotificationShownRef = useRef(false)

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
    const THROTTLE_DELAY = 3000 // 3 second throttle (increased)
    
    if (now - lastNotificationRef.current < THROTTLE_DELAY) {
      return // Skip notification if too frequent
    }
    
    lastNotificationRef.current = now
    addNotification({ type, title, message, autoClose })
  }, [addNotification])

  const fetchInquiries = useCallback(async () => {
    if (!enabled) {
      setLoading(false)
      return
    }

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
  }, [enabled])

  // Cleanup function
  const cleanupChannel = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = undefined
    }
    
    if (channelRef.current) {
      try {
        supabase.removeChannel(channelRef.current)
      } catch (error) {
        console.warn('Error removing channel:', error)
      }
      channelRef.current = null
    }
    
    isSubscribingRef.current = false
  }, [])

  useEffect(() => {
    // enabled가 false이면 subscription을 설정하지 않음
    if (!enabled) {
      setLoading(false)
      setConnectionStatus('disconnected')
      cleanupChannel()
      return
    }

    // Optimized event handlers with batching
    const handleInsert = (payload: Record<string, any>) => {
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
    }

    const handleUpdate = (payload: Record<string, any>) => {
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
    }

    const handleDelete = (payload: Record<string, any>) => {
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
    }

    const setupSubscription = async () => {
      // 이미 구독 중이면 중단
      if (isSubscribingRef.current) {
        console.log('Already subscribing, skipping...')
        return
      }

      // 기존 채널 정리
      cleanupChannel()
      
      setConnectionStatus('connecting')
      isSubscribingRef.current = true
      
      try {
        // Initial fetch
        await fetchInquiries()

        // 새로운 채널 생성 (고유한 이름 사용)
        const channelName = `inquiries_realtime_${Date.now()}`
        channelRef.current = supabase
          .channel(channelName, {
            config: {
              broadcast: { self: false },
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

        // 구독 시작
        channelRef.current.subscribe((status, err) => {
          console.log('Realtime subscription status:', status, err)
          
          if (status === 'SUBSCRIBED') {
            setConnectionStatus('connected')
            isSubscribingRef.current = false
            console.log('Successfully subscribed to inquiries realtime updates')
            
            // Show connection success notification (only once)
            if (!connectionNotificationShownRef.current) {
              connectionNotificationShownRef.current = true
              showNotificationThrottled(
                'success',
                '실시간 연결 성공',
                '문의 실시간 업데이트가 활성화되었습니다.'
              )
            }
          } else if (status === 'CHANNEL_ERROR') {
            setConnectionStatus('disconnected')
            setError('Failed to connect to realtime updates')
            isSubscribingRef.current = false
            
            showNotificationThrottled(
              'error',
              '실시간 연결 실패',
              '실시간 업데이트 연결에 실패했습니다. 10초 후 재시도합니다.'
            )
            
            // Retry after 10 seconds
            retryTimeoutRef.current = setTimeout(() => {
              console.log('Retrying realtime connection after error...')
              setupSubscription()
            }, 10000)
          } else if (status === 'TIMED_OUT') {
            setConnectionStatus('disconnected')
            setError('Connection timeout')
            isSubscribingRef.current = false
            
            showNotificationThrottled(
              'warning',
              '연결 시간 초과',
              '연결이 시간 초과되었습니다. 15초 후 재시도합니다.'
            )
            
            // Retry after 15 seconds
            retryTimeoutRef.current = setTimeout(() => {
              console.log('Retrying after timeout...')
              setupSubscription()
            }, 15000)
          } else if (status === 'CLOSED') {
            setConnectionStatus('disconnected')
            isSubscribingRef.current = false
            
            // 연결이 정상적으로 닫힌 경우에만 알림 표시
            if (enabled) {
              showNotificationThrottled(
                'info',
                '연결이 종료되었습니다',
                '20초 후 자동으로 재연결을 시도합니다.'
              )
              
              // Retry after 20 seconds
              retryTimeoutRef.current = setTimeout(() => {
                console.log('Reconnecting after channel closed...')
                setupSubscription()
              }, 20000)
            }
          }
        })
      } catch (error) {
        console.error('Error setting up subscription:', error)
        setConnectionStatus('disconnected')
        setError('Failed to setup subscription')
        isSubscribingRef.current = false
      }
    }

    setupSubscription()

    return () => {
      // Cleanup
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
      
      cleanupChannel()
      
      // Clear pending updates
      pendingUpdates.current = []
    }
  }, [enabled, processBatchUpdates, showNotificationThrottled, fetchInquiries, cleanupChannel])

  return { 
    inquiries, 
    loading, 
    error, 
    refetch: fetchInquiries,
    connectionStatus 
  }
} 