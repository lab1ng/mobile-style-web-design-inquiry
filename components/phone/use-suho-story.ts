'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Message } from '@/lib/timelines'

export type StoryStage =
  | 'waiting'
  | 'notified'
  | 'script'
  | 'stayed'
  | 'ringing'
  | 'call'
  | 'done'
  | 'finale'

type Step = {
  from: 'me' | 'them'
  text: string
  longTyping?: boolean
  veryLongTyping?: boolean
  /** 내가 입력했다가 지우고 보내지 않음 */
  erase?: boolean
  /** 이 메시지 앞에 추가로 기다리는 시간 */
  delay?: number
}

export type CallLine = { from: 'me' | 'them'; text?: string; note?: string; hold?: number }

export type SendResult = 'sent' | 'blocked' | 'restricted'

export const STORY_DATE = '2022-07-13'
export const STORY_CONVO_ID = 'suho'
export const STORY_CHOICES = ['어. 내일 보자', '안수호'] as const
export const FAILED_SENDS_BEFORE_PROMPT = 3
export const FUTURE_DATE = '2025-01-01'

const ARRIVAL_DELAY = 8_000
const REWOUND_ARRIVAL_DELAY = 5_000
const BANNER_DURATION = 8_000
const RING_DELAY = 1_200
const CHAR_MS = 105
const ERASE_MS = 75
const NAME_CALLS_BEFORE_FINALE = 3

export const CALL_SCRIPT: CallLine[] = [
  { from: 'them', text: '어, 연시은' },
  { from: 'them', text: '여보세요? 연시은. 왜 말이 없냐' },
  { from: 'them', text: '뭐야. 잘못 받았나. 야 연시은-' },
  { from: 'them', hold: 1200 },
  { from: 'them', text: '시은아' },
  { from: 'them', text: '뭔 일 있어?' },
  { from: 'me', text: '안수호' },
  { from: 'them', text: '야 넌 듣고 있으면서 사람 걱정되게' },
  { from: 'me', text: '수호야' },
  { from: 'them', text: '어?' },
  { from: 'me', text: '목 안 말라?' },
  { from: 'them', text: '목 엄청 마른데' },
]

const OPENING: Step[] = [
  { from: 'me', text: '어, 왜?' },
  { from: 'them', text: '뭐가 왜야' },
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
  { from: 'them', text: 'ㅋㅋㅋㅋㅋㅋ' },
  { from: 'them', text: '너 진짜. 이번엔 특히나 더 또라이야', longTyping: true },
  { from: 'me', text: '너가 할 말은 아니지' },
  { from: 'me', text: '그래서 안 갈 거야?' },
  { from: 'them', text: '시은아 그럴 리가', veryLongTyping: true },
]

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const compact = (text: string) => text.replace(/\s+/g, '')

