import { cn } from '@/lib/utils'
import type { AppDef } from '../apps-registry'
import { AppBody, AppHeader } from '../app-shell'

export function PlaceholderApp({ app }: { app: AppDef }) {
  return (
    <div className="flex h-full flex-col">
      <AppHeader title={app.name} large />
      <AppBody>
        <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
          <span
            className={cn(
              'flex size-20 items-center justify-center rounded-[1.4rem] shadow-lg',
              app.className,
            )}
          >
            {app.icon}
          </span>
          <p className="text-lg font-semibold text-neutral-200">{app.name}</p>
          <p className="text-sm leading-relaxed text-neutral-500">아직 표시할 내용이 없어요.</p>
        </div>
      </AppBody>
    </div>
  )
}
