import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'

// ─── Animated background particles ───────────────────────────────────────────
function Particles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      a: Math.random() * 0.5 + 0.1,
    }))
    let raf
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      dots.forEach(d => {
        d.x += d.dx; d.y += d.dy
        if (d.x < 0 || d.x > W) d.dx *= -1
        if (d.y < 0 || d.y > H) d.dy *= -1
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(163,230,53,${d.a})`
        ctx.fill()
      })
      dots.forEach((a, i) => {
        dots.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(163,230,53,${0.06 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    const onResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])
  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  )
}

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, delay }) {
  return (
    <div
      className="feature-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{desc}</p>
    </div>
  )
}

// ─── Step card ────────────────────────────────────────────────────────────────
function StepCard({ num, icon, title, desc, delay }) {
  return (
    <div className="step-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="step-num">{num}</div>
      <div className="step-icon">{icon}</div>
      <h3 className="step-title">{title}</h3>
      <p className="step-desc">{desc}</p>
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .hp-root {
          min-height: 100vh;
          background: #080c0a;
          color: #e8f0e9;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* ── Nav ─────────────────────────────── */
        .hp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 48px;
          background: rgba(8,12,10,0.7);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(163,230,53,0.08);
        }
        .hp-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 3px;
          color: #a3e635;
        }
        .hp-logo span { color: #e8f0e9; }
        .hp-nav-links { display: flex; gap: 12px; align-items: center; }
        .btn-ghost {
          background: transparent;
          border: 1px solid rgba(163,230,53,0.25);
          color: #b5c9b7;
          padding: 9px 22px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
          display: inline-flex; align-items: center;
        }
        .btn-ghost:hover {
          border-color: #a3e635;
          color: #a3e635;
          background: rgba(163,230,53,0.06);
        }
        .btn-primary {
          background: #a3e635;
          color: #080c0a;
          border: none;
          padding: 9px 22px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
          display: inline-flex; align-items: center;
        }
        .btn-primary:hover {
          background: #bef264;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(163,230,53,0.25);
        }

        /* ── Hero ────────────────────────────── */
        .hp-hero {
          position: relative; z-index: 1;
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          padding: 120px 24px 80px;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(163,230,53,0.08);
          border: 1px solid rgba(163,230,53,0.2);
          color: #a3e635;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 100px;
          margin-bottom: 32px;
          animation: fadeUp 0.6s ease both;
        }
        .hero-badge-dot {
          width: 6px; height: 6px;
          background: #a3e635;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
        .hero-h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(64px, 10vw, 128px);
          line-height: 0.92;
          letter-spacing: 2px;
          color: #e8f0e9;
          margin-bottom: 8px;
          animation: fadeUp 0.7s ease both 0.1s;
        }
        .hero-h1-accent { color: #a3e635; }
        .hero-sub {
          font-size: 18px;
          font-weight: 300;
          color: #7a9e7e;
          max-width: 540px;
          line-height: 1.7;
          margin: 24px auto 48px;
          animation: fadeUp 0.7s ease both 0.2s;
        }
        .hero-cta {
          display: flex; gap: 14px; justify-content: center;
          flex-wrap: wrap;
          animation: fadeUp 0.7s ease both 0.3s;
        }
        .btn-primary-lg {
          background: #a3e635;
          color: #080c0a;
          border: none;
          padding: 16px 36px;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.25s;
          display: inline-flex; align-items: center; gap: 8px;
          letter-spacing: 0.3px;
        }
        .btn-primary-lg:hover {
          background: #bef264;
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(163,230,53,0.3);
        }
        .btn-ghost-lg {
          background: transparent;
          border: 1px solid rgba(163,230,53,0.2);
          color: #b5c9b7;
          padding: 16px 36px;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.25s;
          display: inline-flex; align-items: center;
        }
        .btn-ghost-lg:hover {
          border-color: rgba(163,230,53,0.5);
          color: #a3e635;
          background: rgba(163,230,53,0.05);
        }
        .hero-stats {
          display: flex; gap: 48px; justify-content: center;
          margin-top: 72px;
          padding-top: 48px;
          border-top: 1px solid rgba(163,230,53,0.08);
          animation: fadeUp 0.7s ease both 0.4s;
        }
        .stat-item { text-align: center; }
        .stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 42px;
          color: #a3e635;
          letter-spacing: 1px;
        }
        .stat-label {
          font-size: 12px;
          font-weight: 500;
          color: #4a6b4e;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-top: 4px;
        }

        /* ── Section ─────────────────────────── */
        .hp-section {
          position: relative; z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 100px 24px;
        }
        .section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #a3e635;
          margin-bottom: 16px;
        }
        .section-h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(42px, 5vw, 64px);
          letter-spacing: 1px;
          color: #e8f0e9;
          margin-bottom: 64px;
        }

        /* ── Steps ───────────────────────────── */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2px;
        }
        .step-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(163,230,53,0.06);
          padding: 48px 36px;
          transition: all 0.3s;
          animation: fadeUp 0.6s ease both;
          position: relative;
          overflow: hidden;
        }
        .step-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(163,230,53,0.4), transparent);
          transform: scaleX(0);
          transition: transform 0.3s;
        }
        .step-card:hover::before { transform: scaleX(1); }
        .step-card:hover {
          background: rgba(163,230,53,0.04);
          border-color: rgba(163,230,53,0.15);
        }
        .step-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 72px;
          color: rgba(163,230,53,0.08);
          line-height: 1;
          margin-bottom: 16px;
          letter-spacing: 2px;
        }
        .step-icon { font-size: 32px; margin-bottom: 20px; }
        .step-title {
          font-size: 18px;
          font-weight: 600;
          color: #d4e8d5;
          margin-bottom: 12px;
        }
        .step-desc {
          font-size: 14px;
          font-weight: 300;
          color: #4a6b4e;
          line-height: 1.7;
        }

        /* ── Features ────────────────────────── */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }
        .feature-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(163,230,53,0.07);
          border-radius: 16px;
          padding: 32px 28px;
          transition: all 0.3s;
          animation: fadeUp 0.6s ease both;
          cursor: default;
        }
        .feature-card:hover {
          background: rgba(163,230,53,0.05);
          border-color: rgba(163,230,53,0.2);
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.3);
        }
        .feature-icon { font-size: 28px; margin-bottom: 20px; }
        .feature-title {
          font-size: 16px;
          font-weight: 600;
          color: #d4e8d5;
          margin-bottom: 10px;
        }
        .feature-desc {
          font-size: 13px;
          font-weight: 300;
          color: #4a6b4e;
          line-height: 1.7;
        }

        /* ── CTA Section ─────────────────────── */
        .hp-cta {
          position: relative; z-index: 1;
          margin: 0 24px 100px;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(163,230,53,0.12) 0%, rgba(163,230,53,0.04) 100%);
          border: 1px solid rgba(163,230,53,0.15);
          padding: 80px 48px;
          text-align: center;
          overflow: hidden;
        }
        .hp-cta::before {
          content: '';
          position: absolute;
          top: -50%; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse, rgba(163,230,53,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(42px, 6vw, 72px);
          letter-spacing: 1px;
          color: #e8f0e9;
          margin-bottom: 16px;
        }
        .cta-sub {
          font-size: 16px;
          font-weight: 300;
          color: #7a9e7e;
          margin-bottom: 40px;
        }

        /* ── Footer ──────────────────────────── */
        .hp-footer {
          position: relative; z-index: 1;
          border-top: 1px solid rgba(163,230,53,0.06);
          padding: 40px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .footer-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 3px;
          color: #a3e635;
        }
        .footer-logo span { color: #3a4e3b; }
        .footer-meta {
          font-size: 12px;
          color: #2a3e2b;
          letter-spacing: 0.5px;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* divider */
        .hp-divider {
          position: relative; z-index: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(163,230,53,0.1), transparent);
        }
      `}</style>

      <div className="hp-root">
        <Particles />

        {/* Nav */}
        <nav className="hp-nav">
          <div className="hp-logo">Fit<span>Agent</span></div>
          <div className="hp-nav-links">
            <Link to="/login" className="btn-ghost">Login</Link>
            <Link to="/signup" className="btn-primary">Get Started</Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="hp-hero">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            AI-Powered Fitness Coach
          </div>
          <h1 className="hero-h1">
            Train<br />
            <span className="hero-h1-accent">Smarter.</span>
          </h1>
          <p className="hero-sub">
            FitAgent creates hyper-personalized workout and diet plans using AI.
            Tracks progress, adapts to your behavior, replans when life happens.
          </p>
          <div className="hero-cta">
            <Link to="/signup" className="btn-primary-lg">
              Start for Free →
            </Link>
            <Link to="/login" className="btn-ghost-lg">
              I have an account
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-num">4.8K</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">98%</div>
              <div className="stat-label">Plan Accuracy</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">24/7</div>
              <div className="stat-label">AI Support</div>
            </div>
          </div>
        </section>

        <div className="hp-divider" />

        {/* How It Works */}
        <section className="hp-section">
          <div className="section-label">Process</div>
          <div className="section-h2">How It Works</div>
          <div className="steps-grid">
            <StepCard num="01" icon="📝" title="Tell Us About You"
              desc="Fill in your age, weight, goals, diet preference, and available equipment. Takes 2 minutes." delay={0} />
            <StepCard num="02" icon="🤖" title="AI Builds Your Plan"
              desc="Our AI agent researches and builds a personalized workout and meal plan tailored to your body." delay={100} />
            <StepCard num="03" icon="📊" title="Track & Adapt"
              desc="Log progress daily. The AI monitors patterns and automatically adjusts your plan every week." delay={200} />
          </div>
        </section>

        <div className="hp-divider" />

        {/* Features */}
        <section className="hp-section">
          <div className="section-label">Why FitAgent</div>
          <div className="section-h2">Built Different</div>
          <div className="features-grid">
            <FeatureCard icon="🧠" title="Truly Intelligent"
              desc="Not a generic generator. The AI validates goals, pushes back on unrealistic targets, and uses real nutrition data." delay={0} />
            <FeatureCard icon="🔄" title="Auto-Replanning"
              desc="Skip leg day 3 weeks in a row? AI notices, investigates why, and restructures your schedule accordingly." delay={80} />
            <FeatureCard icon="🍛" title="Indian Diet Focused"
              desc="Real Indian meals. Dal, roti, paneer, rice. Not generic western diet plans nobody actually follows." delay={160} />
            <FeatureCard icon="💬" title="Chat With Your Coach"
              desc="'Can I skip today?' 'I'm traveling next week.' Ask anything. The AI adapts in real-time." delay={240} />
          </div>
        </section>

        {/* CTA */}
        <div className="hp-cta">
          <h2 className="cta-h2">Ready to Transform?</h2>
          <p className="cta-sub">Join FitAgent today. Free to start, no credit card needed.</p>
          <Link to="/signup" className="btn-primary-lg">
            Create Free Account →
          </Link>
        </div>

        {/* Footer */}
        <footer className="hp-footer">
          <div className="footer-logo">Fit<span>Agent</span></div>
          <div className="footer-meta">
            Built with React · FastAPI · LangGraph · ♥
          </div>
        </footer>
      </div>
    </>
  )
}