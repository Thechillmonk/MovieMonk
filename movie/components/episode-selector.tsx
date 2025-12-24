"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, Play, Calendar, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  fetchTVShowSeason,
  fetchTVShowEpisode,
  getImageUrl,
  getVidLinkTVUrl,
  type Season,
  type Episode,
} from "@/lib/tmdb"
import { VidLinkPlayer } from "@/components/vidlink-player"

interface EpisodeSelectorProps {
  showId: number
  seasons: Season[]
}

export function EpisodeSelector({ showId, seasons }: EpisodeSelectorProps) {
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null)
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null)
  const [seasonEpisodes, setSeasonEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(false)
  const [episodeLoading, setEpisodeLoading] = useState(false)

  // Set the first season as default when seasons are loaded
  useEffect(() => {
    if (seasons.length > 0 && !selectedSeason) {
      setSelectedSeason(seasons[0])
    }
  }, [seasons, selectedSeason])

  // Load episodes when season changes
  useEffect(() => {
    if (selectedSeason) {
      loadSeasonEpisodes(selectedSeason.season_number)
    }
  }, [selectedSeason])

  const loadSeasonEpisodes = async (seasonNumber: number) => {
    setLoading(true)
    try {
      const seasonData = await fetchTVShowSeason(showId, seasonNumber)
      if (seasonData && seasonData.episodes) {
        setSeasonEpisodes(seasonData.episodes)
      }
    } catch (error) {
      console.error("Error loading season episodes:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadEpisodeDetails = async (seasonNumber: number, episodeNumber: number) => {
    setEpisodeLoading(true)
    try {
      const episodeData = await fetchTVShowEpisode(showId, seasonNumber, episodeNumber)
      setSelectedEpisode(episodeData)
    } catch (error) {
      console.error("Error loading episode details:", error)
    } finally {
      setEpisodeLoading(false)
    }
  }

  const handleSeasonChange = (seasonNumber: string) => {
    const season = seasons.find(s => s.season_number === parseInt(seasonNumber))
    setSelectedSeason(season || null)
    setSelectedEpisode(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-6">Episodes</h2>

        {/* Season Selector */}
        <div className="mb-6">
          <Select
            value={selectedSeason?.season_number.toString()}
            onValueChange={handleSeasonChange}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select a season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season.id} value={season.season_number.toString()}>
                  {season.name} ({season.episode_count} episodes)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Episodes List */}
        {selectedSeason && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading episodes...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {seasonEpisodes.map((episode) => (
                  <Card
                    key={episode.id}
                    className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                      selectedEpisode?.id === episode.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => loadEpisodeDetails(selectedSeason.season_number, episode.episode_number)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Episode Still */}
                        <div className="relative w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                          {episode.still_path ? (
                            <img
                              src={getImageUrl(episode.still_path, "w300")}
                              alt={episode.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <Play className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Episode Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">
                              S{selectedSeason.season_number}E{episode.episode_number}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                              {episode.vote_average.toFixed(1)}
                            </div>
                            {episode.runtime && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {episode.runtime}min
                              </div>
                            )}
                          </div>

                          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                            {episode.name}
                          </h3>

                          {episode.air_date && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                              <Calendar className="h-3 w-3" />
                              {new Date(episode.air_date).toLocaleDateString()}
                            </div>
                          )}

                          {episode.overview && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {episode.overview}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Episode Details */}
      {selectedEpisode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Episode Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {episodeLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm">Loading episode details...</p>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-4">
                  {/* Episode Still */}
                  <div className="relative w-48 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                    {selectedEpisode.still_path ? (
                      <img
                        src={getImageUrl(selectedEpisode.still_path, "w500")}
                        alt={selectedEpisode.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Play className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Episode Details */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{selectedEpisode.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <Badge variant="secondary">
                          Season {selectedEpisode.season_number}, Episode {selectedEpisode.episode_number}
                        </Badge>
                        {selectedEpisode.air_date && (
                          <span>{new Date(selectedEpisode.air_date).toLocaleDateString()}</span>
                        )}
                        {selectedEpisode.runtime && (
                          <span>{selectedEpisode.runtime} minutes</span>
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          {selectedEpisode.vote_average.toFixed(1)} ({selectedEpisode.vote_count} votes)
                        </div>
                      </div>
                    </div>

                    {selectedEpisode.overview && (
                      <div>
                        <h4 className="font-semibold mb-2">Overview</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {selectedEpisode.overview}
                        </p>
                      </div>
                    )}

                    {/* Guest Stars */}
                    {selectedEpisode.guest_stars && selectedEpisode.guest_stars.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Guest Stars</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedEpisode.guest_stars.slice(0, 5).map((star) => (
                            <Badge key={star.id} variant="outline" className="text-xs">
                              {star.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Crew */}
                    {selectedEpisode.crew && selectedEpisode.crew.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Crew</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedEpisode.crew.slice(0, 5).map((member) => (
                            <Badge key={member.id} variant="outline" className="text-xs">
                              {member.name} ({member.job})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* VidLink Player */}
                <div className="mt-6">
                  <VidLinkPlayer
                    title={selectedEpisode.name}
                    url={getVidLinkTVUrl(showId, selectedEpisode.season_number, selectedEpisode.episode_number)}
                    type="episode"
                    episodeInfo={{
                      season: selectedEpisode.season_number,
                      episode: selectedEpisode.episode_number
                    }}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}