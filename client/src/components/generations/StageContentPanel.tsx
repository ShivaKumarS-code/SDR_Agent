import {
  Search,
  BarChart3,
  Target,
  Mail,
  Loader2,
} from 'lucide-react'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import type {
  PipelineStage,
  PageState,
  GenerationResult,
} from '@/types/generation'

const STAGE_ICONS: Record<string, typeof Search> = {
  research: Search,
  analysis: BarChart3,
  lead_scoring: Target,
  outreach: Mail,
}

function getScoreColor(score: number) {
  if (score >= 80) return '#4ade80'
  if (score >= 60) return '#fbbf24'
  return '#f87171'
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'High': return '#f87171'
    case 'Medium': return '#fbbf24'
    case 'Low': return '#4ade80'
    default: return '#888'
  }
}

interface StageContentPanelProps {
  stageId: string
  result: GenerationResult | null
  pageState: PageState
  pipeline: PipelineStage[]
}

export default function StageContentPanel({
  stageId,
  result,
  pageState,
  pipeline,
}: StageContentPanelProps) {
  const currentStage = pipeline.find(s => s.id === stageId)
  const StageIcon = STAGE_ICONS[stageId] || Search

  if (pageState === 'generating' && !result) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[320px] gap-4 animate-fade-in text-center p-6 my-auto">
        <div className="h-16 w-16 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20 shadow-2xl">
          <Loader2 className="h-8 w-8 text-violet-400 animate-spin-slow" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h3 className="text-lg font-extrabold text-white flex items-center justify-center gap-2">
            <StageIcon className="h-5 w-5 text-violet-400" />
            {currentStage?.label || 'Processing'}
          </h3>
          <p className="text-sm text-[#888] leading-relaxed">
            {currentStage?.statusMessage || 'Gathering prospect intelligence...'}
          </p>
        </div>
      </div>
    )
  }

  if (!result) return null

  function renderContent() {
    switch (stageId) {
      case 'research':
        return (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-5 w-5 text-[#4ade80]" />
              <h3 className="text-lg font-bold text-white">Research</h3>
            </div>
            {result?.researchOutput ? (
              <MarkdownRenderer content={result.researchOutput} />
            ) : (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 text-violet-400 animate-spin-slow" />
                <p className="text-sm text-[#888]">Researching the company...</p>
              </div>
            )}
          </div>
        )
      case 'analysis':
        return (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-[#4ade80]" />
              <h3 className="text-lg font-bold text-white">Analysis</h3>
            </div>
            {result?.analysisOutput ? (
              <MarkdownRenderer content={result.analysisOutput} />
            ) : (
              <p className="text-sm text-[#555]">Analysis output will appear here.</p>
            )}
          </div>
        )
      case 'lead_scoring':
        if (!result?.leadSummary) {
          return <p className="text-sm text-[#555]">Lead scoring output will appear here.</p>
        }
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-[#4ade80]" />
              <h3 className="text-lg font-bold text-white">Lead Scoring</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <div className="rounded-lg p-3.5 sm:p-4 overflow-hidden" style={{ backgroundColor: '#111', border: '1px solid #1c1c1c' }}>
                <p className="text-[10px] sm:text-[11px] font-medium text-[#666] uppercase tracking-wider">Score</p>
                <p className="text-xl sm:text-2xl font-bold mt-1 truncate" style={{ color: getScoreColor(result.leadSummary.score) }}>{result.leadSummary.score}</p>
              </div>
              <div className="rounded-lg p-3.5 sm:p-4 overflow-hidden" style={{ backgroundColor: '#111', border: '1px solid #1c1c1c' }}>
                <p className="text-[10px] sm:text-[11px] font-medium text-[#666] uppercase tracking-wider">Priority</p>
                <p className="text-xl sm:text-2xl font-bold mt-1 truncate" style={{ color: getPriorityColor(result.leadSummary.priority) }}>{result.leadSummary.priority}</p>
              </div>
              <div className="rounded-lg p-3.5 sm:p-4 overflow-hidden" style={{ backgroundColor: '#111', border: '1px solid #1c1c1c' }}>
                <p className="text-[10px] sm:text-[11px] font-medium text-[#666] uppercase tracking-wider">Confidence</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1 truncate">{result.leadSummary.confidence}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Key Reasons</p>
              <ul className="space-y-1.5">
                {result.leadSummary.reasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#ccc]">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: '#4ade80' }} />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      case 'outreach':
        return (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-[#4ade80]" />
              <h3 className="text-lg font-bold text-white">Personalized Outreach</h3>
            </div>
            {result?.emailSubject ? (
              <div
                className="rounded-lg overflow-hidden"
                style={{ border: '1px solid #1c1c1c', backgroundColor: '#0a0a0a' }}
              >
                <div className="px-4 py-3" style={{ borderBottom: '1px solid #1c1c1c', backgroundColor: '#111' }}>
                  <p className="text-[11px] font-medium text-[#666] uppercase tracking-wider mb-1">Subject</p>
                  <p className="text-sm font-semibold text-white">{result.emailSubject}</p>
                </div>
                <div className="px-4 py-4 text-sm text-[#ccc] leading-relaxed whitespace-pre-wrap">
                  {result.emailBody}
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#555]">Email will appear here.</p>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-full overflow-y-auto pr-2">
      {renderContent()}
    </div>
  )
}
