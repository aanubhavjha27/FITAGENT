import { useEffect, useRef, useState } from 'react'
import useChatStore from '../../store/chatStore'
import useAuthStore from '../../store/authStore'
import useWebSocket from '../../hooks/useWebSocket'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import TypingIndicator from './TypingIndicator'

const SUGGESTIONS = [
  "What's my workout today?",
  "What should I eat for lunch?",
  "How many calories should I eat?",
  "Can I skip rest day?",
]

export default function ChatWindow() {
  const { messages, isOpen, isTyping, isConnected, setOpen, addMessage } = useChatStore()
  const { isLoggedIn } = useAuthStore()
  const { sendMessage } = useWebSocket()
  const messagesEndRef = useRef(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (text) => {
    addMessage({ id: Date.now(), role: 'user', content: text, timestamp: new Date() })
    sendMessage(text)
  }

  if (!isLoggedIn) return null

  if (!isOpen) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{ background: '#a3e635', color: '#080c0a' }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full
                   font-bold text-xl flex items-center justify-center
                   shadow-[0_8px_32px_rgba(163,230,53,0.4)]
                   hover:brightness-110 hover:-translate-y-0.5
                   transition-all duration-200 border-none cursor-pointer"
      >
        🤖
      </button>
    )
  }

  const width  = isExpanded ? '500px' : '380px'
  const height = isExpanded ? '700px' : '560px'

  return (
    <div
      style={{
        position:        'fixed',
        bottom:          '24px',
        right:           '24px',
        zIndex:          9999,
        width,
        height,
        display:         'flex',
        flexDirection:   'column',
        background:      '#0f1a10',   /* solid — no transparency */
        border:          '1px solid rgba(163,230,53,0.18)',
        borderRadius:    '16px',
        boxShadow:       '0 24px 64px rgba(0,0,0,0.8)',
        overflow:        'hidden',
        transition:      'width 0.3s, height 0.3s',
        fontFamily:      "'DM Sans', sans-serif",
      }}
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '12px 16px',
        background:     '#162018',
        borderBottom:   '1px solid rgba(163,230,53,0.1)',
        flexShrink:     0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'rgba(163,230,53,0.12)',
            border: '1px solid rgba(163,230,53,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', flexShrink: 0,
          }}>🤖</div>
          <div>
            <p style={{ color: '#e8f0e9', fontSize: '13px', fontWeight: 600, margin: 0, letterSpacing: '0.3px' }}>
              FitAgent AI
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: isConnected ? '#a3e635' : '#ef4444',
              }} />
              <span style={{ color: '#4a6b4e', fontSize: '11px' }}>
                {isConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => setIsExpanded(e => !e)} style={{
            width: '28px', height: '28px', borderRadius: '8px', border: 'none',
            background: 'transparent', color: '#4a6b4e', cursor: 'pointer',
            fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(163,230,53,0.1)'; e.currentTarget.style.color = '#a3e635' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4a6b4e' }}
          >
            {isExpanded ? '⊟' : '⊞'}
          </button>
          <button onClick={() => setOpen(false)} style={{
            width: '28px', height: '28px', borderRadius: '8px', border: 'none',
            background: 'transparent', color: '#4a6b4e', cursor: 'pointer',
            fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4a6b4e' }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Messages ─────────────────────────────────────────────── */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '16px', display: 'flex',
        flexDirection: 'column', gap: '12px',
      }}>
        {messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: '24px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', marginBottom: '16px',
            }}>💪</div>
            <p style={{ color: '#d4e8d5', fontSize: '14px', fontWeight: 600, margin: '0 0 4px' }}>
              Your AI Fitness Coach
            </p>
            <p style={{ color: '#4a6b4e', fontSize: '12px', fontWeight: 300, margin: '0 0 20px' }}>
              Ask me anything about your plan
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => handleSend(s)} style={{
                  fontSize: '11px', fontWeight: 500,
                  padding: '6px 12px', borderRadius: '100px',
                  background: 'rgba(163,230,53,0.06)',
                  border: '1px solid rgba(163,230,53,0.15)',
                  color: '#4a6b4e', cursor: 'pointer',
                  transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#a3e635'; e.currentTarget.style.borderColor = 'rgba(163,230,53,0.35)'; e.currentTarget.style.background = 'rgba(163,230,53,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#4a6b4e'; e.currentTarget.style.borderColor = 'rgba(163,230,53,0.15)'; e.currentTarget.style.background = 'rgba(163,230,53,0.06)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ────────────────────────────────────────────────── */}
      <ChatInput onSend={handleSend} disabled={!isConnected} />
    </div>
  )
}