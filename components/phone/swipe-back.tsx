'use client'

import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

const START_THRESHOLD = 12
const CLOSE_RATIO = 0.28

export function SwipeBack({
  onBack,
  disabled,
  className,
  children,
}: {
  onBack: () => void
  disabled?: boolean
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const start = useRef<{ x: number; y: number; id: number } | null>(null)
  const swiping = useRef(false)
  const suppressClick = useRef(false)
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    suppressClick.current = false
    if (disabled || (e.pointerType === 'mouse' && e.button !== 0)) return
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId }
    swiping.current = false
  }

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const s = start.current
    if (!s || s.id !== e.pointerId) return
    const dx = e.clientX - s.x
    const dy = e.clientY - s.y

    if (!swiping.current) {
      if (Math.abs(dy) > START_THRESHOLD && Math.abs(dy) > Math.abs(dx)) {
        start.current = null
        return
      }
      if (dx > START_THRESHOLD && dx > Math.abs(dy) * 1.2) {
        swiping.current = true
        setDragging(true)
        ref.current?.setPointerCapture(e.pointerId)
      } else {
        return
      }
    }
    setOffset(Math.max(0, dx - START_THRESHOLD))
  }

  const handlePointerEnd = () => {
    start.current = null
    if (!swiping.current) return
    swiping.current = false
    suppressClick.current = true
    setDragging(false)
    const width = ref.current?.offsetWidth ?? 390
    if (offset > width * CLOSE_RATIO) {
      setOffset(width)
      window.setTimeout(onBack, 180)
    } else {
      setOffset(0)
    }
  }

  return (
    <div
      ref={ref}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onClickCapture={(e) => {
        if (suppressClick.current) {
          e.preventDefault()
          e.stopPropagation()
          suppressClick.current = false
        }
      }}
      style={{
        transform: offset ? `translateX(${offset}px)` : undefined,
        transition: dragging ? 'none' : 'transform 200ms ease-out',
      }}
      className={cn('touch-pan-y', offset > 0 && 'shadow-[-12px_0_32px_rgba(0,0,0,0.6)]', className)}
    >
      {children}
    </div>
  )
}
