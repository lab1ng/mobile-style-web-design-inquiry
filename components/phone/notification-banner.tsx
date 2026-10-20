'use client'

import { MessageCircle } from 'lucide-react'

type Props = { title: string; body: string; onOpen: () => void }

export function NotificationBanner({ title, body, onOpen }: Props) {
  return (
    <div className="absolute inset-x-2 top-12 z-40 animate-in slide-in-from-top-8 fade-in duration-500" role="status">
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center gap-3 rounded-[1.4rem] bg-neutral-800/80 px-3.5 py-3 text-left shadow-2xl ring-1 ring-white/10 backdrop-blur-2xl active:scale-[0.98] transition-transform"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[0.65rem] bg-gradient-to-b from-[#5bf675] to-[#0cbd2a]">
          <MessageCircle className="size-6 fill-white text-white" aria-hidden="true" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="flex items-center justify-between gap-2">
            <span className="truncate text-[15px] font-semibold">{title}</span>
            <span className="shrink-0 text-xs text-white/50">지금</span>
          </span>
          <span className="truncate text-[15px] text-white/90">{body}</span>
        </span>
      </button>
    </div>
  )
}
