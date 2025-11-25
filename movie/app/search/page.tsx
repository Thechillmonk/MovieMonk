"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Film, Tv } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchMovies, fetchTVShows, type Movie, type TVShow, getImageUrl } from "@/lib/tmdb"
import { Navigation } from "@/components/navigation"
import { Providers } from "@/components/providers"
import Link from "next/link"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [movies, setMovies] = useState<Movie[]>([])
  const [tvShows, setTVShows] = useState<TVShow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function search() {
      if (!query) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const [movieResults, tvResults] = await Promise.all([
          fetchMovies(undefined, query),
          fetchTVShows(undefined, query),
        ])
        setMovies(movieResults.results)
        setTVShows(tvResults.results)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setLoading(false)
      }
    }

    search()
  }, [query])

  const totalResults = movies.length + tvShows.length

  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 animate-slide-in-left">
            <h1 className="text-3xl font-bold mb-2 gradient-text">Search Results</h1>
            {query && (
              <p className="text-muted-foreground animate-fade-in stagger-2">
                Found {totalResults} results for <span className="text-primary font-semibold">"{query}"</span>
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <Card key={i} className="overflow-hidden border-border/50 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <CardContent className="p-0">
                    <div className="aspect-[2/3] skeleton rounded-t-lg" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 skeleton rounded" />
                      <div className="h-3 skeleton rounded w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !query ? (
            <div className="text-center py-20">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">Start Searching</h2>
              <p className="text-muted-foreground">
                Use the search bar above to find movies and TV shows
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-20">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">No Results Found</h2>
              <p className="text-muted-foreground">
                Try searching with different keywords
              </p>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">
                  All ({totalResults})
                </TabsTrigger>
                <TabsTrigger value="movies">
                  <Film className="h-4 w-4 mr-2" />
                  Movies ({movies.length})
                </TabsTrigger>
                <TabsTrigger value="tv">
                  <Tv className="h-4 w-4 mr-2" />
                  TV Shows ({tvShows.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {[...movies, ...tvShows].map((item) => (
                    <SearchResultCard key={`${"title" in item ? "movie" : "tv"}-${item.id}`} item={item} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="movies" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {movies.map((movie) => (
                    <SearchResultCard key={`movie-${movie.id}`} item={movie} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tv" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {tvShows.map((show) => (
                    <SearchResultCard key={`tv-${show.id}`} item={show} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </Providers>
  )
}

function SearchResultCard({ item }: { item: Movie | TVShow }) {
  const isMovie = "title" in item
  const title = isMovie ? item.title : item.name
  const date = isMovie ? item.release_date : item.first_air_date
  const type = isMovie ? "movie" : "tv"

  return (
    <Link href={`/${type}/${item.id}`}>
      <Card className="card-hover cursor-pointer group border-border/50 hover:border-primary/30 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
            <img
              src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "https://via.placeholder.com/500x750/333/999?text=No+Image"}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ease-out"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/500x750/333/999?text=Error";
              }}
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <div className="absolute top-2 right-2 transform group-hover:scale-110 transition-transform duration-300">
              <Badge variant="secondary" className="bg-black/80 backdrop-blur-sm text-white border-none shadow-lg">
                ⭐ {item.vote_average.toFixed(1)}
              </Badge>
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-xs text-muted-foreground">
              {date ? new Date(date).getFullYear() : "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
