import { Images, MessageCircle, NotebookPen, Phone } from 'lucide-react'
import type { ReactNode } from 'react'

export type AppId = 'messages' | 'photos' | 'memo' | 'phone' | 'naver' | 'calendar'

export type AppDef = {
  id: AppId
  name: string
  className: string
  icon: ReactNode
}

export const APPS: Record<Exclude<AppId, 'calendar'>, AppDef> = {
  messages: {
    id: 'messages',
    name: '메시지',
    className: 'bg-gradient-to-b from-[#5ef77a] to-[#1ec33f]',
    icon: <MessageCircle className="size-8 fill-white text-white" />,
  },
  photos: {
    id: 'photos',
    name: '사진',
    className: 'bg-white',
    icon: <Images className="size-8 text-orange-500" strokeWidth={2.2} />,
  },
  memo: {
    id: 'memo',
    name: '메모',
    className: 'bg-gradient-to-b from-[#fde68a] to-[#facc15]',
    icon: <NotebookPen className="size-7 text-amber-900" strokeWidth={2.2} />,
  },
  phone: {
    id: 'phone',
    name: '전화',
    className: 'bg-gradient-to-b from-[#5ef77a] to-[#1ec33f]',
    icon: <Phone className="size-7 fill-white text-white" />,
  },
  naver: {
    id: 'naver',
    name: 'NAVER',
    className: 'bg-naver',
    icon: <span className="text-3xl font-black leading-none text-white">N</span>,
  },
}
