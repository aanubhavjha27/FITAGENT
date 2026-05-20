export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  const time = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit', hour12: true,
      })
    : null

  return (
    <div style={{
      display:       'flex',
      gap:           '10px',
      alignItems:    'flex-end',
      flexDirection: isUser ? 'row-reverse' : 'row',
    }}>
      {/* Avatar */}
      <div style={{
        width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
        background: isUser ? 'rgba(163,230,53,0.12)' : '#1a2a1b',
        border: isUser ? '1px solid rgba(163,230,53,0.22)' : '1px solid rgba(163,230,53,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '13px',
      }}>
        {isUser ? '👤' : '🤖'}
      </div>

      {/* Bubble + time */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '4px',
        maxWidth: '75%', alignItems: isUser ? 'flex-end' : 'flex-start',
      }}>
        <div style={{
          padding:      '10px 14px',
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          fontSize:     '13px',
          lineHeight:   1.6,
          fontWeight:   isUser ? 500 : 300,
          background:   isUser ? '#a3e635' : '#1a2a1b',
          color:        isUser ? '#080c0a' : '#d4e8d5',
          border:       isUser ? 'none' : '1px solid rgba(163,230,53,0.08)',
          wordBreak:    'break-word',
          whiteSpace:   'pre-wrap',
          fontFamily:   "'DM Sans', sans-serif",
        }}>
          {message.content}
        </div>
        {time && (
          <span style={{ fontSize: '10px', color: '#2a3e2b', padding: '0 4px' }}>
            {time}
          </span>
        )}
      </div>
    </div>
  )
}