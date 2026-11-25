import type { ReactNode } from 'react'

export default function SectionHeading({
  eyebrow,
  title,
  note,
  action,
  reveal = true,
}: {
  eyebrow: string
  title: string
  note?: string
  action?: ReactNode
  reveal?: boolean
}) {
  return (
    <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl" {...(reveal ? { 'data-reveal': '' } : {})}>
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h2 className="display-title text-[clamp(2.7rem,6vw,5.6rem)] text-bone">{title}</h2>
        {note && <p className="mt-5 max-w-xl text-sm leading-relaxed text-bone-dim md:text-base">{note}</p>}
      </div>
      {action && <div className="shrink-0" {...(reveal ? { 'data-reveal': '' } : {})}>{action}</div>}
    </div>
  )
}
