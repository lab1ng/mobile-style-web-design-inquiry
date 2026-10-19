import Image from 'next/image'
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
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative flex flex-1 flex-col px-6 pt-20 pb-28">
        <section aria-label="날짜" className="flex flex-col items-center text-center">
          <p className="text-lg font-medium text-white/85">
            {month}월 {day}일 {weekday}요일
          </p>
          <p className="text-7xl font-bold tracking-tight tabular-nums text-white">{timeline.time}</p>
          <p className="mt-1 rounded-full bg-white/15 px-3 py-0.5 text-xs font-medium text-white/90 backdrop-blur">
            {year}
          </p>
        </section>

        <div className="mt-12 grid grid-cols-4 gap-x-4 gap-y-6">
          <CalendarIcon weekday={weekday} day={day} onClick={() => onOpenApp('calendar')} />
          <AppIcon app={APPS.memo} onClick={onOpenApp} />
          <AppIcon app={APPS.naver} onClick={onOpenApp} />
          <AppIcon app={APPS.photos} onClick={onOpenApp} />
        </div>
      </div>

      <nav
        aria-label="독"
        className="absolute inset-x-3 bottom-6 flex justify-around rounded-[2rem] bg-white/20 px-4 py-3 backdrop-blur-xl"
      >
        <AppIcon app={APPS.phone} onClick={onOpenApp} hideLabel />
        <AppIcon app={APPS.messages} onClick={onOpenApp} hideLabel />
      </nav>
    </div>
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
      className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform"
      aria-label={app.name}
    >
      <span
        className={cn(
          'flex size-[60px] items-center justify-center rounded-[1.1rem] shadow-lg',
          app.className,
        )}
      >
        {app.icon}
      </span>
      {!hideLabel && (
        <span className="text-xs font-medium text-white drop-shadow">{app.name}</span>
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
      className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform"
      aria-label="캘린더"
    >
      <span className="flex size-[60px] flex-col items-center justify-center rounded-[1.1rem] bg-white shadow-lg">
        <span className="text-[11px] font-semibold leading-none text-red-500">{weekday}요일</span>
        <span className="text-3xl font-normal leading-tight text-neutral-900">{day}</span>
      </span>
      <span className="text-xs font-medium text-white drop-shadow">캘린더</span>
    </button>
  )
}
