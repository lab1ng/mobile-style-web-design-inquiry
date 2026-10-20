'use client'

import { ChevronRight, CircleAlert, MessageCircle, Play } from 'lucide-react'
import { Fragment, useState } from 'react'
import { cn } from '@/lib/utils'
import type { Timeline } from '@/lib/timelines'
import { AppBody, AppHeader, EmptyState } from '../app-shell'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function parts(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  return { y, m, d, w: WEEKDAYS[new Date(y, m - 1, d).getDay()] }
}

function dividerLabel(date: string) {
  const { y, m, d, w } = parts(date)
  return `${y}년 ${m}월 ${d}일 (${w})`
}

function listLabel(date: string, today: string) {
  const { y, m, d } = parts(date)
  if (date === today) return '오늘'
  return `${y}. ${m}. ${d}.`
}

const WAVE = [6, 10, 14, 9, 16, 12, 7, 13, 18, 11, 8, 15, 10, 6, 12, 9, 14, 7, 11, 5]

function VoiceBubble({ duration, transcript, isMe }: { duration: string; transcript: string; isMe: boolean }) {
  return (
    <div
      className={cn(
        'flex max-w-[78%] flex-col gap-2 rounded-2xl px-3.5 py-2.5',
        isMe ? 'rounded-br-md bg-sky-500' : 'rounded-bl-md bg-neutral-800',
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/20">
          <Play className="ml-0.5 size-3.5 fill-white text-white" aria-hidden="true" />
        </span>
        <span className="flex h-5 items-center gap-[3px]" aria-hidden="true">
          {WAVE.map((h, i) => (
            <span key={i} className="w-[2px] rounded-full bg-white/70" style={{ height: h }} />
          ))}
        </span>
        <span className="text-[13px] tabular-nums text-white/80">
          <span className="sr-only">음성 메시지 </span>
          {duration}
        </span>
      </div>
      <p className="border-t border-white/10 pt-2 text-[14px] leading-snug text-white/90 text-pretty">{transcript}</p>
    </div>
  )
}

export function MessagesApp({ timeline }: { timeline: Timeline }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const convo = timeline.messages.find((c) => c.id === openId)

  if (convo) {
    return (
      <div className="flex h-full flex-col animate-in slide-in-from-right-10 fade-in duration-200">
        <AppHeader title={convo.name} onBack={() => setOpenId(null)} backLabel="문자" />
        <AppBody className="flex flex-col gap-1.5 px-4 py-4">
          {convo.messages.map((m, i) => {
            const prev = convo.messages[i - 1]
            const showDivider = !prev || prev.date !== m.date
            const isMe = m.from === 'me'
            const nextSameSide = convo.messages[i + 1]?.from === m.from && convo.messages[i + 1]?.date === m.date
            return (
              <Fragment key={i}>
                {showDivider && (
                  <p className="mt-3 mb-1 text-center text-[11px] font-medium text-neutral-500">
                    {dividerLabel(m.date)}
                  </p>
                )}
                <div className={cn('flex flex-col gap-0.5', isMe ? 'items-end' : 'items-start')}>
                  {m.voice ? (
                    <VoiceBubble duration={m.voice} transcript={m.text} isMe={isMe} />
                  ) : (
                    <div className="flex max-w-[85%] items-center gap-1.5">
                      <p
                        className={cn(
                          'whitespace-pre-line rounded-2xl px-3.5 py-2 text-[15px] leading-snug text-pretty',
                          isMe ? 'bg-sky-500 text-white' : 'bg-neutral-800 text-white',
                          !nextSameSide && (isMe ? 'rounded-br-md' : 'rounded-bl-md'),
                        )}
                      >
                        {m.text}
                      </p>
                      {m.failed && <CircleAlert className="size-5 shrink-0 text-red-500" aria-label="전송 실패" />}
                    </div>
                  )}
                  {m.failed && <span className="px-1 text-[11px] text-red-500">전송되지 않음</span>}
                  {m.time && <span className="px-1 text-[11px] text-neutral-500">{m.time}</span>}
                </div>
              </Fragment>
            )
          })}
        </AppBody>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="문자" large />
      <AppBody>
        {timeline.messages.length === 0 ? (
          <EmptyState icon={<MessageCircle className="size-12" />} title="메시지 없음" />
        ) : (
          <ul className="flex flex-col">
            {timeline.messages.map((c) => {
              const last = c.messages[c.messages.length - 1]
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(c.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-white/5"
                  >
                    <span
                      className="flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                      style={{ backgroundColor: c.color }}
                    >
                      {c.name.slice(0, 1)}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col border-b border-white/10 pb-3">
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{c.name}</span>
                        <span className="flex shrink-0 items-center text-xs text-neutral-500">
                          {last && listLabel(last.date, timeline.id)}
                          <ChevronRight className="size-4" />
                        </span>
                      </span>
                      <span className="line-clamp-2 text-sm text-neutral-400">{last?.text}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </AppBody>
    </div>
  )
}
