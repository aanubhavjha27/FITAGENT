import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/api'
import useAuthStore from '../store/authStore'

export default function SignupPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm_password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const getStrength = (pw) => {
    let s = 0
    if (pw.length >= 8) s++
    if (/[A-Z]/.test(pw)) s++
    if (/[0-9]/.test(pw)) s++
    if (/[^A-Za-z0-9]/.test(pw)) s++
    return s
  }

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['', '#ef4444', '#f59e0b', '#84cc16', '#a3e635']
  const strength = getStrength(form.password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm_password) return setError('Passwords do not match')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    try {
      const data = await registerUser({ full_name: form.full_name, email: form.email, password: form.password })
      login(data.access_token, null)
      navigate('/onboarding')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Try again.')
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
        .auth-left {
          display: flex; flex-direction: column;
          justify-content: center; align-items: flex-start;
          padding: 80px 72px;
          background: linear-gradient(135deg, #0d1610 0%, #080c0a 100%);
          border-right: 1px solid rgba(163,230,53,0.06);
          position: relative; overflow: hidden;
        }
        .auth-left-glow {
          position: absolute; top: -100px; right: -100px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(163,230,53,0.05) 0%, transparent 65%);
          pointer-events: none;
        }
        .auth-brand {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px; letter-spacing: 4px; color: #a3e635; margin-bottom: 64px;
        }
        .auth-brand span { color: #2a3e2b; }
        .auth-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 72px; line-height: 0.9; letter-spacing: 1px; color: #e8f0e9; margin-bottom: 24px;
        }
        .auth-headline-accent { color: #a3e635; }
        .auth-tagline { font-size: 15px; font-weight: 300; color: #4a6b4e; line-height: 1.7; max-width: 320px; }
        .auth-social-proof {
          margin-top: 64px;
          padding: 24px;
          background: rgba(163,230,53,0.04);
          border: 1px solid rgba(163,230,53,0.1);
          border-radius: 16px;
          max-width: 340px;
        }
        .asp-quote { font-size: 14px; font-weight: 300; color: #5a7e5e; line-height: 1.6; margin-bottom: 16px; font-style: italic; }
        .asp-author { font-size: 12px; font-weight: 600; color: #3a5e3e; letter-spacing: 1px; text-transform: uppercase; }
        .asp-rating { color: #a3e635; font-size: 14px; margin-top: 8px; letter-spacing: 2px; }

        .auth-right {
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 60px 72px;
        }
        .auth-form-wrap { width: 100%; max-width: 420px; animation: fadeUp 0.5s ease both; }
        .auth-form-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 48px; letter-spacing: 2px; color: #e8f0e9; margin-bottom: 8px;
        }
        .auth-form-sub { font-size: 14px; font-weight: 300; color: #4a6b4e; margin-bottom: 40px; }

        .field { margin-bottom: 20px; }
        .field-label {
          font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
          color: #5a7e5e; display: block; margin-bottom: 10px;
        }
        .field-wrap { position: relative; }
        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(163,230,53,0.1);
          border-radius: 10px;
          padding: 14px 48px 14px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; color: #e8f0e9; outline: none; transition: all 0.2s;
        }
        .field-input::placeholder { color: #2a3e2b; }
        .field-input:focus {
          border-color: rgba(163,230,53,0.4);
          background: rgba(163,230,53,0.03);
          box-shadow: 0 0 0 3px rgba(163,230,53,0.05);
        }
        .field-input.match { border-color: rgba(163,230,53,0.5); }
        .field-input.nomatch { border-color: rgba(239,68,68,0.5); }
        .field-toggle {
          position: absolute; right: 16px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; color: #2a3e2b;
          cursor: pointer; font-size: 18px; padding: 0; transition: color 0.2s; line-height: 1;
        }
        .field-toggle:hover { color: #a3e635; }

        .pw-strength { margin-top: 10px; }
        .pw-bars { display: flex; gap: 4px; margin-bottom: 6px; }
        .pw-bar {
          flex: 1; height: 3px; border-radius: 2px;
          background: rgba(255,255,255,0.05);
          transition: background 0.3s;
        }
        .pw-label { font-size: 11px; color: #3a5e3e; }

        .auth-error {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px; padding: 12px 16px;
          font-size: 13px; color: #f87171; margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }
        .btn-submit {
          width: 100%; background: #a3e635; color: #080c0a; border: none;
          padding: 16px; border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 700; letter-spacing: 0.5px;
          cursor: pointer; transition: all 0.2s; margin-top: 8px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-submit:hover:not(:disabled) {
          background: #bef264; transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(163,230,53,0.25);
        }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-loading {
          width: 16px; height: 16px; border: 2px solid rgba(8,12,10,0.3);
          border-top-color: #080c0a; border-radius: 50%;
          animation: spin 0.7s linear infinite; flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-switch { text-align: center; font-size: 13px; color: #3a4e3b; margin-top: 28px; }
        .auth-switch a { color: #a3e635; font-weight: 600; text-decoration: none; transition: color 0.2s; }
        .auth-switch a:hover { color: #bef264; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
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
            Start<br />
            <span className="auth-headline-accent">Today.</span>
          </h1>
          <p className="auth-tagline">
            Your AI fitness coach is ready. It just needs to meet you first.
          </p>
          <div className="auth-social-proof">
            <p className="asp-quote">
              "Lost 8kg in 3 months. The AI actually adjusts when I travel — no other app does that."
            </p>
            <div className="asp-author">Rahul M. · Mumbai</div>
            <div className="asp-rating">★★★★★</div>
          </div>
        </div>

        {/* Right */}
        <div className="auth-right">
          <div className="auth-form-wrap">
            <h2 className="auth-form-title">Create Account</h2>
            <p className="auth-form-sub">Start your AI fitness journey — it's free</p>

            {error && (
              <div className="auth-error"><span>⚠</span> {error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="field-label">Full Name</label>
                <div className="field-wrap">
                  <input className="field-input" type="text" name="full_name"
                    value={form.full_name} onChange={handleChange}
                    placeholder="John Doe" required />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Email</label>
                <div className="field-wrap">
                  <input className="field-input" type="email" name="email"
                    value={form.email} onChange={handleChange}
                    placeholder="you@example.com" required />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Password</label>
                <div className="field-wrap">
                  <input className="field-input" type={showPass ? 'text' : 'password'}
                    name="password" value={form.password} onChange={handleChange}
                    placeholder="••••••••" required />
                  <button type="button" className="field-toggle" onClick={() => setShowPass(p => !p)}>
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
                {form.password && (
                  <div className="pw-strength">
                    <div className="pw-bars">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="pw-bar"
                          style={{ background: i <= strength ? strengthColors[strength] : undefined }} />
                      ))}
                    </div>
                    <span className="pw-label" style={{ color: strengthColors[strength] }}>
                      {strengthLabels[strength]}
                    </span>
                  </div>
                )}
              </div>

              <div className="field">
                <label className="field-label">Confirm Password</label>
                <div className="field-wrap">
                  <input
                    className={`field-input ${form.confirm_password
                      ? form.password === form.confirm_password ? 'match' : 'nomatch'
                      : ''}`}
                    type="password" name="confirm_password"
                    value={form.confirm_password} onChange={handleChange}
                    placeholder="••••••••" required />
                </div>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (<><span className="btn-loading" />Creating account...</>) : 'Create Account →'}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}