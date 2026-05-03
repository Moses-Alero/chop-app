import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

type PageHeaderProps = {
  title: string
  subtitle?: string
  backTo?: string
}

export function PageHeader({ title, subtitle, backTo }: PageHeaderProps) {
  return (
    <header className="page-header sticky-header">
      <div className="page-header__row">
        {backTo ? (
          <Link to={backTo} className="back-link icon-button" aria-label="Go back">
            <ChevronLeft size={16} />
          </Link>
        ) : null}
        <div className="page-header__content">
          <h1>{title}</h1>
          {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
        </div>
      </div>
    </header>
  )
}
