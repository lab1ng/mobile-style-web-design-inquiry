'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  formatKoreanDate,
  parseDate,
  TIMELINES,
  type CalendarCategory,
  type CalendarEvent,
  type Timeline,
} from '@/lib/timelines'
import { AppBody } from '../app-shell'
import { ConfirmDialog } from '../confirm-dialog'

const WEEK_HEADER = ['일', '월', '화', '수', '목', '금', '토']

const CATEGORY_COLOR: Record<CalendarCategory, string> = {
  hospital: 'bg-red-400',
  academy: 'bg-sky-400',
  birthday: 'bg-pink-400',
  exam: 'bg-violet-400',
  friends: 'bg-emerald-400',
  school: 'bg-orange-400',
  plan: 'bg-yellow-300',
}
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

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const e of timeline.events) {
      const list = map.get(e.date)
      if (list) list.push(e)
      else map.set(e.date, [e])
    }
    return map
  }, [timeline.events])
  const selectedEvents = eventsByDate.get(selected) ?? []

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
            const dayCategories = [...new Set((eventsByDate.get(id) ?? []).map((e) => e.category))].slice(0, 3)
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
                    isTravelable && !isSelected && 'ring-2 ring-amber-400',
                  )}
                >
                  {day}
                </span>
                <span className="flex h-1.5 gap-0.5" aria-hidden="true">
                  {dayCategories.map((c) => (
                    <span key={c} className={cn('size-1.5 rounded-full', CATEGORY_COLOR[c])} />
                  ))}
                </span>
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
                  <span className={cn('h-6 w-1 shrink-0 rounded-full', CATEGORY_COLOR[e.category], e.canceled && 'opacity-40')} />
                  {e.canceled ? (
                    <del className="text-neutral-500 decoration-neutral-400">
                      <span className="sr-only">취소됨: </span>
                      {e.title}
                    </del>
                  ) : (
                    e.title
                  )}
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
