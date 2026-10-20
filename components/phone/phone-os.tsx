'use client'

import { useState } from 'react'
import { getTimeline, TIMELINES } from '@/lib/timelines'
import { StatusBar } from './status-bar'
import { HomeScreen } from './home-screen'
import { SequenceOverlay, type Sequence } from './sequence-overlay'
import { APPS, type AppId } from './apps-registry'
import { PlaceholderApp } from './apps/placeholder-app'
import { MessagesApp } from './apps/messages-app'
import { PhotosApp } from './apps/photos-app'
import { MemoApp } from './apps/memo-app'
import { PhoneApp } from './apps/phone-app'
import { NaverApp } from './apps/naver-app'
import { CalendarApp } from './apps/calendar-app'

export function PhoneOS() {
  const [timelineId, setTimelineId] = useState(TIMELINES[0].id)
  const [openApp, setOpenApp] = useState<AppId | null>(null)
  const [sequence, setSequence] = useState<Sequence | null>(null)

  const timeline = getTimeline(timelineId)

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
        return <PhoneApp timeline={timeline} />
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
      case 'instagram':
      case 'ebsi':
      case 'todo':
      case 'kakao':
        return <PlaceholderApp app={APPS[openApp]} />
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
        <div
          key={openApp}
          className="absolute inset-0 z-10 flex flex-col bg-neutral-950 animate-in fade-in zoom-in-90 duration-300"
        >
          <div className="h-12 shrink-0" />
          <div className="relative min-h-0 flex-1">{renderApp()}</div>
          <div className="h-8 shrink-0" />
        </div>
      )}

      <StatusBar time={timeline.time} />

      <button
        type="button"
        onClick={() => setOpenApp(null)}
        aria-label="홈으로"
        disabled={!isAppOpen}
        className="absolute bottom-0 left-1/2 z-30 flex h-8 w-44 -translate-x-1/2 items-center justify-center disabled:pointer-events-none"
      >
        <span className="h-1.5 w-32 rounded-full bg-white/80" />
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
