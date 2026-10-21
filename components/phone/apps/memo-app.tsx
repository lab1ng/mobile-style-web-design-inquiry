'use client'

import { Lock, NotebookPen } from 'lucide-react'
import { useState } from 'react'
import type { Memo, Timeline } from '@/lib/timelines'
import { AppBody, AppHeader, EmptyState } from '../app-shell'
import { PasscodeScreen } from '../passcode-screen'

function heading(memo: Memo) {
  return memo.title || memo.body.split('\n')[0]
}

export function MemoApp({ timeline }: { timeline: Timeline }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [unlocked, setUnlocked] = useState(false)
  const memo = timeline.memos.find((m) => m.id === openId)

  const close = () => {
    setOpenId(null)
    setUnlocked(false)
  }

  if (memo) {
    if (memo.passcode && !unlocked) {
      return (
        <PasscodeScreen
          title="이 메모는 잠겨 있습니다"
          passcode={memo.passcode}
          backLabel="메모"
          onBack={close}
          onUnlock={() => setUnlocked(true)}
        />
      )
    }
    return (
      <div className="flex h-full flex-col animate-in slide-in-from-right-10 fade-in duration-200">
        <AppHeader title="" onBack={close} backLabel="메모" />
        <AppBody className="px-5 py-2 pb-8">
          <p className="text-center text-xs text-neutral-500">{memo.updated}</p>
          {memo.title && <h2 className="mt-3 text-2xl font-bold">{memo.title}</h2>}
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
                  className="flex min-h-14 w-full flex-col px-4 py-3 text-left active:bg-white/5"
                >
                  <span className="flex items-center gap-1.5 font-semibold">
                    {m.passcode && <Lock className="size-4 shrink-0 text-neutral-400" aria-hidden />}
                    <span className="truncate">{m.passcode ? '잠긴 메모' : heading(m)}</span>
                  </span>
                  <span className="truncate text-sm text-neutral-400">
                    <span className="mr-2 text-neutral-300">{m.updated}</span>
                    {m.passcode
                      ? '잠김'
                      : m.title
                        ? m.body.split('\n')[0] || '추가 텍스트 없음'
                        : m.body.split('\n')[1] || '추가 텍스트 없음'}
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
