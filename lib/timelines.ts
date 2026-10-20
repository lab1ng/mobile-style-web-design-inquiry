import { buildSchedule2024 } from './calendar-schedule'
import { MESSAGES_2024 } from './messages-2024'

export type Message = {
  from: 'me' | 'them'
  text: string
  /** YYYY-MM-DD */
  date: string
  time?: string
}
export type Conversation = {
  id: string
  name: string
  color: string
  messages: Message[]
}
export type Photo = { id: string; src: string; alt: string; date: string }
export type Memo = { id: string; title: string; body: string; updated: string }
export type Contact = { id: string; name: string; label: string }
export type Track = { id: string; title: string; artist: string; cover: string }
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
export type CalendarCategory = 'hospital' | 'academy' | 'birthday' | 'exam' | 'friends' | 'school' | 'plan'
export type CalendarEvent = {
  date: string
  title: string
  category: CalendarCategory
  /** 취소된 일정은 취소선으로 표시 */
  canceled?: boolean
}

export type Timeline = {
  /** YYYY-MM-DD */
  id: string
  label: string
  time: string
  wallpaper: string
  messages: Conversation[]
  photos: Photo[]
  memos: Memo[]
  music: { createdAt: string; tracks: Track[] }
  phone: PhoneData
  naver: {
    news: NewsItem[]
    /** 영상이 있으면 누를 때 새해 카운트다운 → 오류 → 재부팅이 시작됩니다 */
    video?: NaverVideo & { nextTimelineId: string }
    /** 검색창을 누르면 보이는 최근 검색어 (맨 위부터) */
    searches: { term: string; date: string }[]
  }
  instagram: InstagramProfile
  events: CalendarEvent[]
}

export type InstagramAccount = {
  username: string
  name: string
  /** 누르면 열리는 실제 인스타그램 주소 */
  url: string
}

export type InstagramProfile = {
  username: string
  name: string
  posts: number
  followers: number
  following: InstagramAccount[]
}

const INSTAGRAM_PROFILE: InstagramProfile = {
  username: 'sieun_o006',
  name: '연시은',
  posts: 0,
  followers: 1,
  following: [{ username: 'suh_o006', name: '안수호', url: 'https://www.instagram.com/suh_o006/' }],
}

export const TIMELINES: Timeline[] = [
  {
    id: '2024-12-31',
    label: '1차',
    time: '23:59',
    wallpaper: '/images/wallpaper-2024.png',
    messages: MESSAGES_2024,
    photos: [
      { id: 'p1', src: '/images/photo-winter.png', alt: '전구로 장식된 눈 내린 골목', date: '2024.12.24' },
      { id: 'p2', src: '/images/photo-cafe.png', alt: '카페 테이블 위 라떼와 케이크', date: '2024.12.28' },
      { id: 'p3', src: '/images/photo-spring.png', alt: '초록 나무가 늘어선 캠퍼스 길', date: '2022.05.23' },
    ],
    memos: [
      {
        id: 'm1',
        title: '2025년 목표',
        body: '1. 장학금 타기\n2. 운동 꾸준히 하기\n3. 책 열심히 읽기\n4. 바다 보러 가기 (수호랑)',
        updated: '2024.12.31',
      },
      { id: 'm2', title: '선강대학교병원 3203호', body: '', updated: '2024.12.31' },
      { id: 'm3', title: '그 날로 돌아가고 싶어.', body: '', updated: '2024.12.31' },
    ],
    music: {
      createdAt: '2024.12.31 23:42',
      tracks: [
        { id: 't1', title: '우리가 영원을 말하면 여름이 될거야', artist: '최윤영', cover: '/images/albums/01.jpg' },
        { id: 't2', title: '우우우린', artist: '윤지영', cover: '/images/albums/02.jpg' },
        { id: 't3', title: 'Past Lives', artist: 'sapientdream, Slushii', cover: '/images/albums/03.jpg' },
        { id: 't4', title: '선인장', artist: '김현창', cover: '/images/albums/04.jpg' },
        { id: 't5', title: '눈이와도하늘을보지않아요', artist: '최윤영', cover: '/images/albums/05.jpg' },
        { id: 't6', title: '유성', artist: '2단지', cover: '/images/albums/06.jpg' },
        { id: 't7', title: '영원회귀', artist: '겸 (GYE0M)', cover: '/images/albums/07.jpg' },
        { id: 't8', title: '우리의 마음은 한여름처럼 뜨겁지만', artist: '최윤영', cover: '/images/albums/08.jpg' },
        { id: 't9', title: '그러나 우리가 사랑으로', artist: '나이트오프 (Night Off)', cover: '/images/albums/09.jpg' },
      ],
    },
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
      searches: [
        { term: '연말 케이크 예약', date: '12.30.' },
        { term: '정시 원서 접수', date: '12.27.' },
        { term: '갑자기 우울해질 수 있나요', date: '12.19.' },
        { term: '수능 끝나고 뭐 하면', date: '11.15.' },
        { term: '00대학교', date: '10.02.' },
        { term: '잠이 잘 안올 때', date: '06.11.' },
        { term: '병원에 두면 좋은 식물', date: '12.03.' },
        { term: '환자 베개 추천', date: '11.26.' },
      ],
    },
    instagram: INSTAGRAM_PROFILE,
    events: buildSchedule2024(),
  },
  {
    id: '2022-05-23',
    label: '2차',
    time: '14:20',
    wallpaper: '/images/wallpaper-2022.png',
    messages: [],
    photos: [],
    memos: [],
    music: { createdAt: '', tracks: [] },
    phone: { favorites: [], recents: [], speedDial: {} },
    naver: {
      news: [
        { id: 'n1', title: '전국 대체로 맑음, 낮 최고 28도 초여름 더위', source: '연합뉴스' },
        { id: 'n2', title: '대학가 축제 시즌 돌아왔다', source: '중앙일보' },
      ],
      searches: [],
    },
    instagram: INSTAGRAM_PROFILE,
    events: [],
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
