"use client"

"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Play, Heart, Star, Calendar, Clock, DollarSign, Users, Film, Award, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  fetchMovieRecommendations,
  type Movie,
  type TMDBResponse,
  getVidLinkMovieUrl,
} from "@/lib/tmdb"
import { VidLinkPlayer } from "@/components/vidlink-player"

export default function MovieWatchPage() {
  const params = useParams()
  const id = Number(params.id)
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [credits, setCredits] = useState<Credits | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [providers, setProviders] = useState<WatchProvidersResponse | null>(null)
  const [recommendations, setRecommendations] = useState<TMDBResponse<Movie> | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [movieData, creditsData, videosData, providersData, recommendationsData] = await Promise.all([
        fetchMovieDetails(id),
        fetchMovieCredits(id),
        fetchMovieVideos(id),
        fetchMovieWatchProviders(id),
        fetchMovieRecommendations(id),
      ])
      setMovie(movieData)
      setCredits(creditsData)
      setVideos(videosData)
      setProviders(providersData)
      setRecommendations(recommendationsData)
      setLoading(false)
    }
    loadData()
  }, [id])

  const trailer = videos.find((v) => v.type === "Trailer" && v.site === "YouTube")
  const teasers = videos.filter((v) => v.type === "Teaser" && v.site === "YouTube")
  const clips = videos.filter((v) => v.type === "Clip" && v.site === "YouTube")
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
          <div className="h-[60vh] bg-muted" />
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

        {/* Hero Section with Video Player */}
        <div className="relative min-h-screen overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${getBackdropUrl(movie.backdrop_path, "original")})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />

          <div className="relative z-10 container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[80vh] items-center">

              {/* Movie Poster and Basic Info */}
              <div className="lg:col-span-1">
                <Card className="overflow-hidden shadow-2xl">
                  <CardContent className="p-0">
                    <img
                      src={getImageUrl(movie.poster_path, "w500")}
                      alt={movie.title}
                      className="w-full aspect-[2/3] object-cover"
                    />
                  </CardContent>
                </Card>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      <Star className="h-4 w-4 mr-1 fill-yellow-500 text-yellow-500" />
                      {movie.vote_average.toFixed(1)}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(movie.release_date).getFullYear()}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {movie.runtime} min
                    </Badge>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {movie.genres.map((genre) => (
                      <Badge key={genre.id} variant="secondary">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg">
                    {movie.title}
                  </h1>
                  {movie.tagline && (
                    <p className="text-xl text-white/90 italic mb-6 drop-shadow">
                      {movie.tagline}
                    </p>
                  )}
                  <p className="text-lg text-white/80 leading-relaxed mb-8 drop-shadow">
                    {movie.overview}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {trailer && (
                    <Button
                      size="lg"
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank")}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Play className="h-5 w-5 mr-2 fill-current" />
                      Watch Trailer
                    </Button>
                  )}
                  <Button
                    size="lg"
                    variant={inWatchlist ? "destructive" : "outline"}
                    onClick={handleWatchlistToggle}
                    className={inWatchlist ? "" : "border-white text-white hover:bg-white hover:text-black"}
                  >
                    <Heart className={`h-5 w-5 mr-2 ${inWatchlist ? "fill-current" : ""}`} />
                    {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <Card className="bg-white/10 backdrop-blur border-white/20">
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-white" />
                      <p className="text-2xl font-bold text-white">{movie.vote_count.toLocaleString()}</p>
                      <p className="text-sm text-white/80">Votes</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/10 backdrop-blur border-white/20">
                    <CardContent className="p-4 text-center">
                      <Film className="h-8 w-8 mx-auto mb-2 text-white" />
                      <p className="text-2xl font-bold text-white">{movie.popularity.toFixed(0)}</p>
                      <p className="text-sm text-white/80">Popularity</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/10 backdrop-blur border-white/20">
                    <CardContent className="p-4 text-center">
                      <DollarSign className="h-8 w-8 mx-auto mb-2 text-white" />
                      <p className="text-2xl font-bold text-white">
                        {movie.budget > 0 ? `$${(movie.budget / 1000000).toFixed(0)}M` : "N/A"}
                      </p>
                      <p className="text-sm text-white/80">Budget</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/10 backdrop-blur border-white/20">
                    <CardContent className="p-4 text-center">
                      <Award className="h-8 w-8 mx-auto mb-2 text-white" />
                      <p className="text-2xl font-bold text-white">
                        {movie.revenue > 0 ? `$${(movie.revenue / 1000000).toFixed(0)}M` : "N/A"}
                      </p>
                      <p className="text-sm text-white/80">Revenue</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Content Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

            {/* Main Content */}
            <div className="xl:col-span-3 space-y-12">

              {/* Trailer Section */}
              {(trailer || teasers.length > 0 || clips.length > 0) && (
                <section>
                  <h2 className="text-3xl font-bold mb-6">Videos</h2>
                  <div className="space-y-6">
                    {trailer && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Play className="h-5 w-5" />
                            Official Trailer
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
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
                        </CardContent>
                      </Card>
                    )}

                    {teasers.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Teasers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {teasers.slice(0, 4).map((video) => (
                            <Card key={video.id}>
                              <CardContent className="p-4">
                                <div className="aspect-video rounded-lg overflow-hidden mb-3">
                                  <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${video.key}`}
                                    title={video.name}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                  />
                                </div>
                                <p className="font-medium">{video.name}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {clips.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Clips</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {clips.slice(0, 4).map((video) => (
                            <Card key={video.id}>
                              <CardContent className="p-4">
                                <div className="aspect-video rounded-lg overflow-hidden mb-3">
                                  <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${video.key}`}
                                    title={video.name}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                  />
                                </div>
                                <p className="font-medium">{video.name}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                   </div>
                 </section>
               )}

               {/* VidLink Player */}
               <section>
                 <h2 className="text-3xl font-bold mb-6">Watch Now</h2>
                 <VidLinkPlayer
                   title={movie.title}
                   url={getVidLinkMovieUrl(movie.id)}
                   type="movie"
                 />
               </section>

               {/* Cast Section */}
              {credits && credits.cast.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-6">Cast</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {credits.cast.slice(0, 20).map((member) => (
                      <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                          <div className="p-4">
                            <p className="font-semibold text-sm line-clamp-1">{member.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {member.character}
                            </p>
                            <Badge variant="outline" className="text-xs mt-2">
                              #{member.order + 1}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Crew Section */}
              {credits && credits.crew.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-6">Crew</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {credits.crew
                      .filter((member) => ["Director", "Writer", "Producer", "Cinematographer", "Editor", "Composer"].includes(member.job))
                      .slice(0, 12)
                      .map((member, index) => (
                        <Card key={`${member.id}-${member.job}-${index}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
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
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold line-clamp-1">{member.name}</p>
                                <p className="text-sm text-muted-foreground">{member.job}</p>
                                <p className="text-xs text-muted-foreground mt-1">{member.department}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </section>
               )}

               {/* VidLink Player */}
               {movie && (
                 <section>
                   <h2 className="text-3xl font-bold mb-6">Watch Now</h2>
                   <VidLinkPlayer
                     title={movie.title}
                     url={getVidLinkMovieUrl(movie.id)}
                     type="movie"
                   />
                 </section>
               )}

               {/* Recommendations */}
              {recommendations && recommendations.results.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-6">You Might Also Like</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {recommendations.results.slice(0, 10).map((movie) => (
                      <Card key={movie.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="p-0">
                          <Link href={`/watch/movie/${movie.id}`}>
                            <div className="aspect-[2/3] relative">
                              <img
                                src={getImageUrl(movie.poster_path)}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                              <div className="absolute top-2 right-2">
                                <Badge variant="secondary" className="bg-black/70 text-white border-none text-xs">
                                  ⭐ {movie.vote_average.toFixed(1)}
                                </Badge>
                              </div>
                            </div>
                          </Link>
                          <div className="p-3">
                            <Link href={`/watch/movie/${movie.id}`}>
                              <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors">
                                {movie.title}
                              </h3>
                            </Link>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(movie.release_date).getFullYear()}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">

              {/* Movie Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Movie Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1">Status</h4>
                    <p className="text-sm text-muted-foreground">{movie.status}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-1">Original Language</h4>
                    <p className="text-sm text-muted-foreground uppercase">{movie.original_language}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-1">Original Title</h4>
                    <p className="text-sm text-muted-foreground">{movie.original_title}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-1">Release Date</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(movie.release_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-1">Adult Content</h4>
                    <p className="text-sm text-muted-foreground">{movie.adult ? "Yes" : "No"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Where to Watch */}
              {providers && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="h-5 w-5" />
                      Where to Watch
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const region = (typeof navigator !== 'undefined' && navigator.language ? navigator.language.split('-')[1] : 'US') || 'US'
                      const entry = providers.results?.[region]
                      if (!entry) return <p className="text-sm text-muted-foreground">Not available in your region</p>

                      const renderProviders = (label: string, list?: { provider_id: number; provider_name: string; logo_path: string | null }[]) => (
                        list && list.length > 0 ? (
                          <div>
                            <h4 className="font-semibold mb-2 text-sm">{label}</h4>
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
                        <div className="space-y-4">
                          {renderProviders('Stream', entry.flatrate)}
                          {renderProviders('Rent', entry.rent)}
                          {renderProviders('Buy', entry.buy)}
                          {renderProviders('With Ads', entry.ads)}
                          {renderProviders('Free', entry.free)}
                          {entry.link && (
                            <Button variant="outline" size="sm" asChild className="w-full mt-4">
                              <a href={entry.link} target="_blank" rel="noreferrer">
                                View on TMDb
                              </a>
                            </Button>
                          )}
                        </div>
                      )
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Production Companies */}
              {movie.production_companies.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Production Companies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {movie.production_companies.map((company) => (
                        <div key={company.id} className="flex items-center gap-3">
                          {company.logo_path && (
                            <img
                              src={getImageUrl(company.logo_path, "w92")}
                              alt={company.name}
                              className="w-8 h-8 object-contain rounded"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium line-clamp-1">{company.name}</p>
                            <p className="text-xs text-muted-foreground">{company.origin_country}</p>
                          </div>
                        </div>
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