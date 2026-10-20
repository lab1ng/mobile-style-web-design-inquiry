export type Message = { from: 'me' | 'them'; text: string; time: string }
export type Conversation = {
  id: string
  name: string
  color: string
  messages: Message[]
}
export type Photo = { id: string; src: string; alt: string; date: string }
export type Memo = { id: string; title: string; body: string; updated: string }
export type Contact = { id: string; name: string; label: string }
export type Call = {
  id: string
  name: string
  /** 이름 아래 작은 글씨 (휴대전화, 대한민국 등) */
  subtitle: string
  time: string
  type: 'incoming' | 'outgoing' | 'missed'
  count?: number
}
export type PhoneData = {
  favorites: Contact[]
  recents: Call[]
  /** 키패드 숫자를 꾹 누르면 연결되는 연락처 id */
  speedDial: Record<string, string>
}
export type NewsItem = { id: string; title: string; source: string }
export type NaverVideo = { title: string; thumbnail: string; duration: string }
export type CalendarEvent = { date: string; title: string }

export type Timeline = {
  /** YYYY-MM-DD */
  id: string
  label: string
  time: string
  wallpaper: string
  messages: Conversation[]
  photos: Photo[]
  memos: Memo[]
  phone: PhoneData
  naver: {
    news: NewsItem[]
    /** 영상이 있으면 누를 때 새해 카운트다운 → 오류 → 재부팅이 시작됩니다 */
    video?: NaverVideo & { nextTimelineId: string }
  }
  events: CalendarEvent[]
}

export const TIMELINES: Timeline[] = [
  {
    id: '2024-12-31',
    label: '1차',
    time: '23:59',
    wallpaper: '/images/wallpaper-2024.png',
    messages: [
      {
        id: 'mom',
        name: '엄마',
        color: '#f97316',
        messages: [
          { from: 'them', text: '오늘 몇 시에 들어와?', time: '오후 9:12' },
          { from: 'me', text: '친구들이랑 카운트다운 보고 갈게', time: '오후 9:20' },
          { from: 'them', text: '조심히 와. 새해 복 많이 받아', time: '오후 11:41' },
        ],
      },
      {
        id: 'friend',
        name: '지민',
        color: '#8b5cf6',
        messages: [
          { from: 'them', text: '야 2024년 진짜 끝이다', time: '오후 11:50' },
          { from: 'me', text: '올해 진짜 별일 다 있었다', time: '오후 11:52' },
          { from: 'them', text: '내년엔 좀 평화롭게 살자', time: '오후 11:53' },
          { from: 'me', text: '그러게. 근데 왠지 이상한 느낌이 들어', time: '오후 11:58' },
        ],
      },
    ],
    photos: [
      { id: 'p1', src: '/images/photo-winter.png', alt: '전구로 장식된 눈 내린 골목', date: '2024.12.24' },
      { id: 'p2', src: '/images/photo-cafe.png', alt: '카페 테이블 위 라떼와 케이크', date: '2024.12.28' },
      { id: 'p3', src: '/images/photo-spring.png', alt: '초록 나무가 늘어선 캠퍼스 길', date: '2022.05.23' },
    ],
    memos: [
      {
        id: 'm1',
        title: '2025 목표',
        body: '1. 운동 꾸준히 하기\n2. 책 20권 읽기\n3. 그날 일 다시 생각하지 않기',
        updated: '2024.12.31',
      },
      {
        id: 'm2',
        title: '2022.05.23',
        body: '그날로 돌아갈 수만 있다면.',
        updated: '2024.11.02',
      },
    ],
    phone: {
      favorites: [{ id: 'suho', name: '안수호', label: '휴대전화' }],
      speedDial: { '1': 'suho' },
      recents: [
        { id: 'c1', name: '선강대병원', subtitle: '대한민국', time: '오후 11:21', type: 'missed' },
        { id: 'c2', name: '박후민', subtitle: '휴대전화', time: '오후 10:48', type: 'outgoing' },
        { id: 'c3', name: '070-274X-622X', subtitle: '대한민국', time: '오후 7:15', type: 'incoming' },
        { id: 'c4', name: '수호할머니', subtitle: '휴대전화', time: '오후 5:32', type: 'incoming' },
        { id: 'c5', name: '서준태', subtitle: '휴대전화', time: '오후 2:04', type: 'outgoing' },
        { id: 'c6', name: '박후민', subtitle: '휴대전화', time: '오전 11:40', type: 'incoming' },
        { id: 'c7', name: '고현탁', subtitle: '휴대전화', time: '어제', type: 'incoming' },
        { id: 'c8', name: '070-876X-688X', subtitle: '대한민국', time: '어제', type: 'incoming' },
        { id: 'c9', name: '금성제', subtitle: '휴대전화', time: '일요일', type: 'missed' },
      ],
    },
    naver: {
      video: {
        title: '2024 마지막 순간, 함께 새해를 맞이해요',
        thumbnail: '/images/newyear-video.png',
        duration: 'LIVE',
        nextTimelineId: '2022-05-23',
      },
      news: [
        { id: 'n1', title: '보신각 타종 행사, 올해도 수만 명 운집 예상', source: '연합뉴스' },
        { id: 'n2', title: '2024년을 돌아보는 10대 뉴스', source: '한겨레' },
        { id: 'n3', title: '새해 첫 일출 명소, 내일 날씨는 맑음', source: 'YTN' },
      ],
    },
    events: [
      { date: '2024-12-24', title: '크리스마스 이브 약속' },
      { date: '2024-12-31', title: '카운트다운 보기' },
      { date: '2022-05-23', title: '그날' },
    ],
  },
  {
    id: '2022-05-23',
    label: '2차',
    time: '14:20',
    wallpaper: '/images/wallpaper-2022.png',
    messages: [],
    photos: [],
    memos: [],
    phone: { favorites: [], recents: [], speedDial: {} },
    naver: {
      news: [
        { id: 'n1', title: '전국 대체로 맑음, 낮 최고 28도 초여름 더위', source: '연합뉴스' },
        { id: 'n2', title: '대학가 축제 시즌 돌아왔다', source: '중앙일보' },
      ],
    },
    events: [{ date: '2022-05-23', title: '오늘' }],
  },
]

export function getTimeline(id: string) {
  return TIMELINES.find((t) => t.id === id) ?? TIMELINES[0]
}

export function parseDate(id: string) {
  const [y, m, d] = id.split('-').map(Number)
  return { year: y, month: m, day: d }
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export function weekdayOf(id: string) {
  const { year, month, day } = parseDate(id)
  return WEEKDAYS[new Date(year, month - 1, day).getDay()]
}

export function formatKoreanDate(id: string) {
  const { year, month, day } = parseDate(id)
  return `${year}년 ${month}월 ${day}일`
}
