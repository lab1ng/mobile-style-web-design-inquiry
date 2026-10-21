'use client'

import { useEffect, useRef } from 'react'

type Props = {
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
  hideCancel?: boolean
  cancelLabel?: string
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  hideCancel,
  cancelLabel = '취소',
}: Props) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    confirmRef.current?.focus()
  }, [])

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 px-12 animate-in fade-in duration-150"
      onKeyDown={(e) => e.key === 'Escape' && onCancel()}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        className="w-full overflow-hidden rounded-2xl bg-neutral-800/95 text-center backdrop-blur-xl animate-in zoom-in-110 duration-200"
      >
        <div className="px-5 pt-5 pb-4">
          <h2 id="confirm-title" className="text-[17px] font-semibold">
            {title}
          </h2>
          {message && (
            <p id="confirm-message" className="mt-1 text-sm text-neutral-300">
              {message}
            </p>
          )}
        </div>
        <div className={`grid border-t border-white/15 ${hideCancel ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {!hideCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="h-12 border-r border-white/15 text-[17px] text-sky-400 active:bg-white/10"
            >
              {cancelLabel}
            </button>
          )}
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className="h-12 text-[17px] font-semibold text-sky-400 active:bg-white/10"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
