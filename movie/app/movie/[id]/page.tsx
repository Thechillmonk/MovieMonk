"use client"

"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import type { Metadata } from "next"
import { Play, Heart, Star, Calendar, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"
import { useWatchlist } from "@/contexts/watchlist-context"
import {
  fetchMovieDetails,
  fetchMovieCredits,
  fetchMovieVideos,
  getBackdropUrl,
  getImageUrl,
  type MovieDetails,
  type Credits,
  type Video,
  fetchMovieWatchProviders,
  type WatchProvidersResponse,
  getVidLinkMovieUrl,
} from "@/lib/tmdb"
import { VidLinkPlayer } from "@/components/vidlink-player"

export default function MovieDetailPage() {
  const params = useParams()
  const id = Number(params.id)
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [credits, setCredits] = useState<Credits | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [providers, setProviders] = useState<WatchProvidersResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [movieData, creditsData, videosData, providersData] = await Promise.all([
        fetchMovieDetails(id),
        fetchMovieCredits(id),
        fetchMovieVideos(id),
        fetchMovieWatchProviders(id),
      ])
      setMovie(movieData)
      setCredits(creditsData)
      setVideos(videosData)
      setProviders(providersData)
      setLoading(false)
    }
    loadData()
  }, [id])

  const trailer = videos.find((v) => v.type === "Trailer" && v.site === "YouTube")
  const inWatchlist = movie ? isInWatchlist(movie.id) : false

  const handleWatchlistToggle = () => {
    if (!movie) return
    if (inWatchlist) {
      removeFromWatchlist(movie.id)
    } else {
      addToWatchlist(movie, "movie")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="animate-pulse">
          <div className="h-[70vh] bg-muted" />
          <div className="container mx-auto px-4 py-8">
            <div className="h-8 bg-muted rounded w-1/3 mb-4" />
            <div className="h-4 bg-muted rounded w-2/3 mb-8" />
          </div>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Movie Not Found</h1>
          <p className="text-muted-foreground">The movie you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
        <Navigation />

        {/* Hero Section */}
        <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${getBackdropUrl(movie.backdrop_path, "original")})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 p-4 sm:p-6 lg:p-8 max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground italic mb-3 sm:mb-4">{movie.tagline}</p>
            )}

            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 flex-wrap">
              <Badge variant="secondary" className="text-sm sm:text-base lg:text-lg px-2 sm:px-3 py-1">
                <Star className="h-4 w-4 mr-1 fill-yellow-500 text-yellow-500" />
                {movie.vote_average.toFixed(1)}
              </Badge>
              <Badge variant="outline" className="text-sm sm:text-base">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(movie.release_date).getFullYear()}
              </Badge>
              <Badge variant="outline" className="text-sm sm:text-base">
                <Clock className="h-4 w-4 mr-1" />
                {movie.runtime} min
              </Badge>
              {movie.genres.map((genre) => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              {trailer && (
                <Button
                  size="sm"
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank")}
                >
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2 fill-current" />
                  Watch Trailer
                </Button>
              )}
              <Button
                size="sm"
                variant={inWatchlist ? "destructive" : "outline"}
                onClick={handleWatchlistToggle}
              >
                <Heart className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 ${inWatchlist ? "fill-current" : ""}`} />
                {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              </Button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
               {/* Overview */}
               <section>
                 <h2 className="text-2xl font-bold mb-4">Overview</h2>
                 <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
               </section>

               {/* Watch Now */}
               <section>
                 <h2 className="text-2xl font-bold mb-4">Watch Now</h2>
                 <VidLinkPlayer
                   title={movie.title}
                   url={getVidLinkMovieUrl(movie.id)}
                   type="movie"
                 />
               </section>

               {/* Cast */}
              {credits && credits.cast.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Cast</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {credits.cast.slice(0, 8).map((member) => (
                      <Card key={member.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="aspect-[2/3] relative">
                            <img
                              src={getImageUrl(member.profile_path)}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder-user.jpg";
                              }}
                            />
                          </div>
                          <div className="p-3">
                            <p className="font-semibold text-sm line-clamp-1">{member.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {member.character}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Trailer */}
              {trailer && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Trailer</h2>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${trailer.key}`}
                      title={trailer.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Status</h3>
                    <p className="text-muted-foreground">{movie.status}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Original Language</h3>
                    <p className="text-muted-foreground uppercase">{movie.original_language}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Budget</h3>
                    <p className="text-muted-foreground">
                      {movie.budget > 0 ? `$${movie.budget.toLocaleString()}` : "N/A"}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Revenue</h3>
                    <p className="text-muted-foreground">
                      {movie.revenue > 0 ? `$${movie.revenue.toLocaleString()}` : "N/A"}
                    </p>
                  </div>
                  {credits && credits.crew.find((c) => c.job === "Director") && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-semibold mb-2">Director</h3>
                        <p className="text-muted-foreground">
                          {credits.crew.find((c) => c.job === "Director")?.name}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Where to Watch */}
              {providers && (
                <Card>
                  <CardContent className="p-6 space-y-3">
                    <h3 className="font-semibold">Where to Watch</h3>
                    {(() => {
                      const region = (typeof navigator !== 'undefined' && navigator.language ? navigator.language.split('-')[1] : 'US') || 'US'
                      const entry = providers.results?.[region]
                      if (!entry) return <p className="text-sm text-muted-foreground">Not available in your region</p>
                      const renderRow = (label: string, list?: { provider_id: number; provider_name: string; logo_path: string | null }[]) => (
                        list && list.length > 0 ? (
                          <div>
                            <p className="text-sm font-medium mb-1">{label}</p>
                            <div className="flex flex-wrap gap-2">
                              {list.map(p => (
                                <Badge key={p.provider_id} variant="outline" className="text-xs">
                                  {p.provider_name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ) : null
                      )
                      return (
                        <div className="space-y-3">
                          {renderRow('Stream', entry.flatrate)}
                          {renderRow('Rent', entry.rent)}
                          {renderRow('Buy', entry.buy)}
                          {renderRow('Ads', entry.ads)}
                          {renderRow('Free', entry.free)}
                          <Separator />
                          <a className="text-sm text-primary underline" href={entry.link} target="_blank" rel="noreferrer">View on TMDb</a>
                        </div>
                      )
                    })()}
                  </CardContent>
                </Card>
              )}

              {movie.production_companies.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Production Companies</h3>
                    <div className="space-y-2">
                      {movie.production_companies.map((company) => (
                        <p key={company.id} className="text-sm text-muted-foreground">
                          {company.name}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}
