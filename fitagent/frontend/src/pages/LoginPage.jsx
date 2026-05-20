import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser, getMyProfile } from '../services/api'
import useAuthStore from '../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await loginUser(form)
      login(data.access_token, null)
      try {
        await getMyProfile()
        navigate('/dashboard')
      } catch {
        navigate('/onboarding')
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #080c0a;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Left panel ── */
        .auth-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 80px 72px;
          background: linear-gradient(135deg, #0d1610 0%, #080c0a 100%);
          border-right: 1px solid rgba(163,230,53,0.06);
          position: relative;
          overflow: hidden;
        }
        .auth-left-glow {
          position: absolute;
          bottom: -100px; left: -100px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(163,230,53,0.07) 0%, transparent 65%);
          pointer-events: none;
        }
        .auth-brand {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px;
          letter-spacing: 4px;
          color: #a3e635;
          margin-bottom: 64px;
        }
        .auth-brand span { color: #2a3e2b; }
        .auth-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 72px;
          line-height: 0.9;
          letter-spacing: 1px;
          color: #e8f0e9;
          margin-bottom: 24px;
        }
        .auth-headline-accent { color: #a3e635; }
        .auth-tagline {
          font-size: 15px;
          font-weight: 300;
          color: #4a6b4e;
          line-height: 1.7;
          max-width: 320px;
        }
        .auth-left-pills {
          display: flex; flex-direction: column; gap: 12px;
          margin-top: 48px;
        }
        .auth-pill {
          display: flex; align-items: center; gap: 12px;
          font-size: 13px;
          color: #5a7e5e;
          font-weight: 400;
        }
        .auth-pill-dot {
          width: 6px; height: 6px;
          background: #a3e635;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* ── Right panel ── */
        .auth-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 80px 72px;
        }
        .auth-form-wrap {
          width: 100%;
          max-width: 400px;
          animation: fadeUp 0.5s ease both;
        }
        .auth-form-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 48px;
          letter-spacing: 2px;
          color: #e8f0e9;
          margin-bottom: 8px;
        }
        .auth-form-sub {
          font-size: 14px;
          font-weight: 300;
          color: #4a6b4e;
          margin-bottom: 48px;
        }

        /* Fields */
        .field { margin-bottom: 24px; }
        .field-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #5a7e5e;
          display: block;
          margin-bottom: 10px;
        }
        .field-wrap { position: relative; }
        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(163,230,53,0.1);
          border-radius: 10px;
          padding: 14px 48px 14px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: #e8f0e9;
          outline: none;
          transition: all 0.2s;
        }
        .field-input::placeholder { color: #2a3e2b; }
        .field-input:focus {
          border-color: rgba(163,230,53,0.4);
          background: rgba(163,230,53,0.03);
          box-shadow: 0 0 0 3px rgba(163,230,53,0.05);
        }
        .field-toggle {
          position: absolute;
          right: 16px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          color: #2a3e2b;
          cursor: pointer;
          font-size: 18px;
          padding: 0;
          transition: color 0.2s;
          line-height: 1;
        }
        .field-toggle:hover { color: #a3e635; }

        /* Error */
        .auth-error {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          color: #f87171;
          margin-bottom: 24px;
          display: flex; align-items: center; gap: 8px;
        }

        /* Submit */
        .btn-submit {
          width: 100%;
          background: #a3e635;
          color: #080c0a;
          border: none;
          padding: 16px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 8px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-submit:hover:not(:disabled) {
          background: #bef264;
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(163,230,53,0.25);
        }
        .btn-submit:disabled {
          opacity: 0.5; cursor: not-allowed;
        }
        .btn-loading {
          width: 16px; height: 16px;
          border: 2px solid rgba(8,12,10,0.3);
          border-top-color: #080c0a;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .auth-switch {
          text-align: center;
          font-size: 13px;
          color: #3a4e3b;
          margin-top: 32px;
        }
        .auth-switch a {
          color: #a3e635;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }
        .auth-switch a:hover { color: #bef264; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .auth-root { grid-template-columns: 1fr; }
          .auth-left { display: none; }
          .auth-right { padding: 48px 32px; }
        }
      `}</style>

      <div className="auth-root">
        {/* Left */}
        <div className="auth-left">
          <div className="auth-left-glow" />
          <div className="auth-brand">Fit<span>Agent</span></div>
          <h1 className="auth-headline">
            Your<br />
            <span className="auth-headline-accent">Coach.</span><br />
            Always On.
          </h1>
          <p className="auth-tagline">
            AI-powered fitness plans that adapt to you — every single day.
          </p>
          <div className="auth-left-pills">
            {['Personalized workout plans', 'Indian diet meal plans', 'AI that adapts weekly', 'Chat with your coach anytime'].map(t => (
              <div key={t} className="auth-pill">
                <div className="auth-pill-dot" />
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="auth-right">
          <div className="auth-form-wrap">
            <h2 className="auth-form-title">Welcome Back</h2>
            <p className="auth-form-sub">Sign in to continue your journey</p>

            {error && (
              <div className="auth-error">
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="field-label">Email</label>
                <div className="field-wrap">
                  <input
                    className="field-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Password</label>
                <div className="field-wrap">
                  <input
                    className="field-input"
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="field-toggle"
                    onClick={() => setShowPass(p => !p)}
                  >
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="btn-loading" />
                    Signing in...
                  </>
                ) : 'Sign In →'}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account?{' '}
              <Link to="/signup">Create one free</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}