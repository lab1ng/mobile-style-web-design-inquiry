'use client'

import { useEffect, useEffectEvent, useState, type ReactNode } from 'react'
import { Ellipsis, Grip, MicOff, Phone, PhoneOff, Video, Volume2 } from 'lucide-react'
import type { Contact } from '@/lib/timelines'
import type { CallLine } from './use-suho-story'

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
  script: CallLine[]
  onAnswer: () => void
  onEnd: () => void
}

const TYPE_MS = 140
const LINE_HOLD_MS = 1600
const FIRST_LINE_DELAY = 1500
const END_DELAY = 1800

function useTypedScript(script: CallLine[], running: boolean, onFinish: () => void) {
  const [index, setIndex] = useState(-1)
  const [chars, setChars] = useState(0)
  const finish = useEffectEvent(onFinish)

  useEffect(() => {
    if (!running) return
    let cancelled = false
    const timers: number[] = []
    const wait = (ms: number) => new Promise<void>((r) => timers.push(window.setTimeout(r, ms)))

    ;(async () => {
      await wait(FIRST_LINE_DELAY)
      for (let i = 0; i < script.length; i++) {
        if (cancelled) return
        const line = script[i]
        setIndex(i)
        setChars(0)
        if (line.note) await wait(line.text ? 1400 : 0)
        const text = line.text ?? ''
        for (let c = 1; c <= text.length; c++) {
          if (cancelled) return
          setChars(c)
          await wait(TYPE_MS)
        }
        await wait(line.hold ?? LINE_HOLD_MS)
      }
      await wait(END_DELAY)
      if (!cancelled) finish()
    })()

    return () => {
      cancelled = true
      timers.forEach(window.clearTimeout)
    }
  }, [running, script])

  return { line: index >= 0 ? script[index] : null, typed: index >= 0 ? (script[index].text ?? '').slice(0, chars) : '' }
}

export function StoryCallScreen({ contact, connected, script, onAnswer, onEnd }: StoryCallProps) {
  const [elapsed, setElapsed] = useState(0)
  const { line, typed } = useTypedScript(script, connected, onEnd)

  useEffect(() => {
    if (!connected) return
    const tick = window.setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => window.clearInterval(tick)
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
        {connected && line && (
          <div aria-live="polite" className="flex min-h-28 flex-col items-center gap-2 text-center">
            <span className="text-[13px] font-medium text-white/50">{line.from === 'me' ? '나' : contact.name}</span>
            {line.note && <span className="text-[15px] text-white/60">{`(${line.note})`}</span>}
            {line.text !== undefined && (
              <p className="text-2xl font-medium leading-relaxed text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">
                {typed}
                <span className="ml-0.5 inline-block h-6 w-[2px] translate-y-1 animate-pulse bg-white/80" aria-hidden="true" />
              </p>
            )}
          </div>
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
