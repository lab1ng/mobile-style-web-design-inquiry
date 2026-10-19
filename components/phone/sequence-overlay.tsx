'use client'

import Image from 'next/image'
import { useEffect, useEffectEvent, useState } from 'react'
import { cn } from '@/lib/utils'

export type Sequence = { targetId: string; withCountdown: boolean; key: number }

type Phase = 'countdown' | 'glitch' | 'off' | 'boot' | 'reveal'

const COUNT_FROM = 5
const GLITCH_MS = 2400
const OFF_MS = 1200
const BOOT_MS = 2600
const REVEAL_MS = 700

type Props = {
  sequence: Sequence
  videoThumbnail?: string
  onSwitch: () => void
  onDone: () => void
}

export function SequenceOverlay({ sequence, videoThumbnail, onSwitch, onDone }: Props) {
  const [phase, setPhase] = useState<Phase>(sequence.withCountdown ? 'countdown' : 'glitch')
  const [count, setCount] = useState(COUNT_FROM)
  const [thumbnail] = useState(videoThumbnail)

  const handleSwitch = useEffectEvent(onSwitch)
  const handleDone = useEffectEvent(onDone)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    let t = 0
    const at = (delay: number, fn: () => void) => timers.push(setTimeout(fn, delay))

    if (sequence.withCountdown) {
      for (let i = 1; i < COUNT_FROM; i++) at(i * 1000, () => setCount(COUNT_FROM - i))
      t = COUNT_FROM * 1000
      at(t, () => setPhase('glitch'))
    }
    t += GLITCH_MS
    at(t, () => setPhase('off'))
    at(t + 700, () => handleSwitch())
    t += OFF_MS
    at(t, () => setPhase('boot'))
    t += BOOT_MS
    at(t, () => setPhase('reveal'))
    t += REVEAL_MS
    at(t, () => handleDone())

    return () => timers.forEach(clearTimeout)
  }, [sequence.withCountdown])

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'absolute inset-0 z-50 overflow-hidden bg-black transition-opacity',
        phase === 'reveal' ? 'opacity-0 duration-700' : 'opacity-100',
      )}
    >
      {phase === 'countdown' && <Countdown count={count} thumbnail={thumbnail} />}
      {phase === 'glitch' && <GlitchScreen targetId={sequence.targetId} />}
      {phase === 'off' && <PowerOff />}
      {(phase === 'boot' || phase === 'reveal') && <BootScreen />}
    </div>
  )
}

function Countdown({ count, thumbnail }: { count: number; thumbnail?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {thumbnail && (
        <Image
          src={thumbnail}
          alt=""
          fill
          sizes="(min-width: 640px) 390px, 100vw"
          className="animate-slow-zoom object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/55" />
      <p className="relative text-sm font-medium tracking-[0.3em] text-amber-200/90">
        HAPPY NEW YEAR
      </p>
      <p
        key={count}
        className="animate-count-pop relative text-[10rem] font-black leading-none tabular-nums text-white drop-shadow-[0_0_30px_rgba(253,230,138,0.6)]"
      >
        {count}
      </p>
      <p className="relative mt-4 text-sm text-white/70">2024 → 2025</p>
    </div>
  )
}

function GlitchScreen({ targetId }: { targetId: string }) {
  return (
    <div className="animate-glitch-shake absolute inset-0 flex flex-col items-center justify-center bg-[#0a0000] px-8 text-center">
      <div className="animate-glitch-bars pointer-events-none absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-1/4 h-6 translate-x-6 bg-red-500/40 mix-blend-screen" />
      <div className="pointer-events-none absolute inset-x-0 top-2/3 h-3 -translate-x-8 bg-cyan-400/40 mix-blend-screen" />
      <div className="scanlines pointer-events-none absolute inset-0" />

      <div className="animate-flicker relative flex flex-col items-center gap-4">
        <p
          className="text-4xl font-black text-white"
          style={{ textShadow: '3px 0 #ff0040, -3px 0 #00e5ff' }}
        >
          시스템 오류
        </p>
        <p className="font-mono text-xs leading-relaxed text-red-300/90">
          {'FATAL: TIME_SYNC_EXCEPTION'}
          <br />
          {`at clock.resolve(${targetId})`}
          <br />
          {'code 0x00000522'}
        </p>
        <p className="text-sm text-white/60">기기를 다시 시작합니다...</p>
      </div>
    </div>
  )
}

function PowerOff() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <div className="animate-crt-off absolute inset-0 bg-neutral-200" />
    </div>
  )
}

function BootScreen() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-10 bg-black animate-in fade-in duration-700">
      <div className="flex size-20 items-center justify-center rounded-full border-2 border-white/90">
        <div className="size-10 rounded-full bg-white/90" />
      </div>
      <div className="h-1 w-32 overflow-hidden rounded-full bg-white/20">
        <div className="animate-boot-progress h-full w-full rounded-full bg-white" />
      </div>
    </div>
  )
}
