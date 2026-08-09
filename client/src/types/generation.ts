import type { BackendGeneration } from '@/services/api'

export type StageStatus = 'waiting' | 'active' | 'completed'

export interface PipelineStage {
  id: string
  label: string
  status: StageStatus
  statusMessage: string
  output?: string
}

export type PageState = 'input' | 'generating' | 'completed' | 'error'

export interface LeadSummary {
  score: number
  priority: string
  confidence: string
  reasons: string[]
}

export interface GenerationResult {
  company: string
  leadSummary: LeadSummary
  researchOutput: string
  analysisOutput: string
  emailSubject: string
  emailBody: string
}

export interface GenerationsProps {
  initialGeneration?: BackendGeneration | null
  onGenerationComplete?: () => void
}
