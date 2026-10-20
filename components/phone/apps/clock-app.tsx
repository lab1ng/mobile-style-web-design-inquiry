import { AlarmClock, Globe, Plus, Timer, TimerReset } from 'lucide-react'
import type { Timeline } from '@/lib/timelines'
import { cn } from '@/lib/utils'

function toKoreanClock(time: string) {
  const [h, m] = time.split(':').map(Number)
  const period = h < 12 ? '오전' : '오후'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return { period, display: `${hour12}:${String(m).padStart(2, '0')}` }
}

const TABS = [
  { label: '세계 시계', icon: Globe, active: true },
  { label: '알람', icon: AlarmClock },
  { label: '스톱워치', icon: Timer },
  { label: '타이머', icon: TimerReset },
]

export function ClockApp({ timeline }: { timeline: Timeline }) {
  const { period, display } = toKoreanClock(timeline.time)

  return (
    <div className="flex h-full flex-col bg-black text-white">
      <div className="flex shrink-0 items-center justify-between px-4 pt-1" aria-hidden="true">
        <span className="rounded-full bg-neutral-900 px-4 py-2 text-[17px]">편집</span>
        <span className="flex size-11 items-center justify-center rounded-full bg-neutral-900">
          <Plus className="size-6" />
        </span>
      </div>

      <div className="min-h-0 flex-1 px-4">
        <h2 className="mt-3 text-[34px] font-bold">세계 시계</h2>
        <div className="mt-3 border-y border-white/15 py-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-neutral-400">오늘, +0시간</p>
              <p className="text-3xl">서울</p>
            </div>
            <p className="flex items-baseline gap-1">
              <span className="text-2xl">{period}</span>
              <span className="text-[56px] leading-none font-extralight tabular-nums">{display}</span>
            </p>
          </div>
        </div>
      </div>

      <nav
        aria-label="시계 탭"
        className="mx-4 mb-1 flex shrink-0 items-center rounded-full border border-white/10 bg-neutral-900 p-1"
      >
        {TABS.map(({ label, icon: Icon, active }) => (
          <div
            key={label}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 rounded-full py-2 text-[11px]',
              active ? 'bg-neutral-700/70 text-[#ff9f0a]' : 'text-white',
            )}
          >
            <Icon className="size-6" aria-hidden="true" />
            {label}
          </div>
        ))}
      </nav>
    </div>
  )
}
