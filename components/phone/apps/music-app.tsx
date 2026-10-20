import Image from 'next/image'
import { ChevronDown, Menu, Music2, Play, Search, Settings, SkipBack, SkipForward } from 'lucide-react'
import type { Timeline } from '@/lib/timelines'
import { cn } from '@/lib/utils'

export function MusicApp({ timeline }: { timeline: Timeline }) {
  const { tracks, createdAt } = timeline.music
  const nowPlaying = tracks[0]

  return (
    <div className="flex h-full flex-col">
      <header className="flex shrink-0 items-center gap-4 px-5 pt-2 pb-3">
        <h2 className="text-[22px] font-bold text-white">재생목록</h2>
        <span className="text-[22px] font-bold text-white/40">음악서랍</span>
        <span className="text-[22px] font-bold text-white/40">믹스업</span>
        <div className="ml-auto flex items-center gap-4 text-white" aria-hidden="true">
          <Search className="size-6" strokeWidth={1.6} />
          <ChevronDown className="size-7" strokeWidth={1.4} />
        </div>
      </header>

      {tracks.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-white/50">
          <Music2 className="size-12" aria-hidden="true" />
          <p className="text-base">재생목록이 비어 있어요</p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
          <p className="mt-2 flex items-center gap-2 text-lg font-semibold tabular-nums text-white">
            {createdAt}
            <span className="flex size-5 items-center justify-center rounded-full bg-white/30" aria-hidden="true">
              <ChevronDown className="size-3.5 text-neutral-800" strokeWidth={3} />
            </span>
          </p>

          <div className="mt-4 flex items-center gap-3 text-[15px] text-white">
            <span className="size-[18px] rounded-full border border-white/40" aria-hidden="true" />
            {tracks.length}곡
          </div>

          <ol className="mt-2 flex flex-col" aria-label="재생목록">
            {tracks.map((track, i) => {
              const playing = i === 0
              return (
                <li key={track.id} className="flex items-center gap-3 py-2">
                  <span className="size-[18px] shrink-0 rounded-full border border-white/40" aria-hidden="true" />
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-neutral-800">
                    <Image src={track.cover} alt={`${track.title} 앨범 커버`} fill sizes="44px" className="object-cover" />
                    {playing && (
                      <div className="absolute inset-0 flex items-center justify-center gap-[3px] bg-black/30" aria-hidden="true">
                        {[10, 16, 8, 13].map((h, idx) => (
                          <span key={idx} className="w-[3px] rounded-full bg-[#2ee53a]" style={{ height: h }} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn('truncate text-[15px]', playing ? 'text-[#2ee53a]' : 'text-white')}>
                      {track.title}
                      {playing && <span className="sr-only"> (재생 중)</span>}
                    </p>
                    <p className="truncate text-[13px] text-white/50">{track.artist}</p>
                  </div>
                  <Menu className="size-5 shrink-0 text-white/40" strokeWidth={1.4} aria-hidden="true" />
                </li>
              )
            })}
          </ol>
        </div>
      )}

      <div
        className="flex shrink-0 items-center justify-between border-t border-white/15 bg-[#141414] px-6 py-4 text-white"
        aria-hidden="true"
      >
        <Settings className="size-6" strokeWidth={1.6} />
        <SkipBack className="size-6 fill-white" />
        <Play className="size-9 fill-white" />
        <SkipForward className="size-6 fill-white" />
        <div className="relative size-8 overflow-hidden rounded-sm bg-neutral-700">
          {nowPlaying && <Image src={nowPlaying.cover} alt="" fill sizes="32px" className="object-cover" />}
        </div>
      </div>
    </div>
  )
}
