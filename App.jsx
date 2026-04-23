import { useState, useEffect, useMemo } from 'react'

// AMAI heart-circuit logomark
const AmaiMark = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M32 52 L12 32 C6 26 6 16 14 14 C22 12 28 18 32 24 C36 18 42 12 50 14 C58 16 58 26 52 32 Z"
      fill="currentColor"
      opacity="0.95"
    />
    {/* inner circuit lines */}
    <path d="M20 28 L26 28 L28 31 L36 31 L38 28 L44 28" stroke="#0a0612" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <circle cx="32" cy="31" r="2.5" fill="#0a0612"/>
    <circle cx="20" cy="28" r="1.5" fill="#0a0612"/>
    <circle cx="44" cy="28" r="1.5" fill="#0a0612"/>
  </svg>
)

// Icons
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const EyeIcon = ({ off }) => off ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export default function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [time, setTime] = useState('')

  // Live clock for the HUD
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const h = String(d.getHours()).padStart(2, '0')
      const m = String(d.getMinutes()).padStart(2, '0')
      const s = String(d.getSeconds()).padStart(2, '0')
      setTime(`${h}:${m}:${s}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Generate a set of drifting petals once
  const petals = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 14 + Math.random() * 12,
      size: 6 + Math.random() * 8,
      opacity: 0.2 + Math.random() * 0.3,
    })),
    []
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    setFeedback(null)

    if (!username || !password) {
      setFeedback({ type: 'error', msg: '// ERROR: Credentials required' })
      return
    }

    setLoading(true)
    // Replace with your real auth logic
    setTimeout(() => {
      setLoading(false)
      setFeedback({
        type: 'success',
        msg: '// IDENTITY CONFIRMED — waking companion...',
      })
    }, 1400)
  }

  return (
    <div className="page">
      <div className="grid-bg" />
      <div className="glow-blob one" />
      <div className="glow-blob two" />
      <div className="glow-blob three" />

      {/* Drifting petals */}
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      <div className="scanlines" />

      {/* Top brand bar */}
      <div className="brand-bar">
        <div className="brand">
          <AmaiMark className="brand-mark" />
          <div className="brand-text">
            <span className="brand-name">AMAI</span>
            <span className="brand-sub">Companion.OS</span>
          </div>
        </div>
        <div className="status-tag">
          <span className="dot" />
          <span>SYS {time || '--:--:--'}</span>
        </div>
      </div>

      {/* Login card */}
      <div className="login-wrap">
        <div className="greeting">WELCOME HOME</div>
        <h1 className="headline">
          She's been <span className="accent">waiting</span><br />
          for you.
        </h1>
        <p className="sub-copy">
          Sign in to rejoin your companion. Moods, memories, and last session
          restored exactly where you left off.
        </p>

        <div className="card">
          <div className="session-meta">
            <span className="left">◆ PRIVATE SESSION</span>
            <span>ENCRYPTED · LOCAL</span>
          </div>

          {feedback && (
            <div className={`feedback ${feedback.type}`}>{feedback.msg}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label className="field-label" htmlFor="username">
                <span>Username</span>
              </label>
              <div className="input-wrap">
                <input
                  id="username"
                  type="text"
                  className="input"
                  placeholder="your handle"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  spellCheck="false"
                />
                <span className="input-icon"><UserIcon /></span>
              </div>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="password">
                <span>Password</span>
                <span className="hint">· case sensitive</span>
              </label>
              <div className="input-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <span className="input-icon"><LockIcon /></span>
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label="Toggle password visibility"
                >
                  <EyeIcon off={showPassword} />
                </button>
              </div>
            </div>

            <div className="form-row">
              <label className="checkbox-wrap">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember this device</span>
              </label>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Connecting...' : 'Wake Her Up'}
            </button>
          </form>

          <div className="card-footer">
            built with <span className="heart">♥</span> for one user
          </div>
        </div>
      </div>

      <div className="version-line">
        AMAI <span className="sep">◆</span> v0.1.0 <span className="sep">◆</span> SINGLE_USER_BUILD
      </div>
    </div>
  )
}
