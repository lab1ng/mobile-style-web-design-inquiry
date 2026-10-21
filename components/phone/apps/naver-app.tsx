'use client'

import { useState } from 'react'
import { ArrowLeft, Play, Search, X } from 'lucide-react'
import Image from 'next/image'
import type { KnowledgeArticle, Timeline } from '@/lib/timelines'
import { AppBody } from '../app-shell'

function KnowledgeInPage({ article, onBack }: { article: KnowledgeArticle; onBack: () => void }) {
  return (
    <div className="flex h-full flex-col animate-in slide-in-from-right-10 fade-in duration-200">
      <header className="flex h-14 shrink-0 items-center gap-1 border-b border-white/10 pr-4 pl-1">
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로"
          className="flex size-11 items-center justify-center rounded-full active:bg-white/10"
        >
          <ArrowLeft className="size-6" />
        </button>
        <p className="text-lg font-black">
          <span className="text-naver">NAVER</span> <span>지식iN</span>
        </p>
      </header>

      <AppBody className="pb-8">
        <article>
          <section className="border-b-8 border-neutral-900 px-5 pt-5 pb-6">
            <p className="flex items-center gap-2 text-sm font-bold text-naver">
              <span className="flex size-6 items-center justify-center rounded-full bg-naver text-[13px] text-black">
                Q
              </span>
              질문
            </p>
            <h2 className="mt-3 text-[19px] font-bold leading-snug text-pretty">{article.question}</h2>
            <p className="mt-3 text-[13px] text-neutral-500">{article.meta}</p>
          </section>

          <h3 className="px-5 pt-5 pb-2 text-sm font-bold text-neutral-300">답변 {article.answers.length}</h3>
          <ol className="flex flex-col">
            {article.answers.map((a, i) => (
              <li key={i} className="border-b border-white/10 px-5 py-5 last:border-0">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-sm font-bold text-naver">
                    A
                  </span>
                  <div className="flex min-w-0 flex-col">
                    <span className="font-semibold">{a.author}</span>
                    <span className="text-xs text-neutral-500">
                      {a.badge ? <span className="text-naver">{a.badge}</span> : `답변 ${i + 1}`}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-[16px] leading-relaxed text-neutral-200 text-pretty">{a.body}</p>
              </li>
            ))}
          </ol>
        </article>
      </AppBody>
    </div>
  )
}

type Props = {
  timeline: Timeline
  onPlayVideo: (nextTimelineId: string) => void
}

export function NaverApp({ timeline, onPlayVideo }: Props) {
  const { video, news, searches } = timeline.naver
  const [searching, setSearching] = useState(false)

  if (searching) {
    return <RecentSearches searches={searches} onClose={() => setSearching(false)} />
  }

  return (
    <div className="flex h-full flex-col">
      <header className="shrink-0 px-4 pt-1 pb-3">
        <p className="text-2xl font-black text-naver">NAVER</p>
        <button
          type="button"
          onClick={() => setSearching(true)}
          className="mt-3 flex h-12 w-full items-center gap-2 rounded-full border-2 border-naver px-4 text-left active:bg-white/5"
        >
          <Search className="size-5 text-naver" aria-hidden="true" />
          <span className="text-base text-neutral-500">검색어를 입력해 주세요.</span>
        </button>
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

function RecentSearches({
  searches,
  onClose,
}: {
  searches: Timeline['naver']['searches']
  onClose: () => void
}) {
  const [article, setArticle] = useState<KnowledgeArticle | null>(null)

  if (article) return <KnowledgeInPage article={article} onBack={() => setArticle(null)} />

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center gap-1 border-b-2 border-naver pr-3 pl-1">
        <button
          type="button"
          onClick={onClose}
          aria-label="검색 닫기"
          className="flex size-11 items-center justify-center rounded-full active:bg-white/10"
        >
          <ArrowLeft className="size-6" />
        </button>
        <span className="flex-1 text-base text-neutral-500">검색어 또는 URL 입력</span>
        <Search className="size-6 text-naver" strokeWidth={2.6} aria-hidden="true" />
      </header>

      <AppBody className="pb-6">
        {searches.length === 0 ? (
          <p className="px-5 pt-10 text-center text-sm text-neutral-500">최근 검색어가 없습니다.</p>
        ) : (
          <>
            <h2 className="px-5 pt-4 pb-1 text-sm font-bold text-neutral-400">최근 검색어</h2>
            <ul>
              {searches.map((s) => {
                const row = (
                  <>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-800">
                      <Search className="size-4 text-neutral-400" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[16px]">{s.term}</span>
                    <span className="text-sm text-neutral-500 tabular-nums">{s.date}</span>
                    <X className="size-4 text-neutral-500" aria-hidden="true" />
                  </>
                )
                const article = s.article
                return (
                  <li key={s.term}>
                    {article ? (
                      <button
                        type="button"
                        onClick={() => setArticle(article)}
                        className="flex h-14 w-full items-center gap-3 px-5 text-left active:bg-white/5"
                      >
                        {row}
                      </button>
                    ) : (
                      <div className="flex h-14 items-center gap-3 px-5">{row}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </AppBody>
    </div>
  )
}
