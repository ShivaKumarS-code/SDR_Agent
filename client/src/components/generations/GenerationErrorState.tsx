import { AlertCircle, ArrowLeft } from 'lucide-react'

interface GenerationErrorStateProps {
  errorMessage: string | null
  onTryAgain: () => void
}

export default function GenerationErrorState({
  errorMessage,
  onTryAgain,
}: GenerationErrorStateProps) {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto py-12 text-center">
      <div
        className="liquid-glass-strong rounded-2xl p-8 border border-red-500/30 space-y-5"
        style={{ backgroundColor: 'rgba(24, 10, 10, 0.7)' }}
      >
        <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20 shadow-2xl mx-auto">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white">An Error Occurred</h2>
          <p className="text-sm text-red-300 font-mono bg-red-500/10 p-3.5 rounded-xl border border-red-500/20 max-w-lg mx-auto text-left whitespace-pre-wrap break-words">
            {errorMessage || 'An error occurred during generation.'}
          </p>
        </div>
        <button
          onClick={onTryAgain}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-white text-black hover:bg-neutral-200 transition-all cursor-pointer shadow-xl hover:scale-105"
        >
          <ArrowLeft className="h-4 w-4 text-black" />
          Try Again
        </button>
      </div>
    </div>
  )
}
