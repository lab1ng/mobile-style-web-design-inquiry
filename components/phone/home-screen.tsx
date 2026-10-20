import Image from 'next/image'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { parseDate, weekdayOf, type Timeline } from '@/lib/timelines'
import { APPS, type AppDef, type AppId } from './apps-registry'

type Props = {
  timeline: Timeline
  hidden: boolean
  onOpenApp: (id: AppId) => void
}

export function HomeScreen({ timeline, hidden, onOpenApp }: Props) {
  const { year, month, day } = parseDate(timeline.id)
  const weekday = weekdayOf(timeline.id)

  return (
    <div
      aria-hidden={hidden}
      inert={hidden}
      className={cn(
        'absolute inset-0 flex flex-col transition-transform duration-300',
        hidden && 'scale-95',
      )}
    >
      <Image
        src={timeline.wallpaper}
        alt=""
        fill
        priority
        sizes="(min-width: 640px) 390px, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative grid grid-cols-4 content-start justify-items-center gap-y-5 px-[22px] pt-[88px]">
        <DateWidget year={year} month={month} day={day} weekday={weekday} time={timeline.time} />
        <AppIcon app={APPS.instagram} onClick={onOpenApp} />
        <AppIcon app={APPS.photos} onClick={onOpenApp} />
        <AppIcon app={APPS.ebsi} onClick={onOpenApp} />
        <AppIcon app={APPS.memo} onClick={onOpenApp} />
        <AppIcon app={APPS.clock} onClick={onOpenApp} />
        <CalendarIcon weekday={weekday} day={day} onClick={() => onOpenApp('calendar')} />
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-[128px] left-1/2 flex h-[30px] -translate-x-1/2 items-center gap-1 rounded-full bg-white/15 px-3 text-[14px] font-medium text-white/90 backdrop-blur-xl"
      >
        <Search className="size-3.5" strokeWidth={2.75} />
        검색
      </div>

      <nav
        aria-label="독"
        className="absolute inset-x-[18px] bottom-[18px] flex h-[98px] items-center justify-around rounded-[40px] bg-white/15 px-3 backdrop-blur-2xl"
      >
        <AppIcon app={APPS.phone} onClick={onOpenApp} hideLabel />
        <AppIcon app={APPS.messages} onClick={onOpenApp} hideLabel />
        <AppIcon app={APPS.naver} onClick={onOpenApp} hideLabel />
        <AppIcon app={APPS.music} onClick={onOpenApp} hideLabel />
      </nav>
    </div>
  )
}

function DateWidget({
  year,
  month,
  day,
  weekday,
  time,
}: {
  year: number
  month: number
  day: number
  weekday: string
  time: string
}) {
  return (
    <section aria-label="날짜" className="col-span-2 row-span-2 flex w-full flex-col items-center gap-1.5 px-[7px]">
      <div className="flex aspect-square w-full flex-col justify-between rounded-[22px] bg-black/35 p-4 shadow-lg backdrop-blur-xl">
        <div className="flex flex-col">
          <span className="text-[13px] font-semibold text-red-400">{weekday}요일</span>
          <span className="text-[15px] font-semibold text-white">
            {month}월 {day}일
          </span>
        </div>
        <div className="flex flex-col items-start gap-1">
          <span className="text-[40px] font-semibold leading-none tracking-tight tabular-nums text-white">{time}</span>
          <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[12px] font-medium text-white/90">{year}</span>
        </div>
      </div>
      <span className="text-[13px] font-medium text-white drop-shadow">시계</span>
    </section>
  )
}

function AppIcon({
  app,
  onClick,
  hideLabel,
}: {
  app: AppDef
  onClick: (id: AppId) => void
  hideLabel?: boolean
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(app.id)}
      className="flex flex-col items-center gap-1.5 transition-transform active:scale-90"
      aria-label={app.name}
    >
      <span
        className={cn(
          'flex size-[63px] items-center justify-center rounded-[15px] shadow-lg',
          app.className,
        )}
      >
        {app.icon}
      </span>
      {!hideLabel && (
        <span className="whitespace-nowrap text-center text-[13px] font-medium tracking-tight text-white drop-shadow">
          {app.name}
        </span>
      )}
    </button>
  )
}

function CalendarIcon({
  weekday,
  day,
  onClick,
}: {
  weekday: string
  day: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 transition-transform active:scale-90"
      aria-label="캘린더"
    >
      <span className="flex size-[63px] flex-col items-center justify-center rounded-[15px] bg-white shadow-lg">
        <span className="text-[11px] font-semibold leading-none text-red-500">{weekday}요일</span>
        <span className="text-3xl font-normal leading-tight text-neutral-900">{day}</span>
      </span>
      <span className="text-[13px] font-medium text-white drop-shadow">캘린더</span>
    </button>
  )
}
