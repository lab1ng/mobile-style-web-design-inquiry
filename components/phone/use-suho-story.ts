'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Message } from '@/lib/timelines'

export type StoryStage =
  | 'waiting'
  | 'notified'
  | 'script'
  | 'choice'
  | 'stayed'
  | 'ringing'
  | 'call'
  | 'done'

type Step = { from: 'me' | 'them'; text: string; longTyping?: boolean; veryLongTyping?: boolean }

export type CallLine = { from: 'me' | 'them'; text?: string; note?: string; hold?: number }

export const STORY_DATE = '2022-07-13'
export const STORY_CONVO_ID = 'suho'
export const STORY_CHOICES = ['어. 내일 보자', '안수호'] as const
export const FAILED_SENDS_BEFORE_PROMPT = 3

const ARRIVAL_DELAY = 20_000
const BANNER_DURATION = 8_000
const RING_DELAY = 1_200
const CHAR_MS = 130

export const CALL_SCRIPT: CallLine[] = [
  { from: 'them', text: '어, 연시은' },
  { from: 'them', text: '여보세요? 연시은. 왜 말이 없냐' },
  { from: 'them', text: '뭐야. 잘못 받았나. 야 연시은-' },
  { from: 'them', note: '한참 침묵', hold: 4500 },
  { from: 'them', text: '시은아' },
  { from: 'them', text: '뭔 일 있어?' },
  { from: 'me', text: '아니' },
  { from: 'me', text: '수호야' },
  { from: 'them', text: '어?' },
  { from: 'me', text: '목 안 말라?' },
  { from: 'them', note: '웃음소리', text: '목 무지 마른데' },
]

const OPENING: Step[] = [
  { from: 'me', text: '어, 왜?' },
  { from: 'them', text: '뭐가 왜야' },
  { from: 'them', text: '나 목말라. 물 좀 줘' },
  { from: 'them', text: '잘 살았냐?', longTyping: true },
  { from: 'me', text: '어. 뭐. 어쩐 일이야?' },
  { from: 'them', text: '그냥 뭐' },
  { from: 'them', text: '괜찮냐?', longTyping: true },
  { from: 'me', text: '뭐가?' },
  { from: 'them', text: '내일은 학교 오지? 기말고사니까' },
  { from: 'me', text: '어. 가야지' },
  { from: 'them', text: '내일 보자' },
]

const AFTER_CALL: Step[] = [
  { from: 'me', text: '오늘 배달 더 없지' },
  { from: 'them', text: '왜?' },
  { from: 'me', text: '공부하기 싫어서' },
  { from: 'them', text: '범생이가 공부가 싫을 줄도 알아?' },
  { from: 'me', text: '나도 사람이야' },
  { from: 'them', text: '공부가 싫은 연시은이 뭘 하고 싶은지 궁금한데?' },
  { from: 'me', text: '드라이브' },
  { from: 'them', text: '너 진짜. 이번엔 특히나 더 또라이야', longTyping: true },
  { from: 'me', text: '너가 할 말은 아니지' },
  { from: 'me', text: '그래서 안 갈 거야?' },
  { from: 'them', text: '시은아 그럴 리가', veryLongTyping: true },
]

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function useSuhoStory(active: boolean) {
  const [stage, setStage] = useState<StoryStage>('waiting')
  const [extra, setExtra] = useState<Message[]>([])
  const [typing, setTyping] = useState(false)
  const [draft, setDraft] = useState('')
  const [bannerVisible, setBannerVisible] = useState(false)
  const [failedSends, setFailedSends] = useState(0)
  const runRef = useRef(0)

  useEffect(() => {
    return () => {
      runRef.current++
    }
  }, [])

  useEffect(() => {
    if (!active || stage !== 'waiting') return
    const timer = setTimeout(() => {
      setExtra([{ from: 'them', text: '시은아', date: STORY_DATE, time: '오후 2:20' }])
      setStage('notified')
      setBannerVisible(true)
    }, ARRIVAL_DELAY)
    return () => clearTimeout(timer)
  }, [active, stage])

  useEffect(() => {
    if (!bannerVisible) return
    const timer = setTimeout(() => setBannerVisible(false), BANNER_DURATION)
    return () => clearTimeout(timer)
  }, [bannerVisible])

  const play = useCallback(async (steps: Step[]) => {
    const token = ++runRef.current
    const alive = () => runRef.current === token
    for (const step of steps) {
      if (step.from === 'me') {
        await sleep(1000)
        for (let i = 1; i <= step.text.length; i++) {
          if (!alive()) return false
          setDraft(step.text.slice(0, i))
          await sleep(CHAR_MS)
        }
        await sleep(500)
        if (!alive()) return false
        setDraft('')
      } else {
        await sleep(800)
        if (!alive()) return false
        setTyping(true)
        await sleep(step.veryLongTyping ? 6000 : step.longTyping ? 3400 : 1500)
        if (!alive()) return false
        setTyping(false)
      }
      setExtra((prev) => [...prev, { from: step.from, text: step.text, date: STORY_DATE }])
    }
    return alive()
  }, [])

  const open = useCallback(() => {
    if (stage !== 'notified') return
    setBannerVisible(false)
    setStage('script')
    play(OPENING).then((ok) => ok && setStage('choice'))
  }, [stage, play])

  const choose = useCallback(
    (index: 0 | 1) => {
      if (stage !== 'choice') return
      setStage('script')
      if (index === 0) {
        play([{ from: 'me', text: STORY_CHOICES[0] }]).then((ok) => ok && setStage('stayed'))
        return
      }
      play([{ from: 'me', text: STORY_CHOICES[1] }]).then(async (ok) => {
        if (!ok) return
        const token = runRef.current
        await sleep(RING_DELAY)
        if (runRef.current === token) setStage('ringing')
      })
    },
    [stage, play],
  )

  const sendFailed = useCallback((text: string) => {
    setExtra((prev) => [...prev, { from: 'me', text, date: STORY_DATE, failed: true }])
    const next = failedSends + 1
    setFailedSends(next)
    return next >= FAILED_SENDS_BEFORE_PROMPT
  }, [failedSends])

  const hangUp = useCallback(() => {
    if (stage !== 'call' && stage !== 'ringing') return
    setStage('script')
    play(AFTER_CALL).then((ok) => ok && setStage('done'))
  }, [stage, play])

  const reset = useCallback(() => {
    runRef.current++
    setStage('waiting')
    setExtra([])
    setTyping(false)
    setDraft('')
    setBannerVisible(false)
    setFailedSends(0)
  }, [])

  return {
    stage,
    extra,
    typing,
    draft,
    bannerVisible,
    open,
    choose,
    sendFailed,
    reset,
    answer: () => setStage('call'),
    hangUp,
  }
}
