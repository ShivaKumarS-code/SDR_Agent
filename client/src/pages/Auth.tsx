import { useState } from 'react'
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { loginApi, registerApi, type User } from '@/services/api'

interface AuthProps {
  onSuccess: (user: User) => void
}

export default function Auth({ onSuccess }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    if (mode === 'register' && !name.trim()) {
      setError('Please enter your full name.')
      return
    }

    setLoading(true)

    try {
      if (mode === 'login') {
        const { user } = await loginApi(email.trim(), password.trim())
        onSuccess(user)
      } else {
        const { user } = await registerApi(name.trim(), email.trim(), password.trim())
        onSuccess(user)
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      setError(err.message || 'Authentication failed. Please check your details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-4 bg-[#080808] text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glass Card */}
      <div className="w-full max-w-md space-y-4 relative z-10 animate-fade-in">
        {/* Card Container */}
        <div
          className="liquid-glass-strong rounded-2xl p-6 sm:p-7 space-y-5 border border-[#1c1c1c] shadow-2xl relative"
          style={{ backgroundColor: 'rgba(12, 12, 12, 0.75)' }}
        >
          {/* Header Text — Inside Card */}
          <div className="flex flex-col items-center text-center space-y-1.5 pb-1">
            <div className="flex items-center justify-center gap-2.5">
              <img
                src="/icon.png"
                onError={(e) => { e.currentTarget.src = '/futuristic.png' }}
                alt="SDR Agent Logo"
                className="h-10 w-10 rounded-full object-cover shrink-0 shadow-lg border border-[#2a2a2a]"
              />
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                SDR Agent
              </h1>
            </div>
            <p className="text-xs text-[#888] max-w-xs leading-relaxed">
              {mode === 'login'
                ? 'Sign in to access your prospect intelligence'
                : 'Create your account to start generating leads'}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex rounded-lg p-1 bg-[#121212] border border-[#222]">
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setError(null)
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-black shadow-md'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register')
                setError(null)
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-black shadow-md'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#aaa] uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-[#666]" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#555] focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#aaa] uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#666]" />
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#555] focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#aaa] uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#666]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#555] focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-extrabold bg-white text-black hover:bg-neutral-200 focus:outline-none transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 text-black animate-spin-slow" />
                  <span>Please wait...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="h-4 w-4 text-black" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