/** 자동 입력/답장/선택지를 순서대로 재생하는 대화 플레이어 */
function useChatPlayer(date: string) {
  const [extra, setExtra] = useState<Message[]>([])
  const [typing, setTyping] = useState(false)
  const [draft, setDraft] = useState('')
  const [options, setOptions] = useState<readonly string[] | null>(null)
  const runRef = useRef(0)
  const pickRef = useRef<((index: number) => void) | null>(null)

  useEffect(() => {
    return () => {
      runRef.current++
    }
  }, [])

  const start = useCallback(() => {
    const token = ++runRef.current
    pickRef.current = null
    setOptions(null)
    const alive = () => runRef.current === token

    const play = async (steps: Step[]) => {
      for (const step of steps) {
        if (step.delay) await sleep(step.delay)
        if (step.from === 'me') {
          await sleep(850)
          for (let i = 1; i <= step.text.length; i++) {
            if (!alive()) return false
            setDraft(step.text.slice(0, i))
            await sleep(CHAR_MS)
          }
          await sleep(step.erase ? 800 : 380)
          if (!alive()) return false
          if (step.erase) {
            for (let i = step.text.length - 1; i >= 0; i--) {
              if (!alive()) return false
              setDraft(step.text.slice(0, i))
              await sleep(ERASE_MS)
            }
            continue
          }
          setDraft('')
        } else {
          await sleep(650)
          if (!alive()) return false
          setTyping(true)
          await sleep(step.veryLongTyping ? 5200 : step.longTyping ? 2900 : 1250)
          if (!alive()) return false
          setTyping(false)
        }
        setExtra((prev) => [...prev, { from: step.from, text: step.text, date }])
      }
      return alive()
    }

    const ask = (choices: readonly string[]) =>
      new Promise<number | null>((resolve) => {
        if (!alive()) return resolve(null)
        setOptions(choices)
        pickRef.current = (index) => {
          pickRef.current = null
          setOptions(null)
          resolve(alive() ? index : null)
        }
      })

    /** 선택지를 하나 보여주고, 누르면 그 말을 보낸 뒤 답장을 재생 */
    const exchange = async (choice: string, replies: Step[]) => {
      const picked = await ask([choice])
      if (picked === null) return false
      return play([{ from: 'me', text: choice }, ...replies])
    }

    return { play, ask, exchange, alive }
  }, [date])

  const pick = useCallback((index: number) => pickRef.current?.(index), [])

  const push = useCallback(
    (message: Omit<Message, 'date'> & { date?: string }) => setExtra((prev) => [...prev, { date, ...message }]),
    [date],
  )

  const reset = useCallback(() => {
    runRef.current++
    pickRef.current = null
    setExtra([])
    setTyping(false)
    setDraft('')
    setOptions(null)
  }, [])

  return { extra, typing, draft, options, start, pick, push, reset }
}

export function useSuhoStory(active: boolean, rewoundReady: boolean) {
  const chat = useChatPlayer(STORY_DATE)
  const [stage, setStage] = useState<StoryStage>('waiting')
  const [rewound, setRewound] = useState(false)
  const [bannerVisible, setBannerVisible] = useState(false)
  const [failedSends, setFailedSends] = useState(0)
  const nameCallsRef = useRef(0)
  const { push, start } = chat

  useEffect(() => {
    const ready = rewound ? rewoundReady : active
    if (!ready || stage !== 'waiting') return
    const timer = setTimeout(
      () => {
        push({ from: 'them', text: '시은아', time: '오후 2:20' })
        setStage('notified')
        setBannerVisible(true)
      },
      rewound ? REWOUND_ARRIVAL_DELAY : ARRIVAL_DELAY,
    )
    return () => clearTimeout(timer)
  }, [active, rewoundReady, rewound, stage, push])

  useEffect(() => {
    if (!bannerVisible) return
    const timer = setTimeout(() => setBannerVisible(false), BANNER_DURATION)
    return () => clearTimeout(timer)
  }, [bannerVisible])

  const open = useCallback(() => {
    if (stage !== 'notified') return
    setBannerVisible(false)
    setStage('script')
    const { play, ask, alive } = start()
    ;(async () => {
      if (!(await play(OPENING))) return
      const index = await ask(STORY_CHOICES)
      if (index === null) return
      if (!(await play([{ from: 'me', text: STORY_CHOICES[index] }]))) return
      if (index === 0) {
        setStage('stayed')
        return
      }
      await sleep(RING_DELAY)
      if (alive()) setStage('ringing')
    })()
  }, [stage, start])

  const sendFailed = useCallback(
    (text: string) => {
      push({ from: 'me', text, failed: true })
      const next = failedSends + 1
      setFailedSends(next)
      return next >= FAILED_SENDS_BEFORE_PROMPT
    },
    [failedSends, push],
  )

  const playFinale = useCallback(() => {
    setStage('script')
    const { play, exchange } = start()
    ;(async () => {
      if (!(await play([{ from: 'them', text: '형이 그렇게 보고 싶냐?' }]))) return
      const steps: [string, Step[]][] = [
        [
          '응',
          [
            { from: 'them', text: '좀만 기다려 날아가는 중' },
            { from: 'me', text: '사랑해', erase: true },
            { from: 'me', text: '안수호' },
            { from: 'them', text: '연시은', delay: 1000, longTyping: true },
            { from: 'them', text: '나 할 말 있는데' },
          ],
        ],
        ['나도', [{ from: 'them', text: '뭔데? 너 먼저 말해' }]],
        ['너도 나랑 같은 생각해?', [{ from: 'them', text: '응' }]],
        [
          '미래에도 여전히?',
          [
            { from: 'them', text: '시은아' },
            { from: 'them', text: '내가 안 그럴 수 있겠어?' },
            { from: 'them', text: '시은아', veryLongTyping: true },
            { from: 'them', text: '나 때문에 열일곱 여름에 갇히지 말고', longTyping: true },
            { from: 'them', text: '너는 스무살 미래로 나아가', longTyping: true },
            { from: 'them', text: '이번엔 내가 네 겨울로 갈게', longTyping: true },
          ],
        ],
      ]
      for (const [choice, replies] of steps) {
        if (!(await exchange(choice, replies))) return
      }
      setStage('finale')
    })()
  }, [start])

  const sendAfterEnding = useCallback(
    (text: string): SendResult => {
      const plain = compact(text)
      if (/체육관|가지마|안가면/.test(plain)) {
        push({ from: 'me', text, failed: true })
        return 'restricted'
      }
      if (/사랑해|좋아해|미래/.test(plain)) {
        push({ from: 'me', text, failed: true })
        return 'blocked'
      }
      push({ from: 'me', text })
      if (plain.includes('보고싶어')) {
        start().play([{ from: 'them', text: '나도' }])
      } else if (plain.includes('수호야') || plain.includes('안수호')) {
        nameCallsRef.current++
        if (nameCallsRef.current >= NAME_CALLS_BEFORE_FINALE) playFinale()
        else start().play([{ from: 'them', text: '나 운전 중. 쫌만 기다려' }])
      }
      return 'sent'
    },
    [push, start, playFinale],
  )

  const hangUp = useCallback(() => {
    if (stage !== 'call' && stage !== 'ringing') return
    setStage('script')
    start()
      .play(AFTER_CALL)
      .then((ok) => ok && setStage('done'))
  }, [stage, start])

  const reset = useCallback(
    (afterRewind = false) => {
      chat.reset()
      setRewound(afterRewind)
      setStage('waiting')
      setBannerVisible(false)
      setFailedSends(0)
      nameCallsRef.current = 0
    },
    [chat],
  )

  return {
    stage,
    extra: chat.extra,
    typing: chat.typing,
    draft: chat.draft,
    choices: chat.options,
    choose: chat.pick,
    bannerVisible,
    open,
    sendFailed,
    sendAfterEnding,
    reset,
    answer: () => setStage('call'),
    hangUp,
  }
}

