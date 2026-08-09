import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  glowColor?: string
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  glowColor = 'rgba(210, 220, 255, 0.06)',
}: StatCardProps) {
  return (
    <div
      className="liquid-glass rounded-xl p-6 flex flex-col justify-between transition-all duration-300 group hover:scale-[1.02]"
      style={{
        background: glowColor,
        border: '1px solid #1c1c1c',
      }}
    >
      <div className="flex items-center justify-between space-x-4">
        <span className="text-sm font-medium text-[#888] truncate">
          {title}
        </span>
        <div
          className="p-2 rounded-lg transition-colors"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        >
          <Icon className="h-5 w-5 text-[#aaa]" />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-3xl font-bold tracking-tight text-white">
          {value}
        </span>
        {description && (
          <p className="mt-1 text-xs text-[#555]">{description}</p>
        )}
      </div>
    </div>
  )
}
