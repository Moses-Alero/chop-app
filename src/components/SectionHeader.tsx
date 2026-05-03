import type { ReactNode } from 'react'

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  trailing?: ReactNode
}

export function SectionHeader({ eyebrow, title, trailing }: SectionHeaderProps) {
  return (
    <div className="section-head section-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      {trailing ? <div className="section-header__trailing">{trailing}</div> : null}
    </div>
  )
}
