'use client'

import { ChevronRight, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Timeline } from '@/lib/timelines'
import { AppBody, AppHeader, EmptyState } from '../app-shell'

export function MessagesApp({ timeline }: { timeline: Timeline }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const convo = timeline.messages.find((c) => c.id === openId)

  if (convo) {
    return (
      <div className="flex h-full flex-col animate-in slide-in-from-right-10 fade-in duration-200">
        <AppHeader title={convo.name} onBack={() => setOpenId(null)} backLabel="메시지" />
        <AppBody className="flex flex-col gap-2 px-4 py-4">
          {convo.messages.map((m, i) => (
            <div key={i} className={cn('flex flex-col gap-0.5', m.from === 'me' ? 'items-end' : 'items-start')}>
              <p
                className={cn(
                  'max-w-[75%] rounded-2xl px-3.5 py-2 text-[15px] leading-snug',
                  m.from === 'me' ? 'rounded-br-md bg-sky-500 text-white' : 'rounded-bl-md bg-neutral-800 text-white',
                )}
              >
                {m.text}
              </p>
              <span className="px-1 text-[11px] text-neutral-500">{m.time}</span>
            </div>
          ))}
        </AppBody>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="메시지" large />
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
                        <span className="flex items-center text-xs text-neutral-500">
                          {last?.time}
                          <ChevronRight className="size-4" />
                        </span>
                      </span>
                      <span className="truncate text-sm text-neutral-400">{last?.text}</span>
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
