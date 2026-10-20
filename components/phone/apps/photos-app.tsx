'use client'

import { Delete, EyeOff, ImageOff, Lock } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import type { PhotoAlbum, Timeline } from '@/lib/timelines'
import { cn } from '@/lib/utils'
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
      return <PasscodeScreen album={album} onBack={closeAlbum} onUnlock={() => setUnlocked(true)} />
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

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'] as const

function PasscodeScreen({
  album,
  onBack,
  onUnlock,
}: {
  album: PhotoAlbum
  onBack: () => void
  onUnlock: () => void
}) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  const press = (key: string) => {
    if (key === 'del') {
      setInput((v) => v.slice(0, -1))
      return
    }
    const next = (input + key).slice(0, 4)
    setError(false)
    if (next.length < 4) {
      setInput(next)
      return
    }
    if (next === album.passcode) {
      setInput('')
      onUnlock()
    } else {
      setInput('')
      setError(true)
    }
  }

  return (
    <div className="flex h-full flex-col animate-in fade-in duration-200">
      <AppHeader title="" onBack={onBack} backLabel="앨범" />
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-8 pb-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <Lock className="size-8 text-neutral-400" aria-hidden />
          <p className="text-lg font-semibold">{`'${album.name}' 앨범이 잠겨 있습니다`}</p>
          <p className={cn('h-5 text-sm', error ? 'text-red-400' : 'text-neutral-500')} role="status">
            {error ? '암호가 올바르지 않습니다' : '암호 4자리를 입력하세요'}
          </p>
          <div className={cn('mt-1 flex gap-4', error && 'animate-in slide-in-from-left-2 duration-150')} aria-hidden>
            {Array.from({ length: 4 }, (_, i) => (
              <span
                key={i}
                className={cn(
                  'size-3.5 rounded-full border border-neutral-300',
                  i < input.length && 'bg-neutral-100',
                )}
              />
            ))}
          </div>
        </div>
        <div className="grid w-full max-w-[270px] grid-cols-3 gap-x-6 gap-y-4">
          {KEYS.map((key, i) =>
            key === '' ? (
              <span key={i} />
            ) : key === 'del' ? (
              <button
                key={i}
                type="button"
                onClick={() => press('del')}
                disabled={input.length === 0}
                className="flex aspect-square items-center justify-center rounded-full text-neutral-300 active:bg-neutral-800 disabled:opacity-30"
                aria-label="지우기"
              >
                <Delete className="size-6" />
              </button>
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => press(key)}
                className="flex aspect-square items-center justify-center rounded-full bg-neutral-800 text-3xl font-light active:bg-neutral-600"
              >
                {key}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  )
}
