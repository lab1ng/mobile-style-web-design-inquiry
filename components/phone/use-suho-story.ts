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

type Step = { from: 'me' | 'them'; text: string; longTyping?: boolean }

export const STORY_DATE = '2022-07-13'
export const STORY_CONVO_ID = 'suho'
export const STORY_CHOICES = ['어. 내일 보자', '수호야. 잠깐만'] as const

const ARRIVAL_DELAY = 10_000
const BANNER_DURATION = 8_000
const RING_DELAY = 1_800

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

const CONFESSION: Step[] = [
  { from: 'me', text: STORY_CHOICES[1] },
  { from: 'me', text: '목마르다며' },
  { from: 'me', text: '우리 집으로 와' },
  { from: 'me', text: '다른 데 가지 말고' },
  { from: 'them', text: '지금?', longTyping: true },
  { from: 'me', text: '응. 싫어?' },
]

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function useSuhoStory(active: boolean) {
  const [stage, setStage] = useState<StoryStage>('waiting')
  const [extra, setExtra] = useState<Message[]>([])
  const [typing, setTyping] = useState(false)
  const [draft, setDraft] = useState('')
  const [bannerVisible, setBannerVisible] = useState(false)
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
        await sleep(700)
        for (let i = 1; i <= step.text.length; i++) {
          if (!alive()) return false
          setDraft(step.text.slice(0, i))
          await sleep(90)
        }
        await sleep(350)
        if (!alive()) return false
        setDraft('')
      } else {
        await sleep(500)
        if (!alive()) return false
        setTyping(true)
        await sleep(step.longTyping ? 2600 : 1000)
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
      play(CONFESSION).then(async (ok) => {
        if (!ok) return
        const token = runRef.current
        await sleep(RING_DELAY)
        if (runRef.current === token) setStage('ringing')
      })
    },
    [stage, play],
  )

  const reset = useCallback(() => {
    runRef.current++
    setStage('waiting')
    setExtra([])
    setTyping(false)
    setDraft('')
    setBannerVisible(false)
  }, [])

  return {
    stage,
    extra,
    typing,
    draft,
    bannerVisible,
    open,
    choose,
    reset,
    answer: () => setStage('call'),
    hangUp: () => setStage('done'),
  }
}
