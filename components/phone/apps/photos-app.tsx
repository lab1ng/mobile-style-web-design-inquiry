'use client'

import { ImageOff } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import type { Timeline } from '@/lib/timelines'
import { AppBody, AppHeader, EmptyState } from '../app-shell'

export function PhotosApp({ timeline }: { timeline: Timeline }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const photo = timeline.photos.find((p) => p.id === openId)

  if (photo) {
    return (
      <div className="flex h-full flex-col bg-black animate-in fade-in zoom-in-95 duration-200">
        <AppHeader title="" onBack={() => setOpenId(null)} backLabel="사진" />
        <div className="relative min-h-0 flex-1">
          <Image src={photo.src} alt={photo.alt} fill sizes="390px" className="object-contain" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="사진" large />
      <AppBody>
        {timeline.photos.length === 0 ? (
          <EmptyState icon={<ImageOff className="size-12" />} title="사진 없음" description="아직 찍은 사진이 없습니다." />
        ) : (
          <>
            <ul className="grid grid-cols-3 gap-0.5">
              {timeline.photos.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(p.id)}
                    className="relative block aspect-square w-full overflow-hidden active:opacity-70"
                    aria-label={`${p.alt} 사진 보기`}
                  >
                    <Image src={p.src} alt={p.alt} fill sizes="130px" className="object-cover" />
                  </button>
                </li>
              ))}
            </ul>
            <p className="py-4 text-center text-sm text-neutral-500">사진 {timeline.photos.length}장</p>
          </>
        )}
      </AppBody>
    </div>
  )
}
