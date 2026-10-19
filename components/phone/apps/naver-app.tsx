import { Play, Search } from 'lucide-react'
import Image from 'next/image'
import type { Timeline } from '@/lib/timelines'
import { AppBody } from '../app-shell'

type Props = {
  timeline: Timeline
  onPlayVideo: (nextTimelineId: string) => void
}

export function NaverApp({ timeline, onPlayVideo }: Props) {
  const { video, news } = timeline.naver

  return (
    <div className="flex h-full flex-col">
      <header className="shrink-0 px-4 pt-1 pb-3">
        <p className="text-2xl font-black text-naver">NAVER</p>
        <div className="mt-3 flex h-12 items-center gap-2 rounded-full border-2 border-naver px-4">
          <Search className="size-5 text-naver" aria-hidden="true" />
          <span className="text-base text-neutral-500">검색어를 입력해 주세요.</span>
        </div>
      </header>

      <AppBody className="flex flex-col gap-6 px-4 pb-6">
        {video && (
          <section aria-labelledby="naver-video">
            <h2 id="naver-video" className="mb-2 text-sm font-bold text-neutral-300">
              지금 많이 보는 영상
            </h2>
            <button
              type="button"
              onClick={() => onPlayVideo(video.nextTimelineId)}
              className="group block w-full overflow-hidden rounded-2xl bg-neutral-900 text-left active:scale-[0.98] transition-transform"
            >
              <span className="relative block aspect-video">
                <Image src={video.thumbnail} alt="" fill sizes="360px" className="object-cover" />
                <span className="absolute inset-0 bg-black/20" />
                <span className="absolute top-2 left-2 rounded bg-red-600 px-1.5 py-0.5 text-[11px] font-bold">
                  {video.duration}
                </span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex size-14 items-center justify-center rounded-full bg-black/50 backdrop-blur">
                    <Play className="ml-1 size-7 fill-white text-white" />
                  </span>
                </span>
              </span>
              <span className="block px-3 py-3 font-semibold leading-snug">{video.title}</span>
            </button>
          </section>
        )}

        <section aria-labelledby="naver-news">
          <h2 id="naver-news" className="mb-2 text-sm font-bold text-neutral-300">
            뉴스
          </h2>
          <ul className="overflow-hidden rounded-2xl bg-neutral-900">
            {news.map((n) => (
              <li key={n.id} className="border-b border-white/10 px-4 py-3 last:border-0">
                <p className="leading-snug">{n.title}</p>
                <p className="mt-1 text-xs text-neutral-500">{n.source}</p>
              </li>
            ))}
          </ul>
        </section>
      </AppBody>
    </div>
  )
}
