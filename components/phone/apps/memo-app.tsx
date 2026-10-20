'use client'

import { NotebookPen } from 'lucide-react'
import { useState } from 'react'
import type { Timeline } from '@/lib/timelines'
import { AppBody, AppHeader, EmptyState } from '../app-shell'

export function MemoApp({ timeline }: { timeline: Timeline }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const memo = timeline.memos.find((m) => m.id === openId)

  if (memo) {
    return (
      <div className="flex h-full flex-col animate-in slide-in-from-right-10 fade-in duration-200">
        <AppHeader title="" onBack={() => setOpenId(null)} backLabel="메모" />
        <AppBody className="px-5 py-2">
          <p className="text-center text-xs text-neutral-500">{memo.updated}</p>
          <h2 className="mt-3 text-2xl font-bold">{memo.title}</h2>
          <p className="mt-3 whitespace-pre-line text-[17px] leading-relaxed text-neutral-200">{memo.body}</p>
        </AppBody>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="메모" large />
      <AppBody className="px-4">
        {timeline.memos.length === 0 ? (
          <EmptyState icon={<NotebookPen className="size-12" />} title="메모 없음" />
        ) : (
          <ul className="overflow-hidden rounded-xl bg-neutral-900">
            {timeline.memos.map((m) => (
              <li key={m.id} className="border-b border-white/10 last:border-0">
                <button
                  type="button"
                  onClick={() => setOpenId(m.id)}
                  className="flex w-full flex-col px-4 py-3 text-left active:bg-white/5"
                >
                  <span className="font-semibold">{m.title}</span>
                  <span className="truncate text-sm text-neutral-400">
                    <span className="mr-2 text-neutral-300">{m.updated}</span>
                    {m.body ? m.body.split('\n')[0] : '추가 텍스트 없음'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </AppBody>
    </div>
  )
}