/** 2024년: 수호에게 문자를 보낼 수 있고, 2022년 엔딩을 본 뒤라면 2025.01.01.에 답장이 옴 */
export function useFutureChat(unlocked: boolean) {
  const chat = useChatPlayer(FUTURE_DATE)
  const [phase, setPhase] = useState<'idle' | 'script' | 'free'>('idle')
  const { push, start } = chat

  const send = useCallback(
    (text: string) => {
      if (phase === 'script') return
      if (phase === 'free') {
        push({ from: 'me', text })
        start().play([{ from: 'them', text: '사랑해' }])
        return
      }
      push({ from: 'me', text, date: '2024-12-31' })
      if (!unlocked) return
      setPhase('script')
      const { play, exchange } = start()
      ;(async () => {
        if (!(await play([{ from: 'them', text: '시은아. 잘 살았냐', delay: 1200, longTyping: true }]))) return
        if (!(await exchange('응', [{ from: 'them', text: '스무 살까지 잘 왔어?' }]))) return
        const lastReplies: Step[] = [
          { from: 'them', text: '시은아' },
          { from: 'them', text: '내가 안 그럴 수 있겠어?', veryLongTyping: true },
        ]
        if (!(await exchange('수호야 그때 그 말 아직 여전해?', lastReplies))) return
        setPhase('free')
      })()
    },
    [phase, unlocked, push, start],
  )

  const reset = useCallback(() => {
    chat.reset()
    setPhase('idle')
  }, [chat])

  return {
    extra: chat.extra,
    typing: chat.typing,
    draft: chat.draft,
    choices: chat.options,
    choose: chat.pick,
    composable: phase !== 'script',
    send,
    reset,
  }
}
