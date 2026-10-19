import { PhoneIncoming, PhoneMissed, PhoneOff, PhoneOutgoing } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Timeline } from '@/lib/timelines'
import { AppBody, AppHeader, EmptyState } from '../app-shell'

const ICONS = {
  incoming: PhoneIncoming,
  outgoing: PhoneOutgoing,
  missed: PhoneMissed,
}

export function PhoneApp({ timeline }: { timeline: Timeline }) {
  return (
    <div className="flex h-full flex-col">
      <AppHeader title="최근 기록" large />
      <AppBody className="px-4">
        {timeline.calls.length === 0 ? (
          <EmptyState icon={<PhoneOff className="size-12" />} title="최근 기록 없음" />
        ) : (
          <ul className="flex flex-col">
            {timeline.calls.map((c) => {
              const Icon = ICONS[c.type]
              return (
                <li key={c.id} className="flex items-center gap-3 border-b border-white/10 py-3">
                  <Icon className={cn('size-4', c.type === 'missed' ? 'text-red-500' : 'text-neutral-500')} />
                  <span className={cn('flex-1 font-semibold', c.type === 'missed' && 'text-red-500')}>
                    {c.name}
                  </span>
                  <span className="text-sm text-neutral-500">{c.time}</span>
                </li>
              )
            })}
          </ul>
        )}
      </AppBody>
    </div>
  )
}
