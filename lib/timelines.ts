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
 { id: 'shared-05', src: '/images/photos/shared-05.jpg', alt: '병실에서 깁스한 팔로 얼굴을 가린 환자복 차림의 수호와 옆에 선 교복 차림의 친구' },
 { id: 'shared-06', src: '/images/photos/shared-06.jpg', alt: '담쟁이 덮인 벽돌담 앞에서 빨간 티셔츠 위에 교복 셔츠를 걸치고 윙크하는 수호' },
 { id: 'shared-07', src: '/images/photos/shared-07.jpg', alt: '교실 책상 위 분홍 베개에 엎드려 잠든 교복 차림의 수호와 옆에 놓인 휴대폰' },
 { id: 'shared-08', src: '/images/photos/shared-08.jpg', alt: '밤에 헬멧을 쓰고 버스 앞에서 셀카를 찍는 수호와 버스 창가의 친구' },
]

export type PhotoAlbum = {
  id: string
  name: string
  photos: Photo[]
  /** 있으면 4자리 암호를 입력해야 열립니다 */
  passcode?: string
  /** 가려진 항목처럼 표지 사진 대신 아이콘으로 표시 */
  hidden?: boolean
}

const WING_PHOTO: Photo = {
  id: 'shared-09',
  src: '/images/photos/shared-09.jpg',
  alt: '햇살 드는 교실에서 카메라 쪽으로 몸을 기울인 시은과 뒤 책상에 앉은 수호',
}
const CLASSROOM_NIGHT_PHOTO: Photo = {
  id: 'shared-10',
  src: '/images/photos/shared-10.jpg',
  alt: '저녁 교실에서 교복 차림으로 앉아 브이를 하는 친구 셋',
}
const WING_ALBUM: PhotoAlbum = { id: 'wing', name: '🪽', photos: [WING_PHOTO], passcode: '0709' }
export type Memo = {
  id: string
  /** 비어 있으면 본문 첫 줄이 목록 제목이 됩니다 */
  title: string
  body: string
  updated: string
  /** 있으면 4자리 암호를 입력해야 열립니다 */
  passcode?: string
}
export type KnowledgeArticle = {
  question: string
  meta: string
  answers: { author: string; badge?: string; body: string }[]
}
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
  /** 첫 번째 앨범이 기본 앨범(최근 항목) */
  albums: PhotoAlbum[]
  memos: Memo[]
  music: { createdAt: string; tracks: Track[] }
  phone: PhoneData
  naver: {
    news: NewsItem[]
    /** 영상이 있으면 누를 때 새해 카운트다운 → 오류 → 재부팅이 시작됩니다 */
    video?: NaverVideo & { nextTimelineId: string }
    /** 검색창을 누르면 보이는 최근 검색어 (맨 위부터) */
    searches: { term: string; date: string; article?: KnowledgeArticle }[]
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
    albums: [
      {
        id: 'recents',
        name: '최근 항목',
        photos: [
          { id: 'p2024-01', src: '/images/photos/2024-01.jpg', alt: '밤에 야외 테라스에서 친구 넷이 찍은 셀카' },
          { id: 'p2024-02', src: '/images/photos/2024-02.jpg', alt: '한복 의상을 입고 궁궐 배경 앞에서 찍은 단체 셀카' },
          { id: 'p2024-03', src: '/images/photos/2024-03.jpg', alt: '교복 입은 친구들과 방 안에서 찍은 셀카' },
          { id: 'p2024-04', src: '/images/photos/2024-04.jpg', alt: '농구장 앞에서 응원 피켓을 든 친구 넷' },
          ...SHARED_PHOTOS,
        ],
      },
      WING_ALBUM,
      { id: 'hidden', name: '가려진 항목', photos: [CLASSROOM_NIGHT_PHOTO], hidden: true },
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
        { id: 'c8', name: '070-876X-688X', subtitle: '대한민국', time: '���제', type: 'incoming' },
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
    albums: [{ id: 'recents', name: '최근 항목', photos: [...SHARED_PHOTOS, CLASSROOM_NIGHT_PHOTO] }, WING_ALBUM],
    memos: [
      {
        id: 'm3',
        title: '미역국 끓이는 법 찾아보기',
        body: '1) 미역 불리기 - 10분\n2) 소고기 볶기 - 2~3분\n3) 미역 넣고 볶기 - 2~3분\n4) 물과 양념 넣기 - 다진마늘 1/2큰술, 국간장 1큰술\n5) 푹 끓이기 - 20~30분\n6) 마지막 간 맞추기\n\n파티룸 빌리기\n풍선\n파티용품',
        updated: '2022.07.08',
      },
      {
        id: 'm4',
        title: '',
        body: '시은씨\n왜\n배고파 뒈지겠어\n너는 뱃속에 거지가 들었냐\nㅋㅋㅋㅋㅋㅋㅋ시은아 오늘 메뉴 뭔지 모르지\n몰라. 그리고 너 핸드폰은 어디다 두고 내 걸로 장난이야\n교실에 두고 왔어- 야 어차피 영화 관심도 없잖아 너\n그래도 선생님이 핸드폰 하지 말라 했잖아\n아 이 범생이 어떡하냐? 썜도 지금 핸드폰 하자나 뭐 어때\n그건 그래\n솔직히 말해 영화 재미없지?\n응\n땡땡이 칠까\n아니\n아 시은씨 날씨가 이렇게 좋은데 어? 커튼치고 불끄고 이 교실 안에서 재미도 없는거 봐야겠어? 잠깐만 바람 좀 쐬고 오자고~ 날씨 죽이잖아\n너는 어떻게 문자로도 말이 많아?\n나 지금 먼저 나갈 테니까 1분 후에 나와',
        updated: '2022.06.22',
      },
      {
        id: 'm2',
        title: '',
        body: 'ㅇ 맨날 잠. 공부는 죽어도 안 함\nㅇ 밥은 엄청 많이 먹음. 급식실 갈 때 안 깨우면 서운해함\nㅇ 안수호가 후드집업 가져감. 주는 거 까먹은 듯\nㅇ 내가 준 손수건\nㅇ 분홍색 토끼 베개\n- 쿠팡에서 샀다고 함. 구매 완료\nㅇ 돈오소, 배달 알바, 상하차 …. 안 힘드나\nㅇ 신선설농탕\n- 도가니탕 이게 그렇게 맛있나?\nㅇ 예전에 MMA 했다던데.. 왜 그만뒀지? 궁금한데 못 물어보겠다.\nㅇ 한강\n- 안수호는 생각보다 더 달리기를 잘한다. 질투 나게\nㅇ 생일 7/9',
        updated: '2022.06.17',
        passcode: '0709',
      },
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
        { id: 'n1', title: '전국 폭염특보 ���대… 낮 최고 35도 안팎 무더위', source: '연합뉴스' },
        { id: 'n2', title: '열대야 사흘째, 밤에도 25도 이상… 온열질환 주의', source: 'YTN' },
        { id: 'n3', title: '장마 소강 뒤 다시 비… 주말 중부지방 집중호우 예보', source: 'KBS' },
        { id: 'n4', title: '자외선 지수 \'매우 높음\', 한낮 야외활동 자제해야', source: '한겨레' },
        { id: 'n5', title: '올여름 평년보다 덥다… 기상청 \"8월까지 무더위 지속\"', source: '중앙일보' },
      ],
      searches: [
        { term: '미역국 끓이는 법', date: '07.08.' },
        {
          term: '심장이 울렁거리고 뒷목이 간질거릴 때',
          date: '07.05.',
          article: {
            question: '심장이 울렁거리고 뒷목이 간질거리는데 이거 무슨 병인가요?',
            meta: '비공개 · 조회수 127 · 작성일 2022.06.30.',
            answers: [
              {
                author: '내과 전문의',
                badge: '전문의 답변',
                body: '심장이 울렁거리거나 두근거리는 증상은 스트레스, 수면 부족, 카페인 섭취 등으로 나타날 수 있지만 부정맥이나 갑상선 질환 등 다양한 원인도 있습니다. 증상��� 반복되거나 지속된다면 내과 진료를 받아 보시는 것이 좋겠습니다. 흉통, 호흡곤란, 심한 어지럼증이나 실신이 동반된다면 즉시 응급 진료를 받으세요.',
              },
              { author: '익명', body: '그거 사랑 아닌가요?' },
            ],
          },
        },
        { term: '오토바이 안��', date: '07.04.' },
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
