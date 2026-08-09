import { Search, BarChart3, Target, Mail, Check, Loader2 } from 'lucide-react'
import type { PipelineStage, StageStatus } from '@/types/generation'

const STAGE_ICONS: Record<string, typeof Search> = {
  research: Search,
  analysis: BarChart3,
  lead_scoring: Target,
  outreach: Mail,
}

function getStageColor(status: StageStatus) {
  if (status === 'completed') return { bg: '#4ade80', text: '#000', glow: '0 0 20px rgba(74, 222, 128, 0.3)' }
  if (status === 'active') return { bg: '#8b5cf6', text: '#fff', glow: '0 0 20px rgba(139, 92, 246, 0.4)' }
  return { bg: '#1c1c1c', text: '#555', glow: 'none' }
}

interface RightPipelineCardsProps {
  pipeline: PipelineStage[]
  selectedStage: string
  isCompleted: boolean
  onSelectStage: (stageId: string) => void
}

export default function RightPipelineCards({
  pipeline,
  selectedStage,
  isCompleted,
  onSelectStage,
}: RightPipelineCardsProps) {
  return (
    <div className="lg:col-span-4 flex flex-col justify-between h-[calc(100vh-170px)] min-h-[500px]">
      {pipeline
        .filter((stage) => stage.id !== selectedStage)
        .map((stage, idx) => {
          const stageColor = getStageColor(stage.status)
          const StageIcon = STAGE_ICONS[stage.id] || Search
          const canSelect = isCompleted

          const fullIndex = pipeline.findIndex((s) => s.id === stage.id)
          const prevStage = fullIndex > 0 ? pipeline[fullIndex - 1] : null
          const connectorGlowing = prevStage ? prevStage.status === 'completed' : false

          return (
            <div key={stage.id} className="flex-1 flex flex-col justify-between min-h-0">
              {/* Connector Arrow between cards */}
              {idx > 0 && (
                <div className="flex items-center justify-center py-1 shrink-0">
                  <div className="flex flex-col items-center gap-0.5">
                    <div
                      className="w-0.5 h-3.5 transition-all duration-700 relative overflow-hidden"
                      style={{
                        backgroundColor: connectorGlowing ? '#4ade80' : '#262626',
                        boxShadow: connectorGlowing ? '0 0 10px #4ade80' : 'none',
                      }}
                    >
                      {connectorGlowing && (
                        <div className="absolute inset-0 bg-white/60 animate-pulse" />
                      )}
                    </div>
                    <div
                      className="w-2 h-2 rotate-45 -mt-1.5 transition-all duration-700"
                      style={{
                        borderRight: `2px solid ${connectorGlowing ? '#4ade80' : '#444'}`,
                        borderBottom: `2px solid ${connectorGlowing ? '#4ade80' : '#444'}`,
                        boxShadow: connectorGlowing ? '2px 2px 8px rgba(74, 222, 128, 0.6)' : 'none',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Right Stage Node Card — 100% Equal Height */}
              <div
                className={`liquid-glass rounded-2xl p-5 flex flex-col justify-between flex-1 transition-all duration-300 ${
                  canSelect ? 'cursor-pointer hover:scale-[1.02] hover:border-violet-500/50' : ''
                }`}
                style={{
                  border: '1px solid #1c1c1c',
                  backgroundColor: 'rgba(12, 12, 12, 0.6)',
                }}
                onClick={() => {
                  if (canSelect) onSelectStage(stage.id)
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full shrink-0 transition-all duration-500"
                    style={{
                      backgroundColor: stageColor.bg,
                      boxShadow: stageColor.glow,
                    }}
                  >
                    {stage.status === 'completed' ? (
                      <Check className="h-5 w-5 text-black" strokeWidth={3} />
                    ) : stage.status === 'active' ? (
                      <Loader2 className="h-5 w-5 text-white animate-spin-slow" />
                    ) : (
                      <StageIcon className="h-5 w-5" style={{ color: stageColor.text }} />
                    )}
                  </div>

                  {canSelect && (
                    <span className="text-xs font-semibold text-[#888] bg-[#181818] px-3 py-1 rounded-full border border-[#262626]">
                      View
                    </span>
                  )}
                </div>

                <div>
                  <h4
                    className="text-sm sm:text-base font-extrabold uppercase tracking-wider transition-colors duration-300 leading-tight"
                    style={{
                      color: stage.status === 'waiting' ? '#666' : '#fff',
                    }}
                  >
                    {stage.label}
                  </h4>
                  <p
                    className="text-xs mt-1 font-semibold"
                    style={{
                      color:
                        stage.status === 'completed'
                          ? '#4ade80'
                          : stage.status === 'active'
                          ? '#a78bfa'
                          : '#444',
                    }}
                  >
                    {stage.status === 'completed'
                      ? 'Done'
                      : stage.status === 'active'
                      ? 'Processing...'
                      : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}
