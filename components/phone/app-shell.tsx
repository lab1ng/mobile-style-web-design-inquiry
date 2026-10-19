import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function AppHeader({
  title,
  onBack,
  backLabel = '뒤로',
  large,
  right,
}: {
  title: string
  onBack?: () => void
  backLabel?: string
  large?: boolean
  right?: ReactNode
}) {
  return (
    <header className="shrink-0 px-4">
      <div className="relative flex h-11 items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="-ml-2 flex h-11 min-w-11 items-center gap-0.5 pr-2 text-[17px] text-sky-400"
          >
            <ChevronLeft className="size-6" />
            {backLabel}
          </button>
        ) : (
          <span />
        )}
        {!large && <h1 className="absolute left-1/2 -translate-x-1/2 text-[17px] font-semibold">{title}</h1>}
        {right ?? <span />}
      </div>
      {large && <h1 className="pb-2 text-3xl font-bold">{title}</h1>}
    </header>
  )
}

export function AppBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain', className)}>
      {children}
    </div>
  )
}

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description?: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center text-neutral-500">
      <div className="text-neutral-600">{icon}</div>
      <p className="text-lg font-semibold text-neutral-300">{title}</p>
      {description && <p className="text-sm leading-relaxed">{description}</p>}
    </div>
  )
}
