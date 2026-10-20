'use client'

import Image from 'next/image'
import { useEffect, useEffectEvent, useState } from 'react'
import { cn } from '@/lib/utils'

export type Sequence = { targetId: string; withCountdown: boolean; key: number }

type Phase = 'news' | 'bsod' | 'black' | 'boot' | 'reveal'

const COUNT_FROM = 5
const BSOD_MS = 3200
const BLACK_MS = 1400
const BOOT_MS = 2600
const REVEAL_MS = 700

type Props = {
  sequence: Sequence
  videoThumbnail?: string
  onSwitch: () => void
  onDone: () => void
}

export function SequenceOverlay({ sequence, videoThumbnail, onSwitch, onDone }: Props) {
  const [phase, setPhase] = useState<Phase>(sequence.withCountdown ? 'news' : 'bsod')
  const [count, setCount] = useState(COUNT_FROM)
  const [thumbnail] = useState(videoThumbnail)

  const handleSwitch = useEffectEvent(onSwitch)
  const handleDone = useEffectEvent(onDone)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    let t = 0
    const at = (delay: number, fn: () => void) => timers.push(setTimeout(fn, delay))

    if (sequence.withCountdown) {
      for (let i = 1; i <= COUNT_FROM; i++) at(i * 1000, () => setCount(COUNT_FROM - i))
      t = COUNT_FROM * 1000 + 600
      at(t, () => setPhase('bsod'))
    }
    t += BSOD_MS
    at(t, () => setPhase('black'))
    at(t + 600, () => handleSwitch())
    t += BLACK_MS
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
      {phase === 'news' && <LiveNews count={count} thumbnail={thumbnail} />}
      {phase === 'bsod' && <BlueScreen targetId={sequence.targetId} />}
      {phase === 'black' && <div className="absolute inset-0 bg-black" />}
      {(phase === 'boot' || phase === 'reveal') && <BootScreen />}
    </div>
  )
}

const TICKER =
  '속보 · 전국 주요 타종 행사장 인파 몰려 · 보신각 일대 교통 통제 중 · 새해 첫 일출 명소 기상 양호 · 해맞이 열차 매진 · '

function LiveNews({ count, thumbnail }: { count: number; thumbnail?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-neutral-950 text-white">
      <div className="relative flex-1 overflow-hidden">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes="(min-width: 640px) 390px, 100vw"
            className="animate-slow-zoom object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />

        <div className="relative flex items-center justify-between px-4 pt-14">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-sm bg-red-600 px-2 py-0.5 text-xs font-bold tracking-wider">
              <span className="size-1.5 animate-pulse rounded-full bg-white" />
              LIVE
            </span>
            <span className="text-xs font-semibold text-white/90">KBN 뉴스</span>
          </div>
          <span className="text-xs tabular-nums text-white/80">PM 11:59</span>
        </div>

        <div className="relative flex h-full flex-col items-center justify-center pb-40">
          <p className="text-xs font-medium tracking-[0.3em] text-white/70">2025 새해까지</p>
          <p
            key={count}
            className="animate-count-pop text-[8rem] font-black leading-none tabular-nums drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
          >
            {count > 0 ? count : '0'}
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-stretch">
          <span className="flex items-center bg-red-600 px-3 text-sm font-black">생중계</span>
          <div className="flex-1 bg-white px-3 py-2.5 text-neutral-950">
            <p className="text-[15px] font-bold leading-snug text-balance">
              {'보신각 제야의 종 타종 행사 현장 연결'}
            </p>
            <p className="text-xs text-neutral-600">서울 종로구 · 2024.12.31</p>
          </div>
        </div>
        <div className="flex overflow-hidden bg-neutral-900 py-2 pb-8">
          <span className="z-10 shrink-0 bg-neutral-900 px-3 text-xs font-bold text-yellow-400">
            NEWS
          </span>
          <div className="animate-ticker flex shrink-0 whitespace-nowrap text-xs text-white/90">
            <span>{TICKER}</span>
            <span>{TICKER}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function makeDumpLines(seed: number, total: number) {
  let s = seed
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s
  }
  const hex = (n: number, len: number) => n.toString(16).toUpperCase().padStart(len, '0').slice(-len)
  const ops = ['clock.resolve', 'time_sync', 'kern.epoch', 'rtc.drift', 'mem.page', 'sys.restore']
  return Array.from({ length: total }, () => {
    const op = ops[rand() % ops.length]
    return `0x${hex(rand(), 8)} ${hex(rand(), 8)} ${op}+0x${hex(rand(), 3)}`
  })
}

function BlueScreen({ targetId }: { targetId: string }) {
  const [lines] = useState(() => makeDumpLines(targetId.length * 7919 + 13, 140))
  const [visible, setVisible] = useState(0)
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setVisible((v) => Math.min(v + 2, lines.length))
      setPercent((p) => Math.min(p + 1, 100))
    }, 22)
    return () => clearInterval(id)
  }, [lines.length])

  return (
    <div className="absolute inset-0 flex flex-col bg-[#0a4bd6] px-6 pb-8 pt-16 text-white">
      <p className="text-6xl font-light">{':('}</p>
      <p className="mt-5 text-[15px] leading-relaxed text-pretty">
        기기에 문제가 발생하여 다시 시작해야 합니다. 오류 정보를 수집하고 있습니다.
      </p>
      <p className="mt-3 text-sm tabular-nums">{percent}% 완료</p>
      <div className="mt-3 font-mono text-[11px] leading-tight text-white/90">
        <p>STOP CODE: TIME_SYNC_EXCEPTION</p>
        <p>{`FAILED: clock.resolve(${targetId})`}</p>
      </div>
      <div className="relative mt-3 flex-1 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 flex flex-col font-mono text-[10px] leading-[1.35] text-white/75">
          {lines.slice(0, visible).map((line, i) => (
            <p key={i} className="truncate">
              {line}
            </p>
          ))}
        </div>
      </div>
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
      <p className="text-xs text-white/50">다시 시작하는 중...</p>
    </div>
  )
}
