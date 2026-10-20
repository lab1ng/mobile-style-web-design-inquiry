import { buildSchedule2022, buildSchedule2024 } from './calendar-schedule'
import { MESSAGES_2022 } from './messages-2022'
import { MESSAGES_2024 } from './messages-2024'

export type Message = {
  from: 'me' | 'them'
  text: string
  /** YYYY-MM-DD */
  date: string
  time?: string
  /** 음성 메시지 길이 (예: 0:13). text는 음성 내용으로 표시 */
  voice?: string
  /** 전송 실패한 메시지 */
  failed?: boolean
}
export type Conversation = {
  id: string
  name: string
  color: string
  messages: Message[]
}
export type Photo = { id: string; src: string; alt: string }

const SHARED_PHOTOS: Photo[] = [
  { id: 'shared-01', src: '/images/photos/shared-01.jpg', alt: '밤에 난간에 기대 휴대폰을 보는 청록색 트레이닝복 차림의 수호' },
  { id: 'shared-02', src: '/images/photos/shared-02.jpg', alt: '밤에 아파트 복도에서 도시 야경을 보며 휴대폰을 든 교복 차림의 수호' },
  { id: 'shared-03', src: '/images/photos/shared-03.jpg', alt: '카페 테이블에서 파란 후드티를 입고 브이를 하는 수호' },
  { id: 'shared-04', src: '/images/photos/shared-04.jpg', alt: '교실 책상에서 분홍 베개를 베고 잠든 수호' },
]
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
    wallpaper: '/images/wallpaper-2024.jpg',
    messages: MESSAGES_2024,
    photos: [
      { id: 'p2024-01', src: '/images/photos/2024-01.jpg', alt: '밤에 야외 테라스에서 친구 넷이 찍은 셀카' },
      { id: 'p2024-02', src: '/images/photos/2024-02.jpg', alt: '한복 의상을 입고 궁궐 배경 앞에서 찍은 단체 셀카' },
      { id: 'p2024-03', src: '/images/photos/2024-03.jpg', alt: '교복 입은 친구들과 방 안에서 찍은 셀카' },
      { id: 'p2024-04', src: '/images/photos/2024-04.jpg', alt: '농구장 앞에서 응원 피켓을 든 친구 넷' },
      ...SHARED_PHOTOS,
    ],
    memos: [
      {
        id: 'm1',
        title: '2025년 목표',
        body: '1. 장학금 타기\n2. 운동 꾸준히 하기\n3. 책 열심히 읽기\n4. 바다 보러 가기 (수호랑)\n5. 한강도 (당연히 수호랑)',
        updated: '2024.12.01',
      },
      { id: 'm2', title: '선강대학교병원 3203호', body: '', updated: '2023.10.28' },
      { id: 'm3', title: '그 날로 돌아가고 싶어.', body: '', updated: '2023.10.28' },
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
        nextTimelineId: '2022-07-13',
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
        { term: '병원에 두면 좋은 식물', date: '12.03.' },
        { term: '환자 베개 추천', date: '11.26.' },
        { term: '수능 끝나고 뭐 하면', date: '11.15.' },
        { term: '00대학교', date: '10.02.' },
        { term: '잠이 잘 안올 때', date: '06.11.' },
      ],
    },
    instagram: INSTAGRAM_PROFILE,
    events: buildSchedule2024(),
  },
  {
    id: '2022-07-13',
    label: '2차',
    time: '14:20',
    wallpaper: '/images/wallpaper-2022.jpg',
    messages: MESSAGES_2022,
    photos: [...SHARED_PHOTOS],
    memos: [
      {
        id: 'm3',
        title: '미역국 끓이는 법 찾아보기',
        body: '1) 미역 불리기 - 10분\n2) 소고기 볶기 - 2~3분\n3) 미역 넣고 볶기 - 2~3분\n4) 물과 양념 넣기 - 다진마늘 1/2큰술, 국간장 1큰술\n5) 푹 끓이기 - 20~30분\n6) 마지막 간 맞추기\n\n파티룸 빌리기\n풍선\n파티용품',
        updated: '2022.07.08',
      },
      { id: 'm2', title: '신선설농탕 이게 그렇게 맛있나', body: '', updated: '2022.06.17' },
      { id: 'm1', title: '사과하기', body: '', updated: '2022.06.02' },
    ],
    music: { createdAt: '', tracks: [] },
    phone: {
    favorites: [{ id: 'suho', name: '안수호', label: '휴대전화' }],
    speedDial: { '1': 'suho' },
      recents: [
        { id: 'c1', name: '안수호', subtitle: '휴대전화', time: '오후 1:47', type: 'incoming', count: 5 },
        { id: 'c2', name: '영이', subtitle: '휴대전화', time: '오전 11:02', type: 'incoming' },
        { id: 'c3', name: '안수호', subtitle: '휴대전화', time: '월요일', type: 'missed' },
        { id: 'c4', name: '오범석', subtitle: '휴대전화', time: '토요일', type: 'incoming' },
        { id: 'c5', name: '영이', subtitle: '휴대전화', time: '토요일', type: 'incoming' },
        { id: 'c6', name: '안수호', subtitle: '휴대전화', time: '22. 6. 26.', type: 'incoming' },
        { id: 'c7', name: '112', subtitle: '대한민국', time: '22. 6. 17.', type: 'incoming' },
        { id: 'c8', name: '안수호', subtitle: '휴대전화', time: '22. 6. 17.', type: 'missed' },
        { id: 'c9', name: '오범석', subtitle: '휴대전화', time: '22. 6. 17.', type: 'incoming', count: 2 },
        { id: 'c10', name: '안수호', subtitle: '휴대전화', time: '22. 6. 17.', type: 'incoming' },
        { id: 'c11', name: '아버지', subtitle: '휴대전화', time: '22. 6. 16.', type: 'incoming' },
        { id: 'c12', name: '영이', subtitle: '휴대전화', time: '22. 6. 16.', type: 'incoming' },
        { id: 'c13', name: '영이', subtitle: '휴대전화', time: '22. 6. 15.', type: 'outgoing' },
        { id: 'c14', name: '안수호', subtitle: '휴대전화', time: '22. 6. 15.', type: 'incoming' },
        { id: 'c15', name: '오범석', subtitle: '휴대전화', time: '22. 6. 15.', type: 'incoming' },
        { id: 'c16', name: '안수호', subtitle: '휴대전화', time: '22. 6. 6.', type: 'incoming' },
      ],
    },
    naver: {
      news: [
        { id: 'n1', title: '전국 폭염특보 확대… 낮 최고 35도 안팎 무더위', source: '연합뉴스' },
        { id: 'n2', title: '열대야 사흘째, 밤에도 25도 이상… 온열질환 주의', source: 'YTN' },
        { id: 'n3', title: '장마 소강 뒤 다시 비… 주말 중부지방 집중호우 예보', source: 'KBS' },
        { id: 'n4', title: '자외선 지수 \'매우 높음\', 한낮 야외활동 자제해야', source: '한겨레' },
        { id: 'n5', title: '올여름 평년보다 덥다… 기상청 \"8월까지 무더위 지속\"', source: '중앙일보' },
      ],
      searches: [
        { term: '미역국 끓이는 법', date: '07.08.' },
        { term: '심장이 울렁거리고 뒷목이 간질거릴 때', date: '07.05.' },
        { term: '오토바이 안전', date: '07.04.' },
        { term: '친구 화해시키는 법', date: '06.29.' },
        { term: '자니 노래', date: '06.27.' },
        { term: '칼 베였을 때 치료', date: '06.07.' },
        { term: '6월 전국연합학력평가 정답', date: '06.02.' },
        { term: '고깃집 알바', date: '05.30.' },
        { term: '돈오소', date: '05.24.' },
      ],
    },
    instagram: INSTAGRAM_PROFILE,
    events: buildSchedule2022(),
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
