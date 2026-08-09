import { useState, useEffect } from 'react'
import { Search, ArrowRight, Sparkles, Loader2 } from 'lucide-react'
import { fetchGenerationsApi, type BackendGeneration } from '@/services/api'

interface HistoryPageProps {
  onSelectGeneration: (generation: BackendGeneration) => void
  onNavigateToNew: () => void
}

function getScoreColor(score: number) {
  if (score >= 80) return '#4ade80'
  if (score >= 60) return '#fbbf24'
  return '#f87171'
}

function getPriorityStyles(priority: string) {
  switch (priority) {
    case 'High':
      return { backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }
    case 'Medium':
      return { backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }
    case 'Low':
      return { backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)' }
    default:
      return { backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#888', border: '1px solid #222' }
  }
}

export default function HistoryPage({ onSelectGeneration, onNavigateToNew }: HistoryPageProps) {
  const [generations, setGenerations] = useState<BackendGeneration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchGenerationsApi()
      .then((data) => {
        setGenerations(data)
        setLoading(false)
      })
      .catch((err) => {
        console.warn('Failed to load history:', err)
        setLoading(false)
      })
  }, [])

  const filtered = generations.filter((gen) => {
    const q = searchTerm.toLowerCase().trim()
    if (!q) return true
    return (
      gen.company.toLowerCase().includes(q) ||
      (gen.company_context && gen.company_context.toLowerCase().includes(q))
    )
  })

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center text-center p-8 gap-3 animate-fade-in">
        <Loader2 className="h-8 w-8 text-violet-400 animate-spin-slow" />
        <p className="text-sm font-medium text-[#888]">Loading history...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          History
        </h1>
        <p className="text-sm text-[#888]">
          Search and review all your past prospect research generations
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#666]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search generations..."
          className="w-full bg-[#0c0c0c] border border-[#222] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#555] outline-none focus:border-violet-500/60 transition-colors shadow-inner"
        />
      </div>

      {/* Generations List / Cards */}
      {generations.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 my-8 rounded-2xl border border-[#1c1c1c] bg-[#0c0c0c]">
          <div className="h-14 w-14 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20 shadow-lg">
            <Sparkles className="h-7 w-7 text-violet-400" />
          </div>
          <h4 className="text-xl font-extrabold text-white">No history records found</h4>
          <p className="text-sm text-[#888] max-w-md">
            You haven't generated any prospect intelligence yet. Create your first lead to see your history here!
          </p>
          <button
            onClick={onNavigateToNew}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-white text-black hover:bg-neutral-200 transition-all cursor-pointer shadow-xl hover:scale-105 mt-2"
          >
            <Sparkles className="h-4 w-4 text-violet-600" />
            Generate First Lead
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center text-sm text-[#888] rounded-xl border border-[#1c1c1c] bg-[#0c0c0c]">
          No generations matching "{searchTerm}".
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const dateStr = new Date(item.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
            const contextSummary = item.company_context
              ? item.company_context.split('\n')[0].slice(0, 50)
              : 'Prospect Research'

            return (
              <div
                key={item.id}
                onClick={() => onSelectGeneration(item)}
                className="group p-5 rounded-xl border border-[#1c1c1c] bg-[#0c0c0c] hover:bg-[#141414] hover:border-[#2a2a2a] transition-all cursor-pointer space-y-3 shadow-md"
              >
                {/* Top Row: Company Name (left) & Score + Priority (right) */}
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                    {item.company}
                  </h3>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className="font-extrabold text-lg"
                      style={{ color: getScoreColor(item.lead_score?.score || 0) }}
                    >
                      {item.lead_score?.score || 0}
                    </span>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider"
                      style={getPriorityStyles(item.lead_score?.priority || 'Medium')}
                    >
                      {item.lead_score?.priority || 'Medium'}
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Context / Date (left) & View arrow (right) */}
                <div className="flex items-center justify-between text-xs text-[#888] pt-1 border-t border-[#181818]">
                  <span>
                    {contextSummary} · {dateStr}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#aaa] group-hover:text-white transition-colors">
                    View details
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
