import { BatteryFull, Signal, Wifi } from 'lucide-react'

export function StatusBar({ time, dark = false }: { time: string; dark?: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-20 flex h-12 items-center justify-between px-8 pt-2 text-[17px] font-semibold ${dark ? 'text-neutral-900' : 'text-white'}`}
    >
      <span className="tabular-nums">{time}</span>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <Signal className="size-4" strokeWidth={2.5} />
        <Wifi className="size-4" strokeWidth={2.5} />
        <BatteryFull className="size-5" strokeWidth={2} />
      </div>
    </div>
  )
}
