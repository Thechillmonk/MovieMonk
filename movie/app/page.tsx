import { MovieHero } from "@/components/movie-hero"
import { MovieSection } from "@/components/movie-section"
import { Navigation } from "@/components/navigation"
import { Providers } from "@/components/providers"
import { SkipToContent } from "@/components/skip-to-content"

export default function HomePage() {
  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <SkipToContent />
        <Navigation />
        <MovieHero />
        <main id="main-content" className="space-y-8 pb-8">
          <MovieSection title="Popular Movies" endpoint="popular" type="movie" />
          <MovieSection title="Top Rated Movies" endpoint="top_rated" type="movie" />
          <MovieSection title="Popular TV Shows" endpoint="popular" type="tv" />
          <MovieSection title="Top Rated TV Shows" endpoint="top_rated" type="tv" />
        </main>
      </div>
    </Providers>
  )
}
