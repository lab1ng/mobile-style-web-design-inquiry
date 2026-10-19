'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { formatKoreanDate, parseDate, TIMELINES, type Timeline } from '@/lib/timelines'
import { AppBody } from '../app-shell'
import { ConfirmDialog } from '../confirm-dialog'

const WEEK_HEADER = ['일', '월', '화', '수', '목', '금', '토']
const TRAVELABLE = new Set(TIMELINES.map((t) => t.id))

const toId = (y: number, m: number, d: number) =>
  `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`

type Props = {
  timeline: Timeline
  onTravel: (targetId: string) => void
}

export function CalendarApp({ timeline, onTravel }: Props) {
  const today = parseDate(timeline.id)
  const [view, setView] = useState({ year: today.year, month: today.month })
  const [selected, setSelected] = useState(timeline.id)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const shiftMonth = (delta: number) => {
    setView(({ year, month }) => {
      const d = new Date(year, month - 1 + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() + 1 }
    })
  }

  const firstWeekday = new Date(view.year, view.month - 1, 1).getDay()
  const daysInMonth = new Date(view.year, view.month, 0).getDate()
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const eventDates = new Set(timeline.events.map((e) => e.date))
  const selectedEvents = timeline.events.filter((e) => e.date === selected)

  const handleSelect = (id: string) => {
    setSelected(id)
    if (id !== timeline.id && TRAVELABLE.has(id)) setConfirmId(id)
  }

  return (
    <div className="relative flex h-full flex-col">
      <header className="shrink-0 px-4">
        <div className="flex h-11 items-center justify-between">
          <div className="flex">
            <NavButton label="이전 해" onClick={() => shiftMonth(-12)}>
              <ChevronsLeft className="size-5" />
            </NavButton>
            <NavButton label="이전 달" onClick={() => shiftMonth(-1)}>
              <ChevronLeft className="size-5" />
            </NavButton>
          </div>
          <button
            type="button"
            onClick={() => setView({ year: today.year, month: today.month })}
            className="h-11 px-3 text-sm font-medium text-red-500"
          >
            오늘
          </button>
          <div className="flex">
            <NavButton label="다음 달" onClick={() => shiftMonth(1)}>
              <ChevronRight className="size-5" />
            </NavButton>
            <NavButton label="다음 해" onClick={() => shiftMonth(12)}>
              <ChevronsRight className="size-5" />
            </NavButton>
          </div>
        </div>
        <h1 className="pb-3 text-3xl font-bold" aria-live="polite">
          {view.year}년 <span className="text-red-500">{view.month}월</span>
        </h1>
        <div className="grid grid-cols-7 border-b border-white/10 pb-2 text-center text-xs text-neutral-500">
          {WEEK_HEADER.map((w, i) => (
            <span key={w} className={cn(i === 0 && 'text-red-400/80')}>
              {w}
            </span>
          ))}
        </div>
      </header>

      <AppBody className="px-4">
        <div className="grid grid-cols-7 gap-y-1 pt-2">
          {cells.map((day, i) => {
            if (day === null) return <span key={`e${i}`} />
            const id = toId(view.year, view.month, day)
            const isToday = id === timeline.id
            const isSelected = id === selected
            const isTravelable = TRAVELABLE.has(id) && !isToday
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleSelect(id)}
                aria-label={`${formatKoreanDate(id)}${isToday ? ', 오늘' : ''}${isTravelable ? ', 이동 가능' : ''}`}
                aria-pressed={isSelected}
                className="flex h-12 flex-col items-center justify-center gap-0.5"
              >
                <span
                  className={cn(
                    'flex size-9 items-center justify-center rounded-full text-[17px] tabular-nums',
                    isToday && 'bg-red-500 font-semibold text-white',
                    !isToday && isSelected && 'bg-white font-semibold text-black',
                    !isToday && !isSelected && i % 7 === 0 && 'text-red-400/80',
                  )}
                >
                  {day}
                </span>
                <span
                  className={cn(
                    'size-1.5 rounded-full',
                    isTravelable ? 'bg-amber-400' : eventDates.has(id) ? 'bg-neutral-500' : 'bg-transparent',
                  )}
                />
              </button>
            )
          })}
        </div>

        <section aria-label="선택한 날짜 일정" className="mt-4 border-t border-white/10 py-4">
          <p className="text-sm font-semibold text-neutral-400">{formatKoreanDate(selected)}</p>
          {selectedEvents.length === 0 ? (
            <p className="mt-2 text-neutral-500">일정 없음</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-2">
              {selectedEvents.map((e) => (
                <li key={e.title} className="flex items-center gap-3 rounded-xl bg-neutral-900 px-4 py-3">
                  <span className="h-6 w-1 rounded-full bg-red-500" />
                  {e.title}
                </li>
              ))}
            </ul>
          )}
        </section>
      </AppBody>

      {confirmId && (
        <ConfirmDialog
          title={formatKoreanDate(confirmId)}
          message="그 날짜로 돌아가시겠습니까?"
          confirmLabel="돌아가기"
          onCancel={() => setConfirmId(null)}
          onConfirm={() => {
            const target = confirmId
            setConfirmId(null)
            onTravel(target)
          }}
        />
      )}
    </div>
  )
}

function NavButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-11 items-center justify-center text-red-500 active:opacity-50"
    >
      {children}
    </button>
  )
}
