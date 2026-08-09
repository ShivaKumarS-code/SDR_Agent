import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Check,
  Copy,
  Loader2,
  Sparkles,
} from 'lucide-react'
import { generatePipelineApi } from '@/services/api'
import type {
  StageStatus,
  PipelineStage,
  PageState,
  GenerationResult,
  GenerationsProps,
} from '@/types/generation'
import StageContentPanel from '@/components/generations/StageContentPanel'
import RightPipelineCards from '@/components/generations/RightPipelineCards'
import GenerationInputForm from '@/components/generations/GenerationInputForm'
import GenerationErrorState from '@/components/generations/GenerationErrorState'

// ─── Initial pipeline state factory ─────────────────────────────────────────

function createInitialPipeline(): PipelineStage[] {
  return [
    {
      id: 'research',
      label: 'Research',
      status: 'waiting',
      statusMessage: 'Researching the company and gathering relevant information...',
    },
    {
      id: 'analysis',
      label: 'Analysis',
      status: 'waiting',
      statusMessage: 'Analyzing the research to identify opportunities and sales intelligence...',
    },
    {
      id: 'lead_scoring',
      label: 'Lead Scoring',
      status: 'waiting',
      statusMessage: 'Evaluating how well this lead fits your product...',
    },
    {
      id: 'outreach',
      label: 'Personalized Outreach',
      status: 'waiting',
      statusMessage: 'Using the lead intelligence to draft personalized outreach...',
    },
  ]
}

// ─── Main Generations Page ───────────────────────────────────────────────────

