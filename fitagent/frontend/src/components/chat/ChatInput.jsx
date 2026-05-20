import { useState } from 'react'

export default function ChatInput({ onSend, disabled }) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || disabled) return
    onSend(input.trim())
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const canSend = !!input.trim() && !disabled

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display:     'flex',
        gap:         '10px',
        padding:     '14px 16px',
        background:  '#162018',
        borderTop:   '1px solid rgba(163,230,53,0.1)',
        flexShrink:  0,
      }}
    >
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={disabled ? 'Connecting...' : 'Ask your AI coach...'}
        style={{
          flex:        1,
          background:  '#0f1a10',
          border:      '1px solid rgba(163,230,53,0.15)',
          borderRadius:'10px',
          padding:     '11px 16px',
          fontSize:    '14px',
          fontWeight:  300,
          color:       '#e8f0e9',
          outline:     'none',
          fontFamily:  "'DM Sans', sans-serif",
          transition:  'border-color 0.2s',
          opacity:     disabled ? 0.4 : 1,
        }}
        onFocus={e  => e.target.style.borderColor = 'rgba(163,230,53,0.4)'}
        onBlur={e   => e.target.style.borderColor = 'rgba(163,230,53,0.15)'}
      />
      <button
        type="submit"
        disabled={!canSend}
        style={{
          background:   canSend ? '#a3e635' : 'rgba(163,230,53,0.12)',
          color:        canSend ? '#080c0a' : '#2a3e2b',
          border:       'none',
          borderRadius: '10px',
          padding:      '11px 18px',
          fontSize:     '16px',
          fontWeight:   700,
          cursor:       canSend ? 'pointer' : 'not-allowed',
          transition:   'all 0.2s',
          flexShrink:   0,
          fontFamily:   "'DM Sans', sans-serif",
        }}
      >
        →
      </button>
    </form>
  )
}