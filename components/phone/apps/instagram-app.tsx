'use client'

import { useState } from 'react'
import {
  AtSign,
  Camera,
  ChevronDown,
  ChevronLeft,
  Clapperboard,
  Grid3x3,
  Home,
  Lock,
  Menu,
  Plus,
  Search,
  Send,
  SquareUser,
  User,
  UserPlus,
} from 'lucide-react'
import type { InstagramProfile } from '@/lib/timelines'
import { AppBody } from '../app-shell'

type Props = {
  profile: InstagramProfile
}

export function InstagramApp({ profile }: Props) {
  const [view, setView] = useState<'profile' | 'following'>('profile')

  return (
    <div className="flex h-full flex-col">
      {view === 'profile' ? (
        <ProfileView profile={profile} onOpenFollowing={() => setView('following')} />
      ) : (
        <FollowingView profile={profile} onBack={() => setView('profile')} />
      )}
      <BottomNav />
    </div>
  )
}

function DefaultAvatar({ className }: { className: string }) {
  return (
    <span
      className={`flex shrink-0 items-end justify-center overflow-hidden rounded-full bg-[#dbdbdb] ${className}`}
      aria-hidden="true"
    >
      <User className="size-[78%] translate-y-[12%] fill-white text-white" strokeWidth={1} />
    </span>
  )
}

function ProfileView({ profile, onOpenFollowing }: { profile: InstagramProfile; onOpenFollowing: () => void }) {
  return (
    <>
      <header className="flex h-12 shrink-0 items-center justify-between px-3">
        <span className="flex size-11 items-center justify-center" aria-hidden="true">
          <Plus className="size-7" strokeWidth={1.8} />
        </span>
        <h1 className="flex items-center gap-1 text-lg font-bold">
          <Lock className="size-4" strokeWidth={2.4} aria-hidden="true" />
          {profile.username}
          <ChevronDown className="size-4" aria-hidden="true" />
        </h1>
        <span className="flex items-center" aria-hidden="true">
          <span className="flex size-11 items-center justify-center">
            <AtSign className="size-6" strokeWidth={2} />
          </span>
          <span className="flex size-11 items-center justify-center">
            <Menu className="size-7" strokeWidth={1.8} />
          </span>
        </span>
      </header>

      <AppBody className="pb-24">
        <section className="flex items-center gap-5 px-4 pt-3" aria-label="프로필">
          <span className="relative">
            <DefaultAvatar className="size-[86px]" />
            <span className="absolute -right-0.5 -bottom-0.5 flex size-7 items-center justify-center rounded-full border-[3px] border-[#0c1014] bg-white">
              <Plus className="size-4 text-black" strokeWidth={3} aria-hidden="true" />
            </span>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold">{profile.name}</p>
            <dl className="mt-1.5 flex justify-between pr-2">
              <div>
                <dd className="text-lg font-bold leading-tight">{profile.posts}</dd>
                <dt className="text-[14px]">게시물</dt>
              </div>
              <div>
                <dd className="text-lg font-bold leading-tight">{profile.followers}</dd>
                <dt className="text-[14px]">팔로워</dt>
              </div>
              <button
                type="button"
                onClick={onOpenFollowing}
                className="-m-2 rounded-lg p-2 text-left active:bg-white/10"
              >
                <dd className="text-lg font-bold leading-tight">{profile.following.length}</dd>
                <dt className="text-[14px]">팔로잉</dt>
              </button>
            </dl>
          </div>
        </section>

        <div className="mt-4 flex gap-1.5 px-4" aria-hidden="true">
          <span className="flex h-9 flex-1 items-center justify-center rounded-lg bg-[#25292e] text-sm font-semibold">
            프로필 편집
          </span>
          <span className="flex h-9 flex-1 items-center justify-center rounded-lg bg-[#25292e] text-sm font-semibold">
            프로필 공유
          </span>
          <span className="flex h-9 w-10 items-center justify-center rounded-lg bg-[#25292e]">
            <UserPlus className="size-4" />
          </span>
        </div>

        <div className="mt-5 flex border-b border-white/10" aria-hidden="true">
          <span className="flex flex-1 justify-center border-b-2 border-white pb-2.5">
            <Grid3x3 className="size-6" />
          </span>
          <span className="flex flex-1 justify-center pb-2.5 text-neutral-500">
            <Clapperboard className="size-6" />
          </span>
          <span className="flex flex-1 justify-center pb-2.5 text-neutral-500">
            <SquareUser className="size-6" />
          </span>
        </div>

        {profile.posts === 0 && (
          <div className="flex flex-col items-center px-8 pt-14 text-center">
            <span className="flex size-[72px] items-center justify-center rounded-full border-2 border-white">
              <Camera className="size-9" strokeWidth={1.4} aria-hidden="true" />
            </span>
            <p className="mt-4 text-2xl font-extrabold">첫 사진 공유하기</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              사진을 공유하면 회원님의 프로필에 표시됩니다.
            </p>
            <p className="mt-3 text-sm font-semibold text-[#4a5df9]">첫 사진 공유하기</p>
          </div>
        )}
      </AppBody>
    </>
  )
}

function FollowingView({ profile, onBack }: { profile: InstagramProfile; onBack: () => void }) {
  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2 px-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로"
          className="flex size-11 items-center justify-center rounded-full active:bg-white/10"
        >
          <ChevronLeft className="size-7" />
        </button>
        <h1 className="text-lg font-bold">{profile.username}</h1>
      </header>

      <div className="flex shrink-0 border-b border-white/10 text-sm font-semibold" aria-hidden="true">
        <span className="flex-1 pb-2.5 text-center text-neutral-500">팔로워 {profile.followers}명</span>
        <span className="flex-1 border-b-2 border-white pb-2.5 text-center">
          팔로잉 {profile.following.length}명
        </span>
      </div>

      <AppBody className="pb-24">
        <div className="mx-4 mt-3 flex h-10 items-center gap-2 rounded-xl bg-[#25292e] px-3 text-neutral-400" aria-hidden="true">
          <Search className="size-4" />
          <span className="text-base">검색</span>
        </div>

        <ul className="mt-3">
          {profile.following.map((account) => (
            <li key={account.username}>
              <a
                href={account.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 active:bg-white/10"
              >
                <DefaultAvatar className="size-14 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-semibold">{account.username}</span>
                  <span className="block truncate text-sm text-neutral-400">{account.name}</span>
                </span>
                <span className="flex h-8 items-center rounded-lg bg-[#25292e] px-4 text-sm font-semibold">
                  팔로잉
                </span>
              </a>
            </li>
          ))}
        </ul>
      </AppBody>
    </>
  )
}

function BottomNav() {
  return (
    <nav
      aria-hidden="true"
      className="absolute inset-x-4 bottom-2 flex h-16 items-center justify-around rounded-full border border-white/10 bg-[#1c1f24]/90 px-2 backdrop-blur"
    >
      <Home className="size-7" strokeWidth={1.8} />
      <Clapperboard className="size-7" strokeWidth={1.8} />
      <span className="relative">
        <Send className="size-7" strokeWidth={1.8} />
        <span className="absolute -right-0.5 -bottom-0.5 size-2 rounded-full bg-red-500" />
      </span>
      <Search className="size-7" strokeWidth={1.8} />
      <span className="flex h-12 w-16 items-center justify-center rounded-full bg-white/15">
        <DefaultAvatar className="size-8" />
      </span>
    </nav>
  )
}
