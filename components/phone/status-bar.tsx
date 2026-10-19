import { BatteryFull, Signal, Wifi } from 'lucide-react'

export function StatusBar({ time }: { time: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-12 items-center justify-between px-7 pt-1 text-[15px] font-semibold text-white">
      <span className="tabular-nums">{time}</span>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <Signal className="size-4" strokeWidth={2.5} />
        <Wifi className="size-4" strokeWidth={2.5} />
        <BatteryFull className="size-5" strokeWidth={2} />
      </div>
    </div>
  )
}
