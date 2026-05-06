"use client"

import { useEffect, useState } from "react"
import { Search, Grid, List, Star, Calendar, Clock, Tv } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdvancedFilters, type FilterOptions } from "@/components/advanced-filters"
import { useDebounce } from "@/hooks/use-debounce"
import { fetchTVShows, type TVShow, getImageUrl } from "@/lib/tmdb"

const TV_GENRES = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" },
]

export function TVBrowser({ initialCategory = "popular" }: { initialCategory?: string }) {
  const [shows, setShows] = useState<TVShow[]>([])
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
    loadTVShows()
  }, [currentCategory, filters, debouncedSearchQuery])

  const loadTVShows = async () => {
    setLoading(true)
    try {
      let shows: TVShow[] = []

      if (debouncedSearchQuery.trim()) {
        const response = await fetchTVShows(undefined, debouncedSearchQuery)
        shows = response.results
      } else {
        const response = await fetchTVShows(currentCategory)
        shows = response.results
      }

      const filteredShows = shows.filter((show) => {
        // Year filter
        const airYear = new Date(show.first_air_date).getFullYear()
        if (airYear < filters.yearRange[0] || airYear > filters.yearRange[1]) return false

        // Rating filter
        if (show.vote_average < filters.ratingRange[0] || show.vote_average > filters.ratingRange[1]) return false

        // Genre filter
        if (filters.genres.length > 0) {
          const hasMatchingGenre = filters.genres.some((genreId) => show.genre_ids.includes(Number.parseInt(genreId)))
          if (!hasMatchingGenre) return false
        }

        // Language filter
        if (filters.languages.length > 0 && !filters.languages.includes(show.original_language)) return false

        return true
      })

      // Apply sorting
      switch (filters.sortBy) {
        case "popularity.desc":
          filteredShows.sort((a, b) => b.popularity - a.popularity)
          break
        case "popularity.asc":
          filteredShows.sort((a, b) => a.popularity - b.popularity)
          break
        case "vote_average.desc":
          filteredShows.sort((a, b) => b.vote_average - a.vote_average)
          break
        case "vote_average.asc":
          filteredShows.sort((a, b) => a.vote_average - b.vote_average)
          break
        case "release_date.desc":
          filteredShows.sort((a, b) => new Date(b.first_air_date).getTime() - new Date(a.first_air_date).getTime())
          break
        case "release_date.asc":
          filteredShows.sort((a, b) => new Date(a.first_air_date).getTime() - new Date(b.first_air_date).getTime())
          break
        case "title.asc":
          filteredShows.sort((a, b) => a.name.localeCompare(b.name))
          break
        case "title.desc":
          filteredShows.sort((a, b) => b.name.localeCompare(a.name))
          break
      }

      setShows(filteredShows)
    } catch (error) {
      console.error("Error loading TV shows:", error)
    } finally {
      setLoading(false)
    }
  }

  const getGenreName = (genreIds: number[]) => {
    const genreNames = genreIds
      .slice(0, 2)
      .map((id) => TV_GENRES.find((genre) => genre.id === id)?.name)
      .filter(Boolean)
    return genreNames.join(", ")
  }

  const formatAirDate = (dateString: string) => {
    if (!dateString) return "TBA"
    return new Date(dateString).getFullYear()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">TV Shows</h1>
        <p className="text-muted-foreground">Explore the best television series from around the world</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search TV shows..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <AdvancedFilters filters={filters} onFiltersChange={setFilters} type="tv" />
        </div>

        {/* Category Tabs - Hide when searching */}
        {!debouncedSearchQuery.trim() && (
          <Tabs value={currentCategory} onValueChange={setCurrentCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-md">
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="top_rated">Top Rated</TabsTrigger>
              <TabsTrigger value="on_the_air">On Air</TabsTrigger>
              <TabsTrigger value="airing_today">Today</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {/* View Controls */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${shows.length} TV shows found`}
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

      {/* TV Shows Grid */}
      {!loading && viewMode === "grid" && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {shows.map((show) => (
            <Card key={show.id} className="bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
              <CardContent className="p-0">
                <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
                  <img
                    src={getImageUrl(show.poster_path) || "/placeholder.svg"}
                    alt={show.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-black/70 text-white border-none">
                      <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                      {show.vote_average.toFixed(1)}
                    </Badge>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-primary/80 text-primary-foreground border-none">
                      <Tv className="h-3 w-3 mr-1" />
                      TV
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{show.name}</h3>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-3 w-3" />
                    <span>{formatAirDate(show.first_air_date)}</span>
                  </div>

                  {show.genre_ids.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {getGenreName(show.genre_ids)
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
          ))}
        </div>
      )}

      {/* TV Shows List */}
      {!loading && viewMode === "list" && (
        <div className="space-y-4">
          {shows.map((show) => (
            <Card key={show.id} className="bg-card hover:bg-accent/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="relative w-24 aspect-[2/3] overflow-hidden rounded-lg flex-shrink-0">
                    <img
                      src={getImageUrl(show.poster_path, "w200") || "/placeholder.svg"}
                      alt={show.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-foreground">{show.name}</h3>
                        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                          <Tv className="h-3 w-3 mr-1" />
                          TV
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        {show.vote_average.toFixed(1)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatAirDate(show.first_air_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{show.original_language.toUpperCase()}</span>
                      </div>
                      {show.origin_country.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs">📍</span>
                          <span>{show.origin_country.join(", ")}</span>
                        </div>
                      )}
                    </div>

                    {show.genre_ids.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {getGenreName(show.genre_ids)
                          .split(", ")
                          .map((genre, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                      </div>
                    )}

                    <p className="text-muted-foreground line-clamp-2">{show.overview}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && shows.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📺</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No TV shows found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
