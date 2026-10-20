import {
  BarChart3,
  Bot,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FolderDown,
  Menu,
  MoreVertical,
  PlaySquare,
  Presentation,
  Search,
  UserCircle2,
  X,
} from 'lucide-react'

const QUICK_MENU = [
  { label: '해설강의', icon: Presentation },
  { label: '문제 및 해설\n다운로드', icon: FolderDown },
  { label: '빠른 채점', icon: ClipboardCheck },
  { label: '예상 등급컷', icon: BarChart3 },
]

const NAV = [
  { label: '전체메뉴', icon: Menu },
  { label: '통합검색', icon: Search },
  { label: '', icon: null },
  { label: '수강중강좌', icon: PlaySquare },
  { label: '나의학습방', icon: UserCircle2 },
]

const EDITIONS = {
  2022: { grade: '고1/고2', badge: '고1·2', banner: '6월 모의고사', circleTitle: '6월 모의고사', series: '2022' },
  2024: { grade: '고3/N수', badge: '고3', banner: '수능 해설강의', circleTitle: '수능', series: '2024' },
} as const

export function EbsiApp({ year }: { year: number }) {
  const edition = year === 2022 ? EDITIONS[2022] : EDITIONS[2024]
  return (
    <div className="flex h-full flex-col bg-white text-neutral-900" aria-label="EBSi 고교강의 홈">
      <header className="flex shrink-0 items-center border-b-2 border-neutral-300 px-3 pb-2" aria-hidden="true">
        <ChevronLeft className="size-7" strokeWidth={2.4} />
        <div className="flex flex-1 items-center justify-center gap-1">
          <span className="text-2xl font-black italic tracking-tight text-[#0a4d8c]">
            EBS<span className="text-[#5cb82e]">i</span>
          </span>
          <span className="rounded-full bg-[#7bc243] px-1.5 py-0.5 text-[9px] font-bold text-white">풀서비스</span>
        </div>
        <MoreVertical className="size-5" />
      </header>

      <div className="flex shrink-0 border-b-2 border-neutral-300 text-[15px]" aria-hidden="true">
        <span className="flex w-[27%] items-center justify-center gap-1 bg-[#b3d4fc] py-2.5 font-bold text-[#1e4fa0]">
          {edition.grade} <ChevronDown className="size-4" />
        </span>
        <span className="flex-1 py-2.5 text-center">선생님</span>
        <span className="flex-1 py-2.5 text-center">모든강좌</span>
        <span className="flex-1 py-2.5 text-center">교재</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <section className="relative h-36 overflow-hidden bg-gradient-to-br from-[#2563eb] via-[#3b82f6] to-[#60a5fa]">
          <div className="absolute top-8 left-6">
            <p className="text-[26px] font-black text-[#7ff3ff] drop-shadow">{edition.banner}</p>
            <p className="text-xs text-white/90">수능 준비를 위한 가장 확실한</p>
          </div>
          <div className="absolute -top-1 -right-6 flex size-40 flex-col items-center justify-center rounded-full border-4 border-[#4ea4ff] bg-[#1a2556] text-center">
            <span className="rounded-b-md bg-[#3b82f6] px-2 text-[11px] font-black text-[#bfe3ff]">{edition.badge}</span>
            <p className="mt-1 text-[15px] font-black text-white">{edition.circleTitle}</p>
            <p className="text-xl font-black text-[#7fd0ff]">해설강의</p>
            <p className="mt-1 text-[11px] font-bold text-[#bfe3ff]">바로가기</p>
          </div>
          <span className="absolute top-1 right-1 flex size-7 items-center justify-center rounded-full bg-black text-white">
            <X className="size-4" />
          </span>
        </section>

        <section className="relative grid grid-cols-4 bg-[#d6e8fc]">
          <span className="absolute top-[3.6rem] right-2 z-10 flex items-center gap-1 rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] text-white">
            <span className="size-2.5 rounded-sm bg-white" /> 1일 동안 열지않기
          </span>
          {QUICK_MENU.map(({ label, icon: Icon }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center ${i < 3 ? 'border-r border-dashed border-[#7aa7de]' : ''}`}
            >
              <div className="flex h-16 items-center justify-center">
                <Icon className="size-8 text-[#2d5fb4]" strokeWidth={1.6} aria-hidden="true" />
              </div>
              <p className="flex h-14 w-full items-center justify-center whitespace-pre-line bg-[#e8f2fd] text-center text-[13px] font-semibold leading-tight text-[#2d5fb4]">
                {label}
              </p>
            </div>
          ))}
        </section>

        <section className="flex flex-col items-center gap-2 bg-gradient-to-b from-[#16285c] to-[#1d3a80] px-4 py-4">
          <p className="text-[15px] font-black text-[#a9c8ff]">미니배치표 바로가기</p>
          <div className="flex w-full items-center justify-between rounded-full bg-white px-4 py-2">
            <span className="text-[12px] font-black text-[#d12f4a]">내 점수로 합격가능한 대학 TOP 10 지금 바로 확인</span>
            <Search className="size-4 text-neutral-900" strokeWidth={3} aria-hidden="true" />
          </div>
        </section>

        <section className="flex gap-3 bg-[#eaf2fd] px-3 py-4">
          <div className="flex w-20 shrink-0 flex-col items-center justify-center gap-1 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-[#ffd7b8]">
              <Search className="size-6 text-[#e07a1f]" strokeWidth={2.6} aria-hidden="true" />
            </span>
            <p className="text-[15px] font-black leading-tight text-[#3a4a6b]">내게맞는 강좌찾기</p>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <QuickCard icon={<Search className="size-6 text-[#2d5fb4]" strokeWidth={2.6} />} title="빠른 강좌 찾기" desc="과목·학년·학습단계" />
            <QuickCard
              icon={<Bot className="size-6 text-[#2d5fb4]" />}
              title={
                <>
                  AI 맞춤 학습 <span className="text-[13px] font-black text-[#3ba7ff]">DANCHOQ</span>
                </>
              }
              desc="강좌추천·문제추천·푸리봇"
            />
          </div>
        </section>

        <section className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">주요 학습 시리즈</h2>
            <span className="text-sm text-neutral-400">전체보기</span>
          </div>
          <div className="mt-3 grid grid-cols-3 border border-neutral-200 text-center">
            {['수능특강', '수능완성', '인터넷 수능'].map((s, i) => (
              <div key={s} className={`py-4 ${i < 2 ? 'border-r border-neutral-200' : ''}`}>
                <p className="text-lg font-black text-[#2d5fb4]">{edition.series}</p>
                <p className="text-xs text-neutral-600">{s}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <nav className="relative flex shrink-0 items-end border-t border-neutral-200 bg-white px-1 pt-2 pb-1" aria-hidden="true">
        {NAV.map(({ label, icon: Icon }, i) =>
          Icon ? (
            <div key={label} className="flex flex-1 flex-col items-center gap-0.5 text-[12px] font-semibold">
              <Icon className="size-6" strokeWidth={1.8} />
              {label}
            </div>
          ) : (
            <div key={i} className="flex flex-1 justify-center">
              <span className="-mt-8 flex size-16 items-center justify-center rounded-full border-4 border-neutral-200 bg-gradient-to-b from-[#5b8cff] to-[#2747c9]">
                <Bot className="size-8 text-white" strokeWidth={2} />
              </span>
            </div>
          ),
        )}
      </nav>
    </div>
  )
}

function QuickCard({ icon, title, desc }: { icon: React.ReactNode; title: React.ReactNode; desc: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#b9d2f3] bg-white px-3 py-3">
      <span aria-hidden="true">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold">{title}</p>
        <p className="text-xs text-neutral-500">{desc}</p>
      </div>
      <ChevronRight className="size-5 text-[#2d5fb4]" aria-hidden="true" />
    </div>
  )
}
