'use client'

import { EyeOff, ImageOff, Lock } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import type { PhotoAlbum, Timeline } from '@/lib/timelines'
import { PasscodeScreen } from '../passcode-screen'
import { AppBody, AppHeader, EmptyState } from '../app-shell'

export function PhotosApp({ timeline }: { timeline: Timeline }) {
  const [albumId, setAlbumId] = useState<string | null>(null)
  const [photoId, setPhotoId] = useState<string | null>(null)
  const [unlocked, setUnlocked] = useState(false)

  const album = timeline.albums.find((a) => a.id === albumId)
  const photo = album?.photos.find((p) => p.id === photoId)

  const closeAlbum = () => {
    setAlbumId(null)
    setUnlocked(false)
  }

  if (album && photo) {
    return (
      <div className="flex h-full flex-col bg-black animate-in fade-in zoom-in-95 duration-200">
        <AppHeader title="" onBack={() => setPhotoId(null)} backLabel={album.name} />
        <div className="relative min-h-0 flex-1">
          <Image src={photo.src} alt={photo.alt} fill sizes="390px" className="object-contain" />
        </div>
      </div>
    )
  }

  if (album) {
    if (album.passcode && !unlocked) {
      return (
        <PasscodeScreen
          title={`'${album.name}' 앨범이 잠겨 있습니다`}
          passcode={album.passcode}
          backLabel="앨범"
          onBack={closeAlbum}
          onUnlock={() => setUnlocked(true)}
        />
      )
    }
    return <AlbumGrid album={album} onBack={closeAlbum} onOpenPhoto={setPhotoId} />
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="앨범" large />
      <AppBody className="px-4 pb-6">
        <ul className="grid grid-cols-2 gap-x-3 gap-y-4">
          {timeline.albums.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => setAlbumId(a.id)}
                className="block w-full text-left active:opacity-70"
                aria-label={`${a.name} 앨범 열기${a.passcode ? ' (잠김)' : ''}`}
              >
                <AlbumCover album={a} />
                <p className="mt-1.5 truncate text-[15px] font-medium">{a.name}</p>
                <p className="text-sm text-neutral-500">{a.passcode ? '잠김' : `${a.photos.length}`}</p>
              </button>
            </li>
          ))}
        </ul>
      </AppBody>
    </div>
  )
}

function AlbumCover({ album }: { album: PhotoAlbum }) {
  const cover = album.photos[0]
  const showIcon = album.passcode || album.hidden || !cover

  if (showIcon) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-neutral-800 text-neutral-400">
        {album.passcode ? (
          <Lock className="size-10" aria-hidden />
        ) : album.hidden ? (
          <EyeOff className="size-10" aria-hidden />
        ) : (
          <ImageOff className="size-10" aria-hidden />
        )}
      </div>
    )
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-800">
      <Image src={cover.src} alt="" fill sizes="190px" className="object-cover" />
    </div>
  )
}

function AlbumGrid({
  album,
  onBack,
  onOpenPhoto,
}: {
  album: PhotoAlbum
  onBack: () => void
  onOpenPhoto: (id: string) => void
}) {
  return (
    <div className="flex h-full flex-col animate-in fade-in slide-in-from-right-4 duration-200">
      <AppHeader title={album.name} onBack={onBack} backLabel="앨범" />
      <AppBody>
        {album.photos.length === 0 ? (
          <EmptyState icon={<ImageOff className="size-12" />} title="사진 없음" description="이 앨범에 사진이 없습니다." />
        ) : (
          <>
            <ul className="grid grid-cols-3 gap-0.5">
              {album.photos.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => onOpenPhoto(p.id)}
                    className="relative block aspect-square w-full overflow-hidden active:opacity-70"
                    aria-label={`${p.alt} 사진 보기`}
                  >
                    <Image src={p.src} alt={p.alt} fill sizes="130px" className="object-cover" />
                  </button>
                </li>
              ))}
            </ul>
            <p className="py-4 text-center text-sm text-neutral-500">사진 {album.photos.length}장</p>
          </>
        )}
      </AppBody>
    </div>
  )
}