export default function Generations({ initialGeneration, onGenerationComplete }: GenerationsProps) {
  const [pageState, setPageState] = useState<PageState>('input')
  const [companyName, setCompanyName] = useState('')
  const [productContext, setProductContext] = useState('')
  const [pipeline, setPipeline] = useState<PipelineStage[]>(createInitialPipeline())
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [selectedStage, setSelectedStage] = useState<string>('research')
  const [copied, setCopied] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    if (initialGeneration) {
      setCompanyName(initialGeneration.company)
      setProductContext(initialGeneration.company_context || '')
      setResult({
        company: initialGeneration.company,
        researchOutput: initialGeneration.research,
        analysisOutput: initialGeneration.analysis,
        leadSummary: {
          score: initialGeneration.lead_score.score,
          priority: (initialGeneration.lead_score.priority as 'High' | 'Medium' | 'Low') || 'High',
          confidence: initialGeneration.lead_score.confidence,
          reasons: initialGeneration.lead_score.reasons,
        },
        emailSubject: initialGeneration.email.subject,
        emailBody: initialGeneration.email.body,
      })
      setPipeline(createInitialPipeline().map(s => ({ ...s, status: 'completed' })))
      setSelectedStage('research')
      setPageState('completed')
    }
  }, [initialGeneration])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timerRef.current.forEach(clearTimeout)
    }
  }, [])

  // ─── Live Generation Pipeline via FastAPI Backend ──

  const startGeneration = useCallback(async () => {
    if (!companyName.trim()) return

    const company = companyName.trim()
    const context = productContext.trim()

    setPageState('generating')
    setPipeline(createInitialPipeline())
    setResult(null)
    setSelectedStage('research')

    // Synchronized pipeline progress timers matching backend LLM execution speed
    const t1 = setTimeout(() => {
      setPipeline(prev => prev.map(s => s.id === 'research' ? { ...s, status: 'active' } : s))
      setSelectedStage('research')
    }, 100)

    const t2 = setTimeout(() => {
      setPipeline(prev => prev.map(s =>
        s.id === 'research' ? { ...s, status: 'completed' } :
        s.id === 'analysis' ? { ...s, status: 'active' } : s
      ))
      setSelectedStage('analysis')
    }, 5000)

    const t3 = setTimeout(() => {
      setPipeline(prev => prev.map(s =>
        s.id === 'analysis' ? { ...s, status: 'completed' } :
        s.id === 'lead_scoring' ? { ...s, status: 'active' } : s
      ))
      setSelectedStage('lead_scoring')
    }, 10000)

    const t4 = setTimeout(() => {
      setPipeline(prev => prev.map(s =>
        s.id === 'lead_scoring' ? { ...s, status: 'completed' } :
        s.id === 'outreach' ? { ...s, status: 'active' } : s
      ))
      setSelectedStage('outreach')
    }, 15000)

    timerRef.current = [t1, t2, t3, t4]

    try {
      const data = await generatePipelineApi(company, context)

      const apiResult: GenerationResult = {
        company: data.company,
        researchOutput: data.research,
        analysisOutput: data.analysis,
        leadSummary: {
          score: data.lead_score.score,
          priority: (data.lead_score.priority as 'High' | 'Medium' | 'Low') || 'High',
          confidence: data.lead_score.confidence,
          reasons: data.lead_score.reasons,
        },
        emailSubject: data.email.subject,
        emailBody: data.email.body,
      }

      setPipeline(prev => prev.map(s => ({ ...s, status: 'completed' })))
      setResult(apiResult)
      setSelectedStage('research')
      setPageState('completed')
      onGenerationComplete?.()
    } catch (err: any) {
      console.error('Backend generation error:', err)
      timerRef.current.forEach(clearTimeout)
      setErrorMessage(err?.message || 'An error occurred while connecting to the backend API.')
      setPageState('error')
    }
  }, [companyName, productContext, onGenerationComplete])

  const handleNewGeneration = useCallback(() => {
    timerRef.current.forEach(clearTimeout)
    setPageState('input')
    setCompanyName('')
    setProductContext('')
    setPipeline(createInitialPipeline())
    setResult(null)
    setSelectedStage('research')
    setCopied(false)
    setErrorMessage(null)
  }, [])

  const handleCopyEmail = useCallback(async () => {
    if (!result) return
    const text = `Subject: ${result.emailSubject}\n\n${result.emailBody}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [result])

  // ─── INPUT STATE ───────────────────────────────────────────────────────────

  if (pageState === 'input') {
    return (
      <GenerationInputForm
        companyName={companyName}
        productContext={productContext}
        onCompanyNameChange={setCompanyName}
        onProductContextChange={setProductContext}
        onSubmit={startGeneration}
      />
    )
  }

  // ─── ERROR STATE ───────────────────────────────────────────────────────────

  if (pageState === 'error') {
    return (
      <GenerationErrorState
        errorMessage={errorMessage}
        onTryAgain={handleNewGeneration}
      />
    )
  }

  // ─── GENERATING / COMPLETED STATE ──────────────────────────────────────────

  const isCompleted = pageState === 'completed'

  return (
    <div className="space-y-4 animate-fade-in w-full">
      {/* Header row — spans full width to page corners */}
      <div className="flex items-center justify-between flex-wrap gap-4 w-full px-1">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            {companyName}
          </h1>
          {!isCompleted && (
            <div className="flex items-center gap-2 mt-1">
              <Loader2 className="h-4 w-4 text-violet-400 animate-spin-slow" />
              <p className="text-sm text-[#888]">Generating intelligence...</p>
            </div>
          )}
          {isCompleted && (
            <p className="text-sm text-[#4ade80] mt-1 font-medium">Generation complete</p>
          )}
        </div>

        {/* Action buttons — pushed to far right corner */}
        {isCompleted && result && (
          <div className="flex gap-3 ml-auto">
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: copied ? '#4ade80' : '#ffffff',
                color: '#000',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
              onMouseEnter={(e) => { if (!copied) e.currentTarget.style.backgroundColor = '#e5e5e5' }}
              onMouseLeave={(e) => { if (!copied) e.currentTarget.style.backgroundColor = copied ? '#4ade80' : '#ffffff' }}
            >
              {copied ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy Email</>}
            </button>
            <button
              onClick={handleNewGeneration}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer"
              style={{ backgroundColor: 'transparent', color: '#fff', border: '1px solid #333' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#181818' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <Sparkles className="h-4 w-4" />
              New Generation
            </button>
          </div>
        )}
      </div>

      {/* ── Main Grid: Centered ── */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Panel — Full Screen Height Card */}
          <div className="lg:col-span-8 flex flex-col">
            <div
              className="liquid-glass-strong rounded-2xl p-6 md:p-8 h-[calc(100vh-170px)] min-h-[500px] flex flex-col overflow-hidden animate-slide-up"
              style={{ border: '1px solid #1c1c1c' }}
            >
              <StageContentPanel
                stageId={selectedStage}
                result={result}
                pageState={pageState}
                pipeline={pipeline}
              />
            </div>
          </div>

          {/* Right Panel — 3 Stage Cards */}
          <RightPipelineCards
            pipeline={pipeline}
            selectedStage={selectedStage}
            isCompleted={isCompleted}
            onSelectStage={setSelectedStage}
          />
        </div>
      </div>
    </div>
  )
}
