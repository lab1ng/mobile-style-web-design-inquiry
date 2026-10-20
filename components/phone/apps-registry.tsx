import { Camera, Clock, Compass, Images, MessageSquare, Music, NotebookPen, Phone } from 'lucide-react'
import type { ReactNode } from 'react'

export type AppId =
  | 'instagram'
  | 'photos'
  | 'ebsi'
  | 'memo'
  | 'clock'
  | 'calendar'
  | 'phone'
  | 'messages'
  | 'naver'
  | 'music'

export type AppDef = {
  id: AppId
  name: string
  className: string
  icon: ReactNode
}

export const APPS: Record<Exclude<AppId, 'calendar'>, AppDef> = {
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    className: 'bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5]',
    icon: <Camera className="size-8 text-white" strokeWidth={2.2} />,
  },
  photos: {
    id: 'photos',
    name: '사진',
    className: 'bg-white',
    icon: <Images className="size-8 text-orange-500" strokeWidth={2.2} />,
  },
  ebsi: {
    id: 'ebsi',
    name: 'EBSi 고교강의',
    className: 'bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8]',
    icon: <span className="text-lg font-black leading-none tracking-tight text-white">EBSi</span>,
  },
  memo: {
    id: 'memo',
    name: '메모',
    className: 'bg-gradient-to-b from-[#fde68a] to-[#facc15]',
    icon: <NotebookPen className="size-7 text-amber-900" strokeWidth={2.2} />,
  },
  clock: {
    id: 'clock',
    name: '시계',
    className: 'bg-black ring-1 ring-white/15',
    icon: <Clock className="size-9 text-white" strokeWidth={1.8} />,
  },
  phone: {
    id: 'phone',
    name: '전화',
    className: 'bg-gradient-to-b from-[#5ef77a] to-[#1ec33f]',
    icon: <Phone className="size-7 fill-white text-white" />,
  },
  messages: {
    id: 'messages',
    name: '문자',
    className: 'bg-gradient-to-b from-[#5ef77a] to-[#1ec33f]',
    icon: <MessageSquare className="size-7 fill-white text-white" />,
  },
  naver: {
    id: 'naver',
    name: 'Safari',
    className: 'bg-white',
    icon: <Compass className="size-10 text-[#1a8cff]" strokeWidth={1.6} />,
  },
  music: {
    id: 'music',
    name: '음악',
    className: 'bg-gradient-to-b from-[#3ee65a] to-[#00b33c]',
    icon: <Music className="size-8 text-white" strokeWidth={2.4} />,
  },
}
