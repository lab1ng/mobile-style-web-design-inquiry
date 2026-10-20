'use client'

import { useState } from 'react'
import { getTimeline, TIMELINES, type Contact } from '@/lib/timelines'
import { SwipeBack } from './swipe-back'
import { CallScreen } from './call-screen'
import type { PlacedCall } from './apps/phone-app'
import { StatusBar } from './status-bar'
import { HomeScreen } from './home-screen'
import { SequenceOverlay, type Sequence } from './sequence-overlay'
import type { AppId } from './apps-registry'
import { InstagramApp } from './apps/instagram-app'
import { MessagesApp } from './apps/messages-app'
import { PhotosApp } from './apps/photos-app'
import { MemoApp } from './apps/memo-app'
import { PhoneApp } from './apps/phone-app'
import { NaverApp } from './apps/naver-app'
import { CalendarApp } from './apps/calendar-app'
import { MusicApp } from './apps/music-app'
import { ClockApp } from './apps/clock-app'
import { EbsiApp } from './apps/ebsi-app'

const APP_BACKGROUNDS: Partial<Record<AppId, string>> = {
  phone: 'bg-black',
  instagram: 'bg-[#0c1014]',
  clock: 'bg-black',
  ebsi: 'bg-white',
  music: 'bg-gradient-to-b from-[#5b5b5f] via-[#2f2f31] to-[#141414]',
}

export function PhoneOS() {
  const [timelineId, setTimelineId] = useState(TIMELINES[0].id)
  const [openApp, setOpenApp] = useState<AppId | null>(null)
  const [sequence, setSequence] = useState<Sequence | null>(null)
  const [activeCall, setActiveCall] = useState<Contact | null>(null)
  const [placedCalls, setPlacedCalls] = useState<Record<string, PlacedCall[]>>({})

  const timeline = getTimeline(timelineId)

  const endCall = () => {
    if (!activeCall) return
    const contactId = activeCall.id
    setPlacedCalls((prev) => {
      const list = prev[timelineId] ?? []
      const [first, ...rest] = list
      const next =
        first?.contactId === contactId
          ? [{ ...first, count: first.count + 1 }, ...rest]
          : [{ contactId, count: 1 }, ...list]
      return { ...prev, [timelineId]: next }
    })
    setActiveCall(null)
  }

  const travel = (targetId: string, withCountdown: boolean) => {
    setSequence({ targetId, withCountdown, key: Date.now() })
  }

  const renderApp = () => {
    switch (openApp) {
      case 'messages':
        return <MessagesApp timeline={timeline} />
      case 'photos':
        return <PhotosApp timeline={timeline} />
      case 'memo':
        return <MemoApp timeline={timeline} />
      case 'phone':
        return (
          <PhoneApp
            timeline={timeline}
            placedCalls={placedCalls[timelineId] ?? []}
            onCall={setActiveCall}
          />
        )
      case 'naver':
        return (
          <NaverApp
            timeline={timeline}
            onPlayVideo={(nextId) => travel(nextId, true)}
          />
        )
      case 'calendar':
        return (
          <CalendarApp
            key={timeline.id}
            timeline={timeline}
            onTravel={(targetId) => travel(targetId, false)}
          />
        )
      case 'music':
        return <MusicApp timeline={timeline} />
      case 'clock':
        return <ClockApp timeline={timeline} />
      case 'ebsi':
        return <EbsiApp />
      case 'instagram':
        return <InstagramApp key={timeline.id} profile={timeline.instagram} />
      default:
        return null
    }
  }

  const isAppOpen = openApp !== null

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black text-white sm:h-[844px] sm:w-[390px] sm:rounded-[3.25rem] sm:border-[12px] sm:border-neutral-950 sm:shadow-2xl sm:ring-1 sm:ring-neutral-700">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-2.5 left-1/2 z-40 hidden h-8 w-28 -translate-x-1/2 rounded-full bg-black sm:block"
      />

      <HomeScreen timeline={timeline} onOpenApp={setOpenApp} hidden={isAppOpen} />

      {isAppOpen && (
        <SwipeBack
          key={openApp}
          onBack={() => setOpenApp(null)}
          disabled={activeCall !== null || sequence !== null}
          className="absolute inset-0 z-10"
        >
          <div
            className={`flex h-full flex-col animate-in fade-in zoom-in-90 duration-300 ${APP_BACKGROUNDS[openApp] ?? 'bg-neutral-950'}`}
          >
            <div className="h-12 shrink-0" />
            <div className="relative min-h-0 flex-1">{renderApp()}</div>
            <div className="h-8 shrink-0" />
          </div>
        </SwipeBack>
      )}

      {activeCall && <CallScreen contact={activeCall} onEnd={endCall} />}

      <StatusBar time={timeline.time} dark={openApp === 'ebsi' && !activeCall} />

      <button
        type="button"
        onClick={() => setOpenApp(null)}
        aria-label="홈으로"
        disabled={!isAppOpen || activeCall !== null}
        className="absolute bottom-0 left-1/2 z-30 flex h-8 w-44 -translate-x-1/2 items-center justify-center disabled:pointer-events-none"
      >
        <span className={`h-1.5 w-32 rounded-full ${openApp === 'ebsi' ? 'bg-neutral-900/80' : 'bg-white/80'}`} />
      </button>

      {sequence && (
        <SequenceOverlay
          key={sequence.key}
          sequence={sequence}
          videoThumbnail={timeline.naver.video?.thumbnail}
          onSwitch={() => {
            setTimelineId(sequence.targetId)
            setOpenApp(null)
          }}
          onDone={() => setSequence(null)}
        />
      )}
    </div>
  )
}
