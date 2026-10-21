'use client'

import { Delete, Lock } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { AppHeader } from './app-shell'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'] as const

type Props = {
  title: string
  passcode: string
  backLabel: string
  onBack: () => void
  onUnlock: () => void
}

export function PasscodeScreen({ title, passcode, backLabel, onBack, onUnlock }: Props) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  const press = (key: string) => {
    if (key === 'del') {
      setInput((v) => v.slice(0, -1))
      return
    }
    const next = (input + key).slice(0, 4)
    setError(false)
    if (next.length < 4) {
      setInput(next)
      return
    }
    setInput('')
    if (next === passcode) onUnlock()
    else setError(true)
  }

  return (
    <div className="flex h-full flex-col animate-in fade-in duration-200">
      <AppHeader title="" onBack={onBack} backLabel={backLabel} />
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-8 pb-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <Lock className="size-8 text-neutral-400" aria-hidden />
          <p className="text-lg font-semibold text-balance">{title}</p>
          <p className={cn('h-5 text-sm', error ? 'text-red-400' : 'text-neutral-500')} role="status">
            {error ? '암호가 올바르지 않습니다' : '암호 4자리를 입력하세요'}
          </p>
          <div className={cn('mt-1 flex gap-4', error && 'animate-in slide-in-from-left-2 duration-150')} aria-hidden>
            {Array.from({ length: 4 }, (_, i) => (
              <span
                key={i}
                className={cn('size-3.5 rounded-full border border-neutral-300', i < input.length && 'bg-neutral-100')}
              />
            ))}
          </div>
        </div>
        <div className="grid w-full max-w-[270px] grid-cols-3 gap-x-6 gap-y-4">
          {KEYS.map((key, i) =>
            key === '' ? (
              <span key={i} />
            ) : key === 'del' ? (
              <button
                key={i}
                type="button"
                onClick={() => press('del')}
                disabled={input.length === 0}
                className="flex aspect-square items-center justify-center rounded-full text-neutral-300 active:bg-neutral-800 disabled:opacity-30"
                aria-label="지우기"
              >
                <Delete className="size-6" />
              </button>
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => press(key)}
                className="flex aspect-square items-center justify-center rounded-full bg-neutral-800 text-3xl font-light active:bg-neutral-600"
              >
                {key}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  )
}
