import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe, getMyPlan, generatePlan } from '../services/api'
import useAuthStore from '../store/authStore'

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ value, unit = '' }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const end = parseInt(value) || 0
    if (end === 0) return
    const step = Math.ceil(end / 30)
    const t = setInterval(() => {
      start += step
      if (start >= end) { setDisplay(end); clearInterval(t) }
      else setDisplay(start)
    }, 30)
    return () => clearInterval(t)
  }, [value])
  return <>{display}{unit}</>
}

// ── Task checkbox ─────────────────────────────────────────────────────────────
function TaskItem({ label, checked, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        width: '100%', padding: '14px 18px',
        background: checked ? 'rgba(163,230,53,0.06)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${checked ? 'rgba(163,230,53,0.25)' : 'rgba(163,230,53,0.08)'}`,
        borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s',
        textAlign: 'left',
      }}
    >
      <div style={{
        width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
        background: checked ? '#a3e635' : 'transparent',
        border: `2px solid ${checked ? '#a3e635' : 'rgba(163,230,53,0.2)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s', fontSize: '13px', color: '#080c0a',
      }}>
        {checked ? '✓' : ''}
      </div>
      <span style={{
        fontSize: '14px', fontWeight: '400',
        color: checked ? '#a3e635' : '#7a9e7e',
        textDecoration: checked ? 'line-through' : 'none',
        transition: 'all 0.2s', letterSpacing: '0.2px',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {label}
      </span>
    </button>
  )
}

// ── Score modal ───────────────────────────────────────────────────────────────
function ScoreModal({ score, total, onClose }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0
  const isGreat = pct >= 75
  const messages = {
    100: { title: "PERFECT DAY! 🏆", body: "You crushed every single task. This is what champions look like. Keep this energy tomorrow — you're unstoppable." },
    75: { title: "GREAT WORK! 💪", body: "Strong performance today. Missing just a couple tasks — you're so close to perfection. Tomorrow, let's lock in those last ones." },
    50: { title: "KEEP PUSHING! ⚡", body: "You showed up and that counts. Half the battle is consistency. Tomorrow is a fresh start — small wins add up to big results." },
    0: { title: "DON'T GIVE UP! 🔥", body: "Today was tough, but you're still here. Every elite athlete has off days. What matters is showing up tomorrow. You've got this." },
  }
  const msg = pct === 100 ? messages[100] : pct >= 75 ? messages[75] : pct >= 50 ? messages[50] : messages[0]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(8,12,10,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        background: '#0d1610', border: '1px solid rgba(163,230,53,0.2)',
        borderRadius: '24px', padding: '56px 48px', maxWidth: '440px', width: '100%',
        textAlign: 'center', animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <style>{`@keyframes popIn { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }`}</style>

        {/* Ring */}
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 32px' }}>
          <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(163,230,53,0.08)" strokeWidth="8" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#a3e635" strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - pct / 100)}`}
              strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', color: '#a3e635', letterSpacing: '1px' }}>
              {score}/{total}
            </span>
          </div>
        </div>

        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', color: '#e8f0e9', letterSpacing: '1px', marginBottom: '16px' }}>
          {msg.title}
        </div>
        <p style={{ fontSize: '14px', fontWeight: '300', color: '#5a7e5e', lineHeight: '1.7', marginBottom: '36px' }}>
          {msg.body}
        </p>
        <button
          onClick={onClose}
          style={{
            background: '#a3e635', color: '#080c0a', border: 'none',
            padding: '14px 36px', borderRadius: '10px',
            fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '700',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, setUser, logout } = useAuthStore()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [tasks, setTasks] = useState([])
  const [checked, setChecked] = useState({})
  const [showScore, setShowScore] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        const userData = await getMe(); setUser(userData)
      } catch {
        logout(); navigate('/login'); return
      }
      try {
        const planData = await getMyPlan(); setPlan(planData.plan)
      } catch {
        setPlan(null)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const todayPlan = plan?.weekly_schedule?.[today]

  // Build tasks from today's plan
  useEffect(() => {
    if (!plan) return
    const t = []
    if (todayPlan?.type === 'workout') {
      t.push(`Complete ${todayPlan.name || 'workout'} (${todayPlan.duration_minutes || '?'} min)`)
      todayPlan.exercises?.slice(0, 3).forEach(ex => t.push(`${ex.name} — ${ex.sets} sets × ${ex.reps}`))
    }
    const meals = plan.meal_plan
    if (meals) {
      Object.entries(meals).forEach(([meal, items]) => {
        if (items?.length > 0) t.push(`Have your ${meal}`)
      })
    }
    if (plan.tips?.[0]) t.push(plan.tips[0])
    setTasks(t.slice(0, 6))
  }, [plan, today])

  const toggleTask = (i) => setChecked(c => ({ ...c, [i]: !c[i] }))
  const doneCount = tasks.filter((_, i) => checked[i]).length

  const handleGeneratePlan = async () => {
    setGenerating(true)
    try {
      const data = await generatePlan(); setPlan(data.plan)
    } catch {
      alert('Failed to generate plan. Try again.')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#080c0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px', border: '3px solid rgba(163,230,53,0.1)',
            borderTopColor: '#a3e635', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#3a5e3e', fontSize: '14px' }}>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .db-root {
          min-height: 100vh; background: #080c0a;
          font-family: 'DM Sans', sans-serif; color: #e8f0e9;
          padding-bottom: 80px;
        }
        .db-topbar {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 32px;
          background: rgba(8,12,10,0.85); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(163,230,53,0.06);
        }
        .db-brand {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px; letter-spacing: 3px; color: #a3e635;
        }
        .db-brand span { color: #2a3e2b; }
        .db-topbar-right { display: flex; align-items: center; gap: 12px; }
        .db-user-pill {
          display: flex; align-items: center; gap: 8px;
          background: rgba(163,230,53,0.06); border: 1px solid rgba(163,230,53,0.1);
          border-radius: 100px; padding: 6px 14px 6px 6px;
        }
        .db-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: #a3e635; color: #080c0a;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; letter-spacing: 0.5px;
        }
        .db-username { font-size: 13px; color: #5a7e5e; font-weight: 500; }
        .btn-logout {
          background: transparent; border: 1px solid rgba(163,230,53,0.1);
          color: #3a5e3e; padding: 6px 14px; border-radius: 8px;
          font-size: 12px; font-weight: 500; cursor: pointer;
          transition: all 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .btn-logout:hover { border-color: rgba(239,68,68,0.3); color: #f87171; }

        .db-body { max-width: 960px; margin: 0 auto; padding: 40px 24px; }

        /* ── Welcome ── */
        .db-welcome { margin-bottom: 40px; animation: fadeUp 0.5s ease both; }
        .db-welcome-greeting {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 48px; letter-spacing: 1px; color: #e8f0e9; line-height: 1;
        }
        .db-welcome-greeting span { color: #a3e635; }
        .db-welcome-date { font-size: 13px; color: #3a5e3e; margin-top: 6px; font-weight: 300; }

        /* ── No plan ── */
        .db-empty {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(163,230,53,0.08);
          border-radius: 24px; padding: 72px 48px; text-align: center;
          animation: fadeUp 0.5s ease both;
        }
        .db-empty-icon { font-size: 56px; margin-bottom: 24px; }
        .db-empty-title {
          font-family: 'Bebas Neue', sans-serif; font-size: 42px;
          letter-spacing: 1px; color: #e8f0e9; margin-bottom: 12px;
        }
        .db-empty-sub { font-size: 15px; font-weight: 300; color: #4a6b4e; margin-bottom: 36px; }
        .btn-generate {
          background: #a3e635; color: #080c0a; border: none;
          padding: 16px 40px; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700;
          cursor: pointer; transition: all 0.25s;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-generate:hover:not(:disabled) {
          background: #bef264; transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(163,230,53,0.25);
        }
        .btn-generate:disabled { opacity: 0.5; cursor: not-allowed; }
        .gen-loading {
          width: 18px; height: 18px; border: 2px solid rgba(8,12,10,0.2);
          border-top-color: #080c0a; border-radius: 50%;
          animation: spin 0.7s linear infinite; flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

        /* ── Grid ── */
        .db-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .db-grid-full { grid-column: 1 / -1; }

        /* ── Cards ── */
        .db-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(163,230,53,0.07);
          border-radius: 20px; padding: 28px;
          animation: fadeUp 0.5s ease both; overflow: hidden;
        }
        .db-card-title {
          font-size: 11px; font-weight: 600; letter-spacing: 2.5px;
          text-transform: uppercase; color: #3a5e3e; margin-bottom: 20px;
        }

        /* ── Plan summary ── */
        .db-plan-banner {
          background: linear-gradient(135deg, rgba(163,230,53,0.12) 0%, rgba(163,230,53,0.04) 100%);
          border: 1px solid rgba(163,230,53,0.15);
          border-radius: 20px; padding: 32px;
          position: relative; overflow: hidden;
          animation: fadeUp 0.5s ease both;
        }
        .db-plan-banner-glow {
          position: absolute; top: -60px; right: -60px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(163,230,53,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .db-plan-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 1px; color: #e8f0e9; margin-bottom: 8px; }
        .db-plan-sub { font-size: 13px; font-weight: 300; color: #5a7e5e; margin-bottom: 24px; line-height: 1.5; }
        .db-macros { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .db-macro {
          background: rgba(8,12,10,0.5); border: 1px solid rgba(163,230,53,0.08);
          border-radius: 12px; padding: 16px; text-align: center;
        }
        .db-macro-val { font-family: 'Bebas Neue', sans-serif; font-size: 32px; color: #a3e635; letter-spacing: 1px; }
        .db-macro-unit { font-size: 13px; font-weight: 300; color: #3a5e3e; margin-top: 4px; }

        /* ── Today workout ── */
        .db-exercise-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px; border-radius: 10px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(163,230,53,0.05);
          margin-bottom: 8px; transition: all 0.2s;
        }
        .db-exercise-row:hover { border-color: rgba(163,230,53,0.12); background: rgba(163,230,53,0.03); }
        .db-exercise-name { font-size: 13px; font-weight: 500; color: #d4e8d5; }
        .db-exercise-sets { font-size: 12px; color: #3a5e3e; font-weight: 400; }

        /* ── Meal plan ── */
        .db-meal-section { margin-bottom: 20px; }
        .db-meal-label {
          font-size: 10px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: #3a5e3e; margin-bottom: 8px;
        }
        .db-meal-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 14px; border-radius: 8px;
          background: rgba(255,255,255,0.02); border: 1px solid rgba(163,230,53,0.05);
          margin-bottom: 6px;
        }
        .db-meal-name { font-size: 13px; color: #7a9e7e; font-weight: 400; }
        .db-meal-cal { font-size: 12px; color: #3a5e3e; }

        /* ── Checklist ── */
        .db-checklist-header {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;
        }
        .db-score-badge {
          display: flex; align-items: center; gap: 6px;
          background: rgba(163,230,53,0.08); border: 1px solid rgba(163,230,53,0.15);
          border-radius: 100px; padding: 4px 12px;
          font-family: 'Bebas Neue', sans-serif; font-size: 18px; color: #a3e635; letter-spacing: 1px;
        }
        .db-tasks { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .btn-score {
          width: 100%; background: transparent;
          border: 1px solid rgba(163,230,53,0.2); color: #a3e635;
          padding: 12px; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-score:hover { background: rgba(163,230,53,0.06); }

        /* ── Weekly grid ── */
        .db-week-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
        .db-day-cell {
          border-radius: 10px; padding: 10px 4px; text-align: center;
          background: rgba(255,255,255,0.02); border: 1px solid rgba(163,230,53,0.05);
          transition: all 0.2s;
        }
        .db-day-cell.today { background: rgba(163,230,53,0.1); border-color: rgba(163,230,53,0.3); }
        .db-day-label { font-size: 9px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #2a3e2b; }
        .db-day-cell.today .db-day-label { color: #7ab93e; }
        .db-day-emoji { font-size: 18px; margin: 6px 0; }
        .db-day-name { font-size: 9px; color: #2a3e2b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* ── Tips ── */
        .db-tip-item {
          display: flex; gap: 12px; align-items: flex-start;
          padding: 12px; border-radius: 10px;
          background: rgba(163,230,53,0.04); border: 1px solid rgba(163,230,53,0.08);
          margin-bottom: 8px;
        }
        .db-tip-dot { width: 6px; height: 6px; background: #a3e635; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
        .db-tip-text { font-size: 13px; font-weight: 300; color: #5a7e5e; line-height: 1.6; }

        @media (max-width: 640px) {
          .db-grid { grid-template-columns: 1fr; }
          .db-topbar { padding: 14px 16px; }
          .db-body { padding: 24px 16px; }
        }
      `}</style>

      <div className="db-root">
        {showScore && (
          <ScoreModal
            score={doneCount}
            total={tasks.length}
            onClose={() => setShowScore(false)}
          />
        )}

        {/* Top bar */}
        <div className="db-topbar">
          <div className="db-brand">Fit<span>Agent</span></div>
          <div className="db-topbar-right">
            {user && (
              <div className="db-user-pill">
                <div className="db-avatar">
                  {user.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <span className="db-username">{user.full_name?.split(' ')[0]}</span>
              </div>
            )}
            <button className="btn-logout" onClick={() => { logout(); navigate('/login') }}>
              Sign Out
            </button>
          </div>
        </div>

        <div className="db-body">

          {/* Welcome */}
          <div className="db-welcome">
            <div className="db-welcome-greeting">
              Hey, <span>{user?.full_name?.split(' ')[0]}</span> 👋
            </div>
            <div className="db-welcome-date">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* No plan */}
          {!plan && (
            <div className="db-empty">
              <div className="db-empty-icon">🤖</div>
              <div className="db-empty-title">No Plan Yet</div>
              <p className="db-empty-sub">Let our AI generate a personalized fitness plan for you</p>
              <button onClick={handleGeneratePlan} disabled={generating} className="btn-generate">
                {generating ? (<><span className="gen-loading" />Generating plan...</>) : '✨ Generate My Plan'}
              </button>
              {generating && (
                <p style={{ color: '#2a3e2b', fontSize: '12px', marginTop: '12px' }}>
                  This takes about 15–20 seconds...
                </p>
              )}
            </div>
          )}

          {/* Plan */}
          {plan && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Plan summary banner */}
              <div className="db-plan-banner">
                <div className="db-plan-banner-glow" />
                <div className="db-plan-title">Your Plan</div>
                <p className="db-plan-sub">{plan.summary}</p>
                <div className="db-macros">
                  <div className="db-macro">
                    <div className="db-macro-val"><Counter value={plan.daily_calories} /></div>
                    <div className="db-macro-unit">Calories / day</div>
                  </div>
                  <div className="db-macro">
                    <div className="db-macro-val"><Counter value={plan.daily_protein_g} unit="g" /></div>
                    <div className="db-macro-unit">Protein / day</div>
                  </div>
                  <div className="db-macro">
                    <div className="db-macro-val"><Counter value={plan.daily_carbs_g} unit="g" /></div>
                    <div className="db-macro-unit">Carbs / day</div>
                  </div>
                </div>
              </div>

              <div className="db-grid">

                {/* Today's workout */}
                {todayPlan && (
                  <div className="db-card" style={{ animationDelay: '0.1s' }}>
                    <div className="db-card-title">Today — {today.slice(0, 3).toUpperCase()}</div>
                    {todayPlan.type === 'workout' ? (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                          <div style={{
                            width: '48px', height: '48px', background: 'rgba(163,230,53,0.1)',
                            border: '1px solid rgba(163,230,53,0.2)', borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
                          }}>💪</div>
                          <div>
                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#d4e8d5' }}>{todayPlan.name}</div>
                            <div style={{ fontSize: '12px', color: '#3a5e3e', marginTop: '2px' }}>
                              {todayPlan.duration_minutes} min · {todayPlan.calories_burned} cal
                            </div>
                          </div>
                        </div>
                        {todayPlan.exercises?.map((ex, i) => (
                          <div key={i} className="db-exercise-row">
                            <span className="db-exercise-name">{ex.name}</span>
                            <span className="db-exercise-sets">{ex.sets} × {ex.reps}</span>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0' }}>
                        <span style={{ fontSize: '40px' }}>😴</span>
                        <div>
                          <div style={{ fontSize: '18px', fontWeight: '600', color: '#d4e8d5' }}>Rest Day</div>
                          <div style={{ fontSize: '13px', color: '#3a5e3e', marginTop: '4px' }}>{todayPlan.note}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Today's checklist */}
                {tasks.length > 0 && (
                  <div className="db-card" style={{ animationDelay: '0.15s' }}>
                    <div className="db-checklist-header">
                      <div className="db-card-title" style={{ marginBottom: 0 }}>Today's Tasks</div>
                      <div className="db-score-badge">
                        {doneCount}/{tasks.length}
                      </div>
                    </div>
                    <div className="db-tasks">
                      {tasks.map((t, i) => (
                        <TaskItem key={i} label={t} checked={!!checked[i]} onToggle={() => toggleTask(i)} />
                      ))}
                    </div>
                    <button className="btn-score" onClick={() => setShowScore(true)}>
                      ⚡ Score My Day
                    </button>
                  </div>
                )}

                {/* Meal plan */}
                {plan.meal_plan && (
                  <div className="db-card" style={{ animationDelay: '0.2s' }}>
                    <div className="db-card-title">Today's Meals 🍽️</div>
                    {Object.entries(plan.meal_plan).map(([meal, items]) => (
                      items?.length > 0 && (
                        <div key={meal} className="db-meal-section">
                          <div className="db-meal-label">{meal}</div>
                          {items.map((item, i) => (
                            <div key={i} className="db-meal-row">
                              <span className="db-meal-name">{item.name}</span>
                              <span className="db-meal-cal">{item.calories} cal</span>
                            </div>
                          ))}
                        </div>
                      )
                    ))}
                  </div>
                )}

                {/* Tips */}
                {plan.tips && (
                  <div className="db-card" style={{ animationDelay: '0.25s' }}>
                    <div className="db-card-title">💡 Coach Tips</div>
                    {plan.tips.map((tip, i) => (
                      <div key={i} className="db-tip-item">
                        <div className="db-tip-dot" />
                        <p className="db-tip-text">{tip}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Weekly schedule */}
                <div className="db-card db-grid-full" style={{ animationDelay: '0.3s' }}>
                  <div className="db-card-title">📅 Weekly Schedule</div>
                  <div className="db-week-grid">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
                      const dp = plan.weekly_schedule?.[day]
                      const isToday = day === today
                      return (
                        <div key={day} className={`db-day-cell ${isToday ? 'today' : ''}`}>
                          <div className="db-day-label">{day.slice(0, 3).toUpperCase()}</div>
                          <div className="db-day-emoji">{dp?.type === 'workout' ? '💪' : '😴'}</div>
                          <div className="db-day-name">{dp?.name?.split(' ')[0] || 'Rest'}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>

              {/* Regenerate */}
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <button
                  onClick={handleGeneratePlan}
                  disabled={generating}
                  style={{
                    background: 'none', border: 'none',
                    color: '#2a3e2b', fontSize: '12px', cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif", textDecoration: 'underline',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.target.style.color = '#a3e635'}
                  onMouseLeave={e => e.target.style.color = '#2a3e2b'}
                >
                  {generating ? 'Regenerating...' : 'Regenerate Plan'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}