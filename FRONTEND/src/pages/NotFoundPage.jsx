import { Link } from "react-router-dom"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page not found</p>
        <Link to="/" className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition">
          Go Home
        </Link>
      </div>
    </div>
  )
}
