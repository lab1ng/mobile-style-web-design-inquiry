'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Ellipsis, Grip, MicOff, PhoneOff, Video, Volume2 } from 'lucide-react'
import type { Contact } from '@/lib/timelines'

function CallControl({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2" aria-hidden="true">
      <div className="flex size-[76px] items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-md">
        {icon}
      </div>
      <span className="text-[15px]">{label}</span>
    </div>
  )
}

export function CallScreen({ contact, onEnd }: { contact: Contact; onEnd: () => void }) {
  const [status, setStatus] = useState('연결 중...')

  useEffect(() => {
    const timer = window.setTimeout(() => setStatus('호출 중...'), 2500)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div
      role="dialog"
      aria-label={`${contact.name}에게 전화 거는 중`}
      className="absolute inset-0 z-[15] flex flex-col bg-gradient-to-b from-[#56606a] via-[#6a4c37] to-[#3a3430] text-white animate-in fade-in slide-in-from-bottom-6 duration-300"
    >
      <div className="flex flex-col items-center px-6 pt-36 text-center">
        <p className="animate-pulse text-[17px] text-white/60" aria-live="polite">
          {status}
        </p>
        <h2 className="mt-1 text-[40px] font-semibold leading-tight text-balance">{contact.name}</h2>
        <p className="mt-1 text-xl text-white/60">{contact.label}</p>
      </div>

      <div className="mt-auto grid grid-cols-3 gap-x-6 gap-y-7 px-10 pb-16">
        <CallControl icon={<Volume2 className="size-8" />} label="스피커" />
        <CallControl icon={<Video className="size-8 opacity-60" />} label="FaceTime" />
        <CallControl icon={<MicOff className="size-8" />} label="소리 끔" />
        <CallControl icon={<Ellipsis className="size-8" />} label="더 보기" />
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onEnd}
            aria-label="통화 종료"
            className="flex size-[76px] items-center justify-center rounded-full bg-[#e5342b] ring-1 ring-red-300/50 transition-transform active:scale-95"
          >
            <PhoneOff className="size-8 fill-white" />
          </button>
          <span className="text-[15px]" aria-hidden="true">
            종료
          </span>
        </div>
        <CallControl icon={<Grip className="size-8" />} label="키패드" />
      </div>
    </div>
  )
}
