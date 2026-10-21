'use client'

import { useState } from 'react'
import { getTimeline, TIMELINES, type Contact } from '@/lib/timelines'
import { SwipeBack } from './swipe-back'
import { CallScreen, StoryCallScreen } from './call-screen'
import { ConfirmDialog } from './confirm-dialog'
import { NotificationBanner } from './notification-banner'
import { CALL_SCRIPT, STORY_CONVO_ID, STORY_DATE, useFutureChat, useSuhoStory } from './use-suho-story'
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

  const [lastChance, setLastChance] = useState(false)
  const [timelineWarning, setTimelineWarning] = useState<'blocked' | 'restricted' | null>(null)
  const [futureUnlocked, setFutureUnlocked] = useState(false)
  const [futureDeclined, setFutureDeclined] = useState(false)
  const future = useFutureChat(futureUnlocked)
  const [messagesKey, setMessagesKey] = useState(0)
  const [messagesFocus, setMessagesFocus] = useState<string | undefined>()

  const timeline = getTimeline(timelineId)
  const storyEnabled = timelineId === STORY_DATE
  const [viewingStoryChat, setViewingStoryChat] = useState(false)
  const [rewinding, setRewinding] = useState(false)
  const story = useSuhoStory(
    storyEnabled && sequence === null && openApp === 'messages' && viewingStoryChat,
    storyEnabled && sequence === null && openApp === null,
  )
  const suho = timeline.phone.favorites.find((c) => c.id === STORY_CONVO_ID) ?? {
    id: STORY_CONVO_ID,
    name: '안수호',
    label: '휴대전화',
  }

  const startCall = (contact: Contact) => {
    if (storyEnabled && contact.id === STORY_CONVO_ID && story.stage === 'stayed') {
      setLastChance(true)
      return
    }
    setActiveCall(contact)
  }

  const openStoryChat = () => {
    story.open()
    setMessagesFocus(STORY_CONVO_ID)
    setMessagesKey((k) => k + 1)
    setOpenApp('messages')
  }

  const endStoryCall = () => {
    story.hangUp()
    setMessagesFocus(STORY_CONVO_ID)
    setMessagesKey((k) => k + 1)
    setOpenApp('messages')
  }

  const launchApp = (id: AppId) => {
    setFutureDeclined(false)
    setOpenApp(id)
  }

  const goToFuture = () => {
    setFutureUnlocked(true)
    travel(TIMELINES[0].id, false)
  }

  const showFuturePrompt =
    storyEnabled && story.stage === 'finale' && openApp === null && sequence === null && !futureDeclined

  const rewind = () => {
    setLastChance(false)
    setRewinding(true)
    travel(STORY_DATE, false)
  }

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
        return (
          <MessagesApp
            key={messagesKey}
            timeline={timeline}
            initialOpenId={messagesFocus}
            story={
              storyEnabled
                ? {
                    convoId: STORY_CONVO_ID,
                    extra: story.extra,
                    typing: story.typing,
                    draft: story.draft,
                    choices: story.choices,
                    composable: story.stage === 'stayed' || story.stage === 'done',
                    unread: story.stage === 'notified',
                    onOpen: story.open,
                    onViewChange: setViewingStoryChat,
                    onChoose: story.choose,
                    onCompose: (text) => {
                      if (story.stage === 'done') {
                        const result = story.sendAfterEnding(text)
                        if (result !== 'sent') setTimelineWarning(result)
                        return
                      }
                      if (story.sendFailed(text)) setLastChance(true)
                    },
                  }
                : {
                    convoId: STORY_CONVO_ID,
                    extra: future.extra,
                    typing: future.typing,
                    draft: future.draft,
                    choices: future.choices,
                    composable: future.composable,
                    unread: false,
                    onOpen: () => {},
                    onViewChange: () => {},
                    onChoose: future.choose,
                    onCompose: future.send,
                  }
            }
          />
        )
      case 'photos':
        return <PhotosApp timeline={timeline} />
      case 'memo':
        return <MemoApp timeline={timeline} />
      case 'phone':
        return (
          <PhoneApp
            timeline={timeline}
            placedCalls={placedCalls[timelineId] ?? []}
            onCall={startCall}
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
        return <EbsiApp year={Number(timeline.id.slice(0, 4))} />
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

      <HomeScreen timeline={timeline} onOpenApp={launchApp} hidden={isAppOpen} />

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

      {storyEnabled && story.bannerVisible && (
        <NotificationBanner title="안수호" body="시은아" onOpen={openStoryChat} />
      )}

      {storyEnabled && (story.stage === 'ringing' || story.stage === 'call') && (
        <StoryCallScreen
          contact={suho}
          connected={story.stage === 'call'}
          script={CALL_SCRIPT}
          onAnswer={story.answer}
          onEnd={endStoryCall}
        />
      )}

      {lastChance && (
        <ConfirmDialog
          title="마지막 기회입니다."
          message="시간을 되돌리시겠습니까?"
          confirmLabel="되돌리기"
          onConfirm={rewind}
          onCancel={() => setLastChance(false)}
        />
      )}

      {timelineWarning && (
        <ConfirmDialog
          title={timelineWarning === 'restricted' ? '발송 제한' : '전송 불가'}
          message={
            timelineWarning === 'restricted'
              ? '발송을 제한합니다. 시간선의 오류가 발생할 수 있는 단어가 포함되어 있습니다'
              : '시간선의 오류가 발생할 수 있습니다. 2025년의 대상자에게 직접 전하세요'
          }
          confirmLabel="확인"
          hideCancel
          onConfirm={() => setTimelineWarning(null)}
          onCancel={() => setTimelineWarning(null)}
        />
      )}

      {showFuturePrompt && (
        <ConfirmDialog
          title="미래로 나아가시겠습니까?"
          message=""
          confirmLabel="네"
          cancelLabel="아니요"
          onConfirm={goToFuture}
          onCancel={() => setFutureDeclined(true)}
        />
      )}

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
            setActiveCall(null)
            setMessagesFocus(undefined)
            story.reset(rewinding && sequence.targetId === STORY_DATE)
            setRewinding(false)
            setFutureDeclined(false)
            if (sequence.targetId === STORY_DATE) setFutureUnlocked(false)
            else future.reset()
          }}
          onDone={() => setSequence(null)}
        />
      )}
    </div>
  )
}
