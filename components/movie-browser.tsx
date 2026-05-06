"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Search, Grid, List, Star, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdvancedFilters, type FilterOptions } from "@/components/advanced-filters"
import { useDebounce } from "@/hooks/use-debounce"
import { fetchMovies, type Movie, getImageUrl } from "@/lib/tmdb"

const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
]

export function MovieBrowser({ initialCategory = "popular" }: { initialCategory?: string }) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentCategory, setCurrentCategory] = useState<string>(initialCategory)
  const [filters, setFilters] = useState<FilterOptions>({
    yearRange: [1900, new Date().getFullYear() + 2],
    ratingRange: [0, 10],
    runtime: [0, 300],
    genres: [],
    languages: [],
    sortBy: "popularity.desc",
    includeAdult: false,
  })

  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  useEffect(() => {
    loadMovies()
  }, [currentCategory, filters, debouncedSearchQuery])

  const loadMovies = async () => {
    setLoading(true)
    try {
      let movies: Movie[] = []

      if (debouncedSearchQuery.trim()) {
        const response = await fetchMovies(undefined, debouncedSearchQuery)
        movies = response.results
      } else {
        const response = await fetchMovies(currentCategory)
        movies = response.results
      }

      const filteredMovies = movies.filter((movie) => {
        // Year filter
        const releaseYear = new Date(movie.release_date).getFullYear()
        if (releaseYear < filters.yearRange[0] || releaseYear > filters.yearRange[1]) return false

        // Rating filter
        if (movie.vote_average < filters.ratingRange[0] || movie.vote_average > filters.ratingRange[1]) return false

        // Genre filter
        if (filters.genres.length > 0) {
          const hasMatchingGenre = filters.genres.some((genreId) => movie.genre_ids.includes(Number.parseInt(genreId)))
          if (!hasMatchingGenre) return false
        }

        // Language filter
        if (filters.languages.length > 0 && !filters.languages.includes(movie.original_language)) return false

        // Adult content filter
        if (!filters.includeAdult && movie.adult) return false

        return true
      })

      // Apply sorting
      switch (filters.sortBy) {
        case "popularity.desc":
          filteredMovies.sort((a, b) => b.popularity - a.popularity)
          break
        case "popularity.asc":
          filteredMovies.sort((a, b) => a.popularity - b.popularity)
          break
        case "vote_average.desc":
          filteredMovies.sort((a, b) => b.vote_average - a.vote_average)
          break
        case "vote_average.asc":
          filteredMovies.sort((a, b) => a.vote_average - b.vote_average)
          break
        case "release_date.desc":
          filteredMovies.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
          break
        case "release_date.asc":
          filteredMovies.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime())
          break
        case "title.asc":
          filteredMovies.sort((a, b) => a.title.localeCompare(b.title))
          break
        case "title.desc":
          filteredMovies.sort((a, b) => b.title.localeCompare(a.title))
          break
      }

      setMovies(filteredMovies)
    } catch (error) {
      console.error("Error loading movies:", error)
    } finally {
      setLoading(false)
    }
  }

  const getGenreName = (genreIds: number[]) => {
    const genreNames = genreIds
      .slice(0, 2)
      .map((id) => GENRES.find((genre) => genre.id === id)?.name)
      .filter(Boolean)
    return genreNames.join(", ")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Movies</h1>
        <p className="text-muted-foreground">Discover your next favorite movie</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search movies..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <AdvancedFilters filters={filters} onFiltersChange={setFilters} type="movie" />
        </div>

        {/* Category Tabs - Hide when searching */}
        {!debouncedSearchQuery.trim() && (
          <Tabs value={currentCategory} onValueChange={setCurrentCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-md">
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="top_rated">Top Rated</TabsTrigger>
              <TabsTrigger value="now_playing">Now Playing</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {/* View Controls */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${movies.length} movies found`}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i} className="bg-muted animate-pulse">
              <CardContent className="p-0">
                <div className="aspect-[2/3] bg-muted-foreground/20 rounded-t-lg" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted-foreground/20 rounded" />
                  <div className="h-3 bg-muted-foreground/20 rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Movies Grid */}
      {!loading && viewMode === "grid" && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`} className="block">
              <Card className="bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
                <CardContent className="p-0">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
                    <img
                      src={getImageUrl(movie.poster_path) || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-black/70 text-white border-none">
                        <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                        {movie.vote_average.toFixed(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{movie.title}</h3>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    </div>

                    {movie.genre_ids.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {getGenreName(movie.genre_ids)
                          .split(", ")
                          .map((genre, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Movies List */}
      {!loading && viewMode === "list" && (
        <div className="space-y-4">
          {movies.map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`} className="block">
              <Card className="bg-card hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="relative w-24 aspect-[2/3] overflow-hidden rounded-lg flex-shrink-0">
                      <img
                        src={getImageUrl(movie.poster_path, "w200") || "/placeholder.svg"}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{movie.title}</h3>
                        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          {movie.vote_average.toFixed(1)}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(movie.release_date).getFullYear()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{movie.original_language.toUpperCase()}</span>
                        </div>
                      </div>

                      {movie.genre_ids.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {getGenreName(movie.genre_ids)
                            .split(", ")
                            .map((genre, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {genre}
                              </Badge>
                            ))}
                        </div>
                      )}

                      <p className="text-muted-foreground line-clamp-2">{movie.overview}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && movies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No movies found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
