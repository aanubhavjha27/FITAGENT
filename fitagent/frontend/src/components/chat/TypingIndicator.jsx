export default function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '8px',
        background: '#1a2a1b', border: '1px solid rgba(163,230,53,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '13px', flexShrink: 0,
      }}>🤖</div>

      <div style={{
        background: '#1a2a1b', border: '1px solid rgba(163,230,53,0.08)',
        padding: '12px 16px', borderRadius: '16px 16px 16px 4px',
        display: 'flex', alignItems: 'center', gap: '5px',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: 'rgba(163,230,53,0.5)',
            animation: 'bounce 1.2s infinite',
            animationDelay: `${i * 0.2}s`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  )
}