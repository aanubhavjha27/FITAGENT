import { useEffect, useRef, useCallback } from 'react'
import useChatStore from '../store/chatStore'
import useAuthStore from '../store/authStore'

const WS_URL = 'ws://127.0.0.1:8000/api/v1/chat/ws'

export default function useWebSocket() {
  const wsRef = useRef(null)
  const { token } = useAuthStore()
  const {
    addMessage,
    setTyping,
    setConnected,
    isOpen
  } = useChatStore()

  const connect = useCallback(() => {
    if (!token) return
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    const ws = new WebSocket(`${WS_URL}/${token}`)

    ws.onopen = () => {
      setConnected(true)
      console.log('WebSocket connected')
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === 'typing') {
        setTyping(true)
        return
      }

      if (data.type === 'message') {
        setTyping(false)
        addMessage({
          id: Date.now(),
          role: 'assistant',
          content: data.content,
          timestamp: new Date()
        })
      }

      if (data.type === 'error') {
        setTyping(false)
        addMessage({
          id: Date.now(),
          role: 'assistant',
          content: '⚠️ ' + data.content,
          timestamp: new Date()
        })
      }
    }

    ws.onclose = () => {
      setConnected(false)
      console.log('WebSocket disconnected')
      // Reconnect after 3 seconds
      setTimeout(() => {
        if (token) connect()
      }, 3000)
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setConnected(false)
    }

    wsRef.current = ws
  }, [token])

  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ message }))
      return true
    }
    return false
  }, [])

  const disconnect = useCallback(() => {
    wsRef.current?.close()
  }, [])

  useEffect(() => {
    if (isOpen && token) {
      connect()
    }
  }, [isOpen, token])

  useEffect(() => {
    return () => disconnect()
  }, [])

  return { sendMessage, connect, disconnect }
}