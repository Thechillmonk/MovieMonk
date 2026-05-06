import { MovieBrowser } from "@/components/movie-browser"
import { Navigation } from "@/components/navigation"
import { Providers } from "@/components/providers"

export default function MoviesPage() {
  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <Navigation />
        <MovieBrowser />
      </div>
    </Providers>
  )
}
