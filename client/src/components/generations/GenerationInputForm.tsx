import { Sparkles, ArrowRight } from 'lucide-react'

interface GenerationInputFormProps {
  companyName: string
  productContext: string
  onCompanyNameChange: (value: string) => void
  onProductContextChange: (value: string) => void
  onSubmit: () => void
}

export default function GenerationInputForm({
  companyName,
  productContext,
  onCompanyNameChange,
  onProductContextChange,
  onSubmit,
}: GenerationInputFormProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Generations
        </h1>
        <p className="text-sm text-[#888] mt-1">
          Generate sales intelligence and personalized outreach for a new company.
        </p>
      </div>

      {/* Generation Form — centered */}
      <div className="max-w-2xl mx-auto">
        <div
          className="liquid-glass-strong rounded-xl overflow-hidden animate-slide-up"
          style={{ border: '1px solid #1c1c1c' }}
        >
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <label htmlFor="company-name" className="block text-sm font-semibold text-white">
                Company
              </label>
              <input
                id="company-name"
                type="text"
                value={companyName}
                onChange={(e) => onCompanyNameChange(e.target.value)}
                placeholder="Enter company name..."
                className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder-[#555] outline-none transition-colors"
                style={{ backgroundColor: '#111', border: '1px solid #262626' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#444' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#262626' }}
                onKeyDown={(e) => { if (e.key === 'Enter') onSubmit() }}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="product-context" className="block text-sm font-semibold text-white">
                Product / Company Context
              </label>
              <textarea
                id="product-context"
                value={productContext}
                onChange={(e) => onProductContextChange(e.target.value)}
                placeholder="Describe your product or company..."
                rows={4}
                className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder-[#555] outline-none transition-colors resize-none"
                style={{ backgroundColor: '#111', border: '1px solid #262626' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#444' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#262626' }}
              />
            </div>
          </div>
          <div
            className="px-6 py-4 flex justify-end"
            style={{ borderTop: '1px solid #1c1c1c', backgroundColor: 'rgba(0,0,0,0.2)' }}
          >
            <button
              onClick={onSubmit}
              disabled={!companyName.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: companyName.trim() ? '#ffffff' : '#333',
                color: companyName.trim() ? '#000000' : '#666',
                boxShadow: companyName.trim() ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
              }}
              onMouseEnter={(e) => { if (companyName.trim()) e.currentTarget.style.backgroundColor = '#e5e5e5' }}
              onMouseLeave={(e) => { if (companyName.trim()) e.currentTarget.style.backgroundColor = '#ffffff' }}
            >
              <Sparkles className="h-4 w-4" />
              Generate
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
