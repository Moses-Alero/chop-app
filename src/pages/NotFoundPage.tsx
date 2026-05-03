import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="screen center-screen">
      <section className="card empty-state">
        <h1>Page not found</h1>
        <Link to="/" className="primary-cta inline-cta">
          Back Home
        </Link>
      </section>
    </main>
  )
}
