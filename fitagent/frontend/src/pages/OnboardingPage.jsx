import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProfile } from '../services/api'

const STEPS = ['Basic Info', 'Your Goal', 'Diet', 'Schedule']

const INITIAL_FORM = {
  age: '', gender: '', height_cm: '', current_weight_kg: '',
  goal_weight_kg: '', goal_type: '', activity_level: '',
  workout_days_per_week: 4, dietary_preference: '',
  dietary_restrictions: [], available_equipment: '',
  busy_days: [], health_conditions: [],
}

function OptionBtn({ active, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`opt-btn ${active ? 'opt-btn-active' : ''} ${className}`}
    >
      {children}
    </button>
  )
}

function Tag({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick} className={`tag ${active ? 'tag-active' : ''}`}>
      {children}
    </button>
  )
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(INITIAL_FORM)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [dir, setDir] = useState(1)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleMulti = (field, val) => {
    const cur = form[field]
    setForm({ ...form, [field]: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] })
  }

  const validate = () => {
    if (step === 0 && (!form.age || !form.gender || !form.height_cm || !form.current_weight_kg || !form.goal_weight_kg))
      return setError('Please fill all fields'), false
    if (step === 1 && (!form.goal_type || !form.activity_level))
      return setError('Please fill all fields'), false
    if (step === 2 && !form.dietary_preference)
      return setError('Please select dietary preference'), false
    if (step === 3 && !form.available_equipment)
      return setError('Please select equipment'), false
    return true
  }

  const next = () => { setError(''); if (!validate()) return; setDir(1); setStep(s => s + 1) }
  const prev = () => { setError(''); setDir(-1); setStep(s => s - 1) }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true); setError('')
    try {
      await createProfile({
        ...form,
        age: parseInt(form.age),
        height_cm: parseFloat(form.height_cm),
        current_weight_kg: parseFloat(form.current_weight_kg),
        goal_weight_kg: parseFloat(form.goal_weight_kg),
        workout_days_per_week: parseInt(form.workout_days_per_week),
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const progress = ((step) / (STEPS.length - 1)) * 100

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ob-root {
          min-height: 100vh;
          background: #080c0a;
          font-family: 'DM Sans', sans-serif;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 40px 24px;
          color: #e8f0e9;
        }

        /* ── Header ── */
        .ob-brand {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px; letter-spacing: 4px; color: #a3e635;
          margin-bottom: 40px; text-align: center;
        }
        .ob-brand span { color: #2a3e2b; }

        /* ── Card ── */
        .ob-card {
          width: 100%; max-width: 560px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(163,230,53,0.1);
          border-radius: 24px;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }
        .ob-card-glow {
          position: absolute; top: 0; right: 0;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(163,230,53,0.04) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── Progress ── */
        .ob-steps {
          display: flex; gap: 8px; margin-bottom: 32px; align-items: center;
        }
        .ob-step-item {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;
        }
        .ob-step-num {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; transition: all 0.3s;
        }
        .ob-step-num.done { background: #a3e635; color: #080c0a; }
        .ob-step-num.active { background: rgba(163,230,53,0.15); border: 1px solid #a3e635; color: #a3e635; }
        .ob-step-num.pending { background: rgba(255,255,255,0.04); border: 1px solid rgba(163,230,53,0.08); color: #2a3e2b; }
        .ob-step-name { font-size: 10px; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase; }
        .ob-step-name.done { color: #a3e635; }
        .ob-step-name.active { color: #7ab93e; }
        .ob-step-name.pending { color: #2a3e2b; }
        .ob-step-connector { flex: 0 0 24px; height: 1px; background: rgba(163,230,53,0.1); margin-bottom: 18px; }
        .ob-step-connector.done { background: rgba(163,230,53,0.4); }

        .ob-progress-bar {
          height: 2px; background: rgba(163,230,53,0.08);
          border-radius: 2px; margin-bottom: 40px; overflow: hidden;
        }
        .ob-progress-fill {
          height: 100%; background: #a3e635;
          border-radius: 2px; transition: width 0.4s ease;
        }

        /* ── Form Title ── */
        .ob-step-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 40px; letter-spacing: 1px; color: #e8f0e9;
          margin-bottom: 6px;
        }
        .ob-step-sub { font-size: 13px; font-weight: 300; color: #4a6b4e; margin-bottom: 36px; }

        /* ── Error ── */
        .ob-error {
          background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #f87171;
          margin-bottom: 20px; display: flex; align-items: center; gap: 8px;
        }

        /* ── Fields ── */
        .ob-field { margin-bottom: 20px; }
        .ob-label {
          font-size: 11px; font-weight: 600; letter-spacing: 2px;
          text-transform: uppercase; color: #5a7e5e; display: block; margin-bottom: 8px;
        }
        .ob-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(163,230,53,0.1);
          border-radius: 10px; padding: 13px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; color: #e8f0e9; outline: none; transition: all 0.2s;
        }
        .ob-input::placeholder { color: #2a3e2b; }
        .ob-input:focus {
          border-color: rgba(163,230,53,0.4);
          background: rgba(163,230,53,0.03);
          box-shadow: 0 0 0 3px rgba(163,230,53,0.05);
        }
        .ob-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        /* ── Opt buttons ── */
        .opt-btn {
          width: 100%; padding: 14px 16px; border-radius: 10px;
          border: 1px solid rgba(163,230,53,0.1);
          background: rgba(255,255,255,0.02);
          color: #7a9e7e; font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500; cursor: pointer;
          transition: all 0.2s; text-align: left;
        }
        .opt-btn:hover { border-color: rgba(163,230,53,0.25); color: #a3e635; background: rgba(163,230,53,0.04); }
        .opt-btn-active { background: rgba(163,230,53,0.1) !important; border-color: #a3e635 !important; color: #a3e635 !important; }
        .opt-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .opt-grid-1 { display: grid; grid-template-columns: 1fr; gap: 10px; }

        /* ── Tags ── */
        .tags-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
        .tag {
          padding: 7px 14px; border-radius: 100px;
          border: 1px solid rgba(163,230,53,0.1);
          background: rgba(255,255,255,0.02);
          color: #4a6b4e; font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500; cursor: pointer;
          transition: all 0.2s;
        }
        .tag:hover { border-color: rgba(163,230,53,0.25); color: #7a9e7e; }
        .tag-active { background: rgba(163,230,53,0.1) !important; border-color: #a3e635 !important; color: #a3e635 !important; }

        /* ── Slider ── */
        .ob-slider { width: 100%; margin: 8px 0; accent-color: #a3e635; }
        .ob-slider-labels {
          display: flex; justify-content: space-between;
          font-size: 11px; color: #2a3e2b; margin-top: 4px;
        }
        .ob-slider-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px; color: #a3e635; letter-spacing: 1px;
          margin-bottom: 4px;
        }

        /* ── Opt with desc ── */
        .opt-desc { font-size: 11px; color: #4a6b4e; margin-top: 3px; font-weight: 400; }
        .opt-btn-active .opt-desc { color: #7ab93e !important; }

        /* ── Nav buttons ── */
        .ob-nav { display: flex; gap: 12px; margin-top: 40px; }
        .btn-back {
          flex: 0 0 auto; padding: 14px 24px; border-radius: 10px;
          border: 1px solid rgba(163,230,53,0.1);
          background: transparent; color: #5a7e5e;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-back:hover { border-color: rgba(163,230,53,0.3); color: #a3e635; }
        .btn-next {
          flex: 1; padding: 14px; border-radius: 10px;
          background: #a3e635; color: #080c0a; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-next:hover:not(:disabled) {
          background: #bef264; transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(163,230,53,0.25);
        }
        .btn-next:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-loading {
          width: 16px; height: 16px; border: 2px solid rgba(8,12,10,0.3);
          border-top-color: #080c0a; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .step-content { animation: fadeIn 0.3s ease; }
      `}</style>

      <div className="ob-root">
        <div className="ob-brand">Fit<span>Agent</span></div>

        <div className="ob-card">
          <div className="ob-card-glow" />

          {/* Steps indicator */}
          <div className="ob-steps">
            {STEPS.map((s, i) => (
              <>
                <div key={s} className="ob-step-item">
                  <div className={`ob-step-num ${i < step ? 'done' : i === step ? 'active' : 'pending'}`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <div className={`ob-step-name ${i < step ? 'done' : i === step ? 'active' : 'pending'}`}>
                    {s}
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div key={`conn-${i}`} className={`ob-step-connector ${i < step ? 'done' : ''}`} />
                )}
              </>
            ))}
          </div>

          <div className="ob-progress-bar">
            <div className="ob-progress-fill" style={{ width: `${((step) / (STEPS.length - 1)) * 100}%` }} />
          </div>

          {error && <div className="ob-error"><span>⚠</span> {error}</div>}

          {/* ── Step 0: Basic Info ── */}
          {step === 0 && (
            <div className="step-content">
              <div className="ob-step-title">Basic Info</div>
              <p className="ob-step-sub">Tell us a bit about yourself to get started</p>

              <div className="ob-field">
                <label className="ob-label">Age</label>
                <input className="ob-input" type="number" name="age" value={form.age}
                  onChange={handleChange} placeholder="22" />
              </div>

              <div className="ob-field">
                <label className="ob-label">Gender</label>
                <div className="opt-grid-2" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                  {['male', 'female', 'other'].map(g => (
                    <OptionBtn key={g} active={form.gender === g} onClick={() => setForm({ ...form, gender: g })}>
                      {g === 'male' ? '♂ Male' : g === 'female' ? '♀ Female' : '⚧ Other'}
                    </OptionBtn>
                  ))}
                </div>
              </div>

              <div className="ob-field">
                <label className="ob-label">Height (cm)</label>
                <input className="ob-input" type="number" name="height_cm" value={form.height_cm}
                  onChange={handleChange} placeholder="175" />
              </div>

              <div className="ob-row">
                <div className="ob-field">
                  <label className="ob-label">Current Weight (kg)</label>
                  <input className="ob-input" type="number" name="current_weight_kg"
                    value={form.current_weight_kg} onChange={handleChange} placeholder="80" />
                </div>
                <div className="ob-field">
                  <label className="ob-label">Goal Weight (kg)</label>
                  <input className="ob-input" type="number" name="goal_weight_kg"
                    value={form.goal_weight_kg} onChange={handleChange} placeholder="70" />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 1: Goal ── */}
          {step === 1 && (
            <div className="step-content">
              <div className="ob-step-title">Your Goal</div>
              <p className="ob-step-sub">What are you training for?</p>

              <div className="ob-field">
                <label className="ob-label">Primary Goal</label>
                <div className="opt-grid-2">
                  {[
                    { value: 'lose_weight', label: '🔥 Lose Weight' },
                    { value: 'build_muscle', label: '💪 Build Muscle' },
                    { value: 'get_fit', label: '⚡ Get Fit' },
                    { value: 'maintain', label: '✅ Maintain' },
                  ].map(g => (
                    <OptionBtn key={g.value} active={form.goal_type === g.value}
                      onClick={() => setForm({ ...form, goal_type: g.value })}>
                      {g.label}
                    </OptionBtn>
                  ))}
                </div>
              </div>

              <div className="ob-field">
                <label className="ob-label">Activity Level</label>
                <div className="opt-grid-1">
                  {[
                    { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
                    { value: 'light', label: 'Light', desc: '1–3 days/week' },
                    { value: 'moderate', label: 'Moderate', desc: '3–5 days/week' },
                    { value: 'very_active', label: 'Very Active', desc: '6–7 days/week' },
                  ].map(a => (
                    <OptionBtn key={a.value} active={form.activity_level === a.value}
                      onClick={() => setForm({ ...form, activity_level: a.value })}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{a.label}</span>
                        <span className="opt-desc">{a.desc}</span>
                      </div>
                    </OptionBtn>
                  ))}
                </div>
              </div>

              <div className="ob-field">
                <label className="ob-label">Workout Days / Week</label>
                <div className="ob-slider-val">{form.workout_days_per_week}</div>
                <input type="range" className="ob-slider" name="workout_days_per_week"
                  min="2" max="6" step="1" value={form.workout_days_per_week} onChange={handleChange} />
                <div className="ob-slider-labels"><span>2 days</span><span>6 days</span></div>
              </div>
            </div>
          )}

          {/* ── Step 2: Diet ── */}
          {step === 2 && (
            <div className="step-content">
              <div className="ob-step-title">Diet</div>
              <p className="ob-step-sub">Help us build the right meal plan for you</p>

              <div className="ob-field">
                <label className="ob-label">Dietary Preference</label>
                <div className="opt-grid-2">
                  {[
                    { value: 'vegetarian', label: '🥗 Vegetarian' },
                    { value: 'vegan', label: '🌱 Vegan' },
                    { value: 'non_veg', label: '🍗 Non-Veg' },
                    { value: 'keto', label: '🥑 Keto' },
                  ].map(d => (
                    <OptionBtn key={d.value} active={form.dietary_preference === d.value}
                      onClick={() => setForm({ ...form, dietary_preference: d.value })}>
                      {d.label}
                    </OptionBtn>
                  ))}
                </div>
              </div>

              <div className="ob-field">
                <label className="ob-label">Dietary Restrictions (optional)</label>
                <div className="tags-wrap">
                  {['gluten-free', 'dairy-free', 'nut-allergy', 'soy-free', 'egg-free', 'no-restrictions'].map(r => (
                    <Tag key={r} active={form.dietary_restrictions.includes(r)}
                      onClick={() => handleMulti('dietary_restrictions', r)}>
                      {r}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Schedule ── */}
          {step === 3 && (
            <div className="step-content">
              <div className="ob-step-title">Schedule</div>
              <p className="ob-step-sub">Tell us about your setup and availability</p>

              <div className="ob-field">
                <label className="ob-label">Available Equipment</label>
                <div className="opt-grid-1">
                  {[
                    { value: 'gym', label: '🏋️ Full Gym', desc: 'All equipment available' },
                    { value: 'home', label: '🏠 Home Setup', desc: 'Dumbbells, resistance bands' },
                    { value: 'none', label: '🤸 No Equipment', desc: 'Bodyweight only' },
                  ].map(e => (
                    <OptionBtn key={e.value} active={form.available_equipment === e.value}
                      onClick={() => setForm({ ...form, available_equipment: e.value })}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{e.label}</span>
                        <span className="opt-desc">{e.desc}</span>
                      </div>
                    </OptionBtn>
                  ))}
                </div>
              </div>

              <div className="ob-field">
                <label className="ob-label">Busy Days (can't workout)</label>
                <div className="tags-wrap">
                  {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(d => (
                    <Tag key={d} active={form.busy_days.includes(d)}
                      onClick={() => handleMulti('busy_days', d)}>
                      {d.toUpperCase()}
                    </Tag>
                  ))}
                </div>
              </div>

              <div className="ob-field">
                <label className="ob-label">Health Conditions (optional)</label>
                <div className="tags-wrap">
                  {['bad-knees', 'lower-back-pain', 'shoulder-injury', 'heart-condition', 'none'].map(c => (
                    <Tag key={c} active={form.health_conditions.includes(c)}
                      onClick={() => handleMulti('health_conditions', c)}>
                      {c}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="ob-nav">
            {step > 0 && (
              <button className="btn-back" onClick={prev}>← Back</button>
            )}
            {step < STEPS.length - 1 ? (
              <button className="btn-next" onClick={next}>Continue →</button>
            ) : (
              <button className="btn-next" onClick={handleSubmit} disabled={loading}>
                {loading ? (<><span className="btn-loading" />Building your plan...</>) : '🚀 Generate My Plan'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}