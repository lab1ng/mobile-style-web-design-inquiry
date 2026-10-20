'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Ellipsis, Grip, MicOff, Phone, PhoneOff, Video, Volume2 } from 'lucide-react'
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

function formatElapsed(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

type StoryCallProps = {
  contact: Contact
  connected: boolean
  line: string
  onAnswer: () => void
  onEnd: () => void
}

export function StoryCallScreen({ contact, connected, line, onAnswer, onEnd }: StoryCallProps) {
  const [elapsed, setElapsed] = useState(0)
  const [showLine, setShowLine] = useState(false)

  useEffect(() => {
    if (!connected) return
    const tick = window.setInterval(() => setElapsed((s) => s + 1), 1000)
    const reveal = window.setTimeout(() => setShowLine(true), 2000)
    return () => {
      window.clearInterval(tick)
      window.clearTimeout(reveal)
    }
  }, [connected])

  return (
    <div
      role="dialog"
      aria-label={connected ? `${contact.name}와 통화 중` : `${contact.name}에게서 전화 옴`}
      className="absolute inset-0 z-[35] flex flex-col bg-gradient-to-b from-[#56606a] via-[#6a4c37] to-[#3a3430] text-white animate-in fade-in slide-in-from-top-6 duration-500"
    >
      <div className="flex flex-col items-center px-6 pt-36 text-center">
        <p className="text-[17px] tabular-nums text-white/60" aria-live="polite">
          {connected ? formatElapsed(elapsed) : '휴대전화'}
        </p>
        <h2 className="mt-1 text-[40px] font-semibold leading-tight text-balance">{contact.name}</h2>
      </div>

      <div className="flex flex-1 items-center justify-center px-8">
        {connected && showLine && (
          <p
            aria-live="polite"
            className="text-center text-2xl font-medium leading-relaxed text-white text-balance animate-in fade-in slide-in-from-bottom-2 duration-1000 [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]"
          >
            {`'${line}'`}
          </p>
        )}
      </div>

      {connected ? (
        <div className="grid grid-cols-3 gap-x-6 gap-y-7 px-10 pb-16">
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
      ) : (
        <div className="flex justify-center pb-24">
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={onAnswer}
              aria-label="전화 받기"
              className="flex size-[76px] animate-pulse items-center justify-center rounded-full bg-[#34c759] transition-transform active:scale-95"
            >
              <Phone className="size-8 fill-white text-white" />
            </button>
            <span className="text-[15px]" aria-hidden="true">
              응답
            </span>
          </div>
        </div>
      )}
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
