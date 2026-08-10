import { useEffect, useState } from 'react'
import { Users, Target, ArrowRight, Loader2, Sparkles } from 'lucide-react'
import StatCard from '@/components/StatCard'
import { fetchGenerationsApi, type BackendGeneration } from '@/services/api'

function getPriorityStyles(priority: string) {
  switch (priority) {
    case 'High':
      return {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: '#f87171',
        border: '1px solid rgba(239, 68, 68, 0.2)',
      }
    case 'Medium':
      return {
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        color: '#fbbf24',
        border: '1px solid rgba(251, 191, 36, 0.2)',
      }
    default:
      return {
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
        color: '#4ade80',
        border: '1px solid rgba(74, 222, 128, 0.2)',
      }
  }
}

function getScoreColor(score: number) {
  if (score >= 80) return '#4ade80'
  if (score >= 60) return '#fbbf24'
  return '#f87171'
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard({ onNavigate }: { onNavigate?: (page: 'dashboard' | 'generations' | 'history') => void }) {
  const [generations, setGenerations] = useState<BackendGeneration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    fetchGenerationsApi()
      .then((data) => {
        if (isMounted) {
          setGenerations(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.warn('Dashboard fetch error:', err)
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [])

  const totalLeads = generations.length
  const avgScore = totalLeads > 0
    ? Math.round(generations.reduce((acc, g) => acc + (g.lead_score?.score || 0), 0) / totalLeads)
    : 0

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center text-center p-8 gap-3 animate-fade-in">
        <Loader2 className="h-8 w-8 text-violet-400 animate-spin-slow" />
        <p className="text-sm font-medium text-[#888]">Loading dashboard...</p>
      </div>
    )
  }

  if (generations.length === 0) {
    return (
      <div className="space-y-8 animate-fade-in min-h-[calc(100vh-140px)] flex flex-col justify-between">
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-sm text-[#888]">
            {getGreeting()} — Ready to research your next prospect?
          </p>
        </div>

        {/* Centered Hero Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-5 my-auto">
          <div className="h-16 w-16 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20 shadow-2xl animate-pulse">
            <Sparkles className="h-8 w-8 text-violet-400" />
          </div>
          <div className="space-y-2 max-w-lg">
            <h2 className="text-2xl font-extrabold text-white">Generate your first lead to start</h2>
            <p className="text-sm text-[#888] leading-relaxed">
              You haven't generated any prospect intelligence yet. Click below to run AI company research, strategic analysis, lead scoring, and personalized outreach email generation!
            </p>
          </div>
          <button
            onClick={() => onNavigate?.('generations')}
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl text-base font-bold bg-white text-black hover:bg-neutral-200 transition-all duration-200 cursor-pointer shadow-2xl hover:scale-105"
          >
            <Sparkles className="h-5 w-5 text-violet-600" />
            Generate Your First Lead
            <ArrowRight className="h-5 w-5 text-black" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Dashboard
        </h1>
        <div className="mt-2 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xl font-semibold text-white">{getGreeting()}</p>
            <p className="text-sm text-[#888] mt-1">
              Ready to research your next prospect?
            </p>
          </div>
          <button
            onClick={() => onNavigate?.('generations')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer bg-white text-black hover:bg-neutral-200 shadow-md"
          >
            <Sparkles className="h-4 w-4 text-violet-600" />
            New Generation
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <StatCard
          title="Leads generated"
          value={loading ? '...' : totalLeads}
          icon={Users}
          glowColor="rgba(210, 220, 255, 0.06)"
        />
        <StatCard
          title="Avg. lead score"
          value={loading ? '...' : (totalLeads > 0 ? avgScore : 0)}
          icon={Target}
          glowColor="rgba(255, 229, 180, 0.06)"
        />
      </div>

      {/* Recent Generations */}
      <div
        className="rounded-xl overflow-hidden animate-slide-up"
        style={{
          border: '1px solid #1c1c1c',
          background: 'rgba(255,255,255,0.01)',
          animationDelay: '0.1s',
        }}
      >
        {/* Section header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{
            borderBottom: '1px solid #1c1c1c',
            backgroundColor: '#0f0f0f',
          }}
        >
          <h3 className="text-lg font-bold text-white">Recent generations</h3>
          {loading && <Loader2 className="h-4 w-4 text-violet-400 animate-spin-slow" />}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr
                className="text-xs font-bold uppercase tracking-wider text-[#666]"
                style={{
                  backgroundColor: '#0c0c0c',
                  borderBottom: '1px solid #1c1c1c',
                }}
              >
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {generations.slice(0, 10).map((gen, idx) => {
                const createdDate = new Date(gen.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })
                return (
                  <tr
                    key={gen.id}
                    className="transition-colors duration-200 group/row animate-fade-in cursor-pointer"
                    style={{
                      borderBottom:
                        idx < generations.length - 1
                          ? '1px solid #1c1c1c'
                          : 'none',
                      animationDelay: `${0.15 + idx * 0.05}s`,
                    }}
                    onClick={() => onNavigate?.('generations')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#111111'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <td className="px-6 py-4 font-bold text-white">
                      {gen.company}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="font-extrabold text-base"
                        style={{ color: getScoreColor(gen.lead_score.score) }}
                      >
                        {gen.lead_score.score}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full"
                        style={getPriorityStyles(gen.lead_score.priority)}
                      >
                        {gen.lead_score.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#888]">{createdDate}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#888] group-hover/row:text-white transition-colors">
                        View details
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/row:translate-x-1" />
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
