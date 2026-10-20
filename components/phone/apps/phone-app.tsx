'use client'

import { useRef, useState, type ReactNode } from 'react'
import {
  CircleUserRound,
  Clock,
  Delete,
  Grip,
  Info,
  Phone,
  PhoneOutgoing,
  Plus,
  Star,
  User,
  Voicemail,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Call, Contact, Timeline } from '@/lib/timelines'
import { AppBody, EmptyState } from '../app-shell'

export type PlacedCall = { contactId: string; count: number }
type Tab = 'favorites' | 'recents' | 'contacts' | 'keypad' | 'voicemail'

type Props = {
  timeline: Timeline
  placedCalls: PlacedCall[]
  onCall: (contact: Contact) => void
}

export function PhoneApp({ timeline, placedCalls, onCall }: Props) {
  const [tab, setTab] = useState<Tab>('recents')
  const { favorites, recents, speedDial } = timeline.phone

  const findContact = (id: string) => favorites.find((c) => c.id === id)

  const placedEntries: Call[] = placedCalls.flatMap((p, i) => {
    const contact = findContact(p.contactId)
    if (!contact) return []
    return [
      {
        id: `placed-${i}`,
        name: contact.name,
        subtitle: contact.label,
        time: toKoreanTime(timeline.time),
        type: 'missed' as const,
        count: p.count,
      },
    ]
  })

  return (
    <div className="flex h-full flex-col bg-black">
      <div className="min-h-0 flex-1">
        {tab === 'favorites' && <Favorites favorites={favorites} onCall={onCall} />}
        {tab === 'recents' && <Recents calls={[...placedEntries, ...recents]} />}
        {tab === 'keypad' && (
          <Keypad
            onSpeedDial={(digit) => {
              const contact = speedDial[digit] ? findContact(speedDial[digit]) : undefined
              if (contact) onCall(contact)
              return Boolean(contact)
            }}
          />
        )}
      </div>
      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}

function toKoreanTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const period = h < 12 ? '오전' : '오후'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${period} ${hour}:${String(m).padStart(2, '0')}`
}

function initialsOf(name: string) {
  if (/\d/.test(name)) return null
  return name.length === 3 ? name.slice(1) : name.slice(0, 2)
}

function Avatar({ name }: { name: string }) {
  const initials = initialsOf(name)
  return (
    <div
      aria-hidden="true"
      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#6b6585] to-[#2b2740] text-base font-bold"
    >
      {initials ?? <User className="size-6 fill-white/80 text-white/80" />}
    </div>
  )
}

function Pill({ children, round }: { children: ReactNode; round?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex h-11 items-center justify-center rounded-full bg-neutral-900 text-[17px] ring-1 ring-white/10',
        round ? 'w-11' : 'px-4',
      )}
    >
      {children}
    </span>
  )
}

function InfoBadge() {
  return (
    <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-900">
      <Info className="size-5 text-[#3b8cff]" />
    </span>
  )
}

function ScreenHeader({ title, plus }: { title: string; plus?: boolean }) {
  return (
    <header className="shrink-0 px-4 pt-1">
      <div className="flex items-center justify-between">
        <Pill>편집</Pill>
        {plus ? (
          <Pill round>
            <Plus className="size-6" />
          </Pill>
        ) : (
          <span />
        )}
      </div>
      <h1 className="pt-3 pb-2 text-[34px] font-bold">{title}</h1>
    </header>
  )
}

function Favorites({ favorites, onCall }: { favorites: Contact[]; onCall: (c: Contact) => void }) {
  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title="즐겨찾기" plus />
      <AppBody>
        {favorites.length === 0 ? (
          <EmptyState icon={<Star className="size-12" />} title="즐겨찾기 없음" />
        ) : (
          <ul>
            {favorites.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onCall(c)}
                  className="flex w-full items-center gap-3 pl-4 text-left active:bg-white/10"
                >
                  <Avatar name={c.name} />
                  <div className="flex min-h-[72px] flex-1 items-center gap-3 border-b border-white/10 pr-4">
                    <div className="flex-1">
                      <p className="text-[17px] font-semibold">{c.name}</p>
                      <p className="flex items-center gap-1 text-[15px] text-neutral-500">
                        <Phone className="size-3.5 fill-neutral-500" aria-hidden="true" />
                        {c.label}
                      </p>
                    </div>
                    <InfoBadge />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </AppBody>
    </div>
  )
}

function Recents({ calls }: { calls: Call[] }) {
  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title="최근 통화" />
      <AppBody>
        {calls.length === 0 ? (
          <EmptyState icon={<Clock className="size-12" />} title="최근 통화 없음" />
        ) : (
          <ul>
            {calls.map((c) => {
              const missed = c.type === 'missed'
              return (
                <li key={c.id} className="flex items-center gap-3 pl-4">
                  <Avatar name={c.name} />
                  <div className="flex min-h-[64px] min-w-0 flex-1 items-center gap-2 border-b border-white/10 pr-4">
                    <div className="min-w-0 flex-1">
                      <p className={cn('truncate text-[17px] font-semibold', missed && 'text-[#ff453a]')}>
                        {c.name}
                        {c.count ? ` (${c.count})` : ''}
                      </p>
                      <p className="flex items-center gap-1 text-[15px] text-neutral-500">
                        {c.type === 'outgoing' && <PhoneOutgoing className="size-3.5" aria-label="발신" />}
                        {c.subtitle}
                      </p>
                    </div>
                    <span className="shrink-0 text-[15px] text-neutral-500">{c.time}</span>
                    <InfoBadge />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </AppBody>
    </div>
  )
}

const KEYS = [
  { digit: '1', letters: '' },
  { digit: '2', letters: 'ABC' },
  { digit: '3', letters: 'DEF' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
  { digit: '*', letters: '' },
  { digit: '0', letters: '+' },
  { digit: '#', letters: '' },
]

const LONG_PRESS_MS = 650

function Keypad({ onSpeedDial }: { onSpeedDial: (digit: string) => boolean }) {
  const [digits, setDigits] = useState('')

  return (
    <div className="flex h-full flex-col items-center">
      <div className="flex min-h-0 w-full flex-1 items-end justify-center px-6 pb-6">
        <p className="truncate text-[38px] tracking-wide" aria-live="polite">
          {digits}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-x-6 gap-y-4">
        {KEYS.map((k) => (
          <KeypadKey
            key={k.digit}
            digit={k.digit}
            letters={k.letters}
            onPress={() => setDigits((d) => (d + k.digit).slice(0, 20))}
            onLongPress={() => {
              if (onSpeedDial(k.digit)) setDigits('')
              else setDigits((d) => (d + k.digit).slice(0, 20))
            }}
          />
        ))}
        <span />
        <span
          aria-hidden="true"
          className="flex size-[78px] items-center justify-center rounded-full bg-[#2f7d3a] ring-1 ring-green-300/40"
        >
          <Phone className="size-9 fill-white text-white" />
        </span>
        {digits ? (
          <button
            type="button"
            onClick={() => setDigits((d) => d.slice(0, -1))}
            aria-label="지우기"
            className="flex size-[78px] items-center justify-center text-neutral-400 active:text-white"
          >
            <Delete className="size-8" />
          </button>
        ) : (
          <span />
        )}
      </div>
      <div className="h-4 shrink-0" />
    </div>
  )
}

function KeypadKey({
  digit,
  letters,
  onPress,
  onLongPress,
}: {
  digit: string
  letters: string
  onPress: () => void
  onLongPress: () => void
}) {
  const timer = useRef<number | null>(null)
  const firedLongPress = useRef(false)

  const clear = () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = null
  }

  return (
    <button
      type="button"
      aria-label={digit === '1' ? '1, 길게 누르면 단축번호' : digit}
      onPointerDown={() => {
        firedLongPress.current = false
        clear()
        timer.current = window.setTimeout(() => {
          firedLongPress.current = true
          timer.current = null
          onLongPress()
        }, LONG_PRESS_MS)
      }}
      onPointerUp={() => {
        if (timer.current !== null) {
          clear()
          onPress()
        }
      }}
      onPointerLeave={clear}
      onPointerCancel={clear}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onPress()
        }
      }}
      className="flex size-[78px] touch-manipulation select-none flex-col items-center justify-center rounded-full bg-neutral-900 ring-1 ring-white/10 transition-colors [-webkit-touch-callout:none] active:bg-neutral-600"
    >
      <span className={cn('leading-none', digit === '*' ? 'pt-3 text-[44px]' : 'text-[34px]')}>{digit}</span>
      {letters && <span className="text-[10px] font-semibold tracking-[0.2em]">{letters}</span>}
    </button>
  )
}

const TABS: { id: Tab; label: string; icon: ReactNode; interactive: boolean }[] = [
  { id: 'favorites', label: '즐겨찾기', icon: <Star className="size-6 fill-current" />, interactive: true },
  {
    id: 'recents',
    label: '최근 통화',
    icon: <Clock className="size-6 fill-current stroke-black" strokeWidth={2.5} />,
    interactive: true,
  },
  {
    id: 'contacts',
    label: '연락처',
    icon: <CircleUserRound className="size-6 fill-current stroke-black" strokeWidth={2} />,
    interactive: false,
  },
  { id: 'keypad', label: '키패드', icon: <Grip className="size-6" strokeWidth={3} />, interactive: true },
  { id: 'voicemail', label: '음성 사서함', icon: <Voicemail className="size-6" strokeWidth={2.5} />, interactive: false },
]

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav aria-label="전화 메뉴" className="shrink-0 px-3 pt-2">
      <div className="flex rounded-full bg-neutral-900/95 p-1 ring-1 ring-white/10">
        {TABS.map((t) => {
          const isActive = t.id === active
          const content = (
            <>
              {t.icon}
              <span className="text-[10px] font-medium">{t.label}</span>
            </>
          )
          const classes = cn(
            'flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-full',
            isActive ? 'bg-white/10 text-[#3b9cff]' : 'text-white',
          )
          return t.interactive ? (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              aria-current={isActive ? 'page' : undefined}
              className={classes}
            >
              {content}
            </button>
          ) : (
            <div key={t.id} aria-hidden="true" className={classes}>
              {content}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
