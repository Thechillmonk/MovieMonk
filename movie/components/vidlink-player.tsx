"use client"

import { useState } from "react"
import { Play, Settings, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface VidLinkPlayerProps {
  title: string
  url: string
  type: 'movie' | 'tv' | 'episode'
  episodeInfo?: {
    season: number
    episode: number
  }
  className?: string
}

export function VidLinkPlayer({ title, url, type, episodeInfo, className = "" }: VidLinkPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [customizeOpen, setCustomizeOpen] = useState(false)
  const [playerOptions, setPlayerOptions] = useState({
    primaryColor: '#B20710',
    secondaryColor: '#170000',
    iconColor: '#B20710',
    icons: 'default' as 'vid' | 'default',
    title: true,
    poster: true,
    autoplay: false,
    nextbutton: type === 'tv',
    player: 'default' as 'jw' | 'default',
    startAt: 0,
    sub_file: '',
    sub_label: ''
  })

  const getCurrentUrl = () => {
    const options = {
      ...playerOptions,
      primaryColor: playerOptions.primaryColor.replace('#', ''),
      secondaryColor: playerOptions.secondaryColor.replace('#', ''),
      iconColor: playerOptions.iconColor.replace('#', ''),
    }
    return url.includes('?') ? url : `${url}?${new URLSearchParams(options as any).toString()}`
  }

  const openExternal = () => {
    window.open(getCurrentUrl(), '_blank')
  }

  if (!isPlaying) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <CardContent className="p-0">
          <div className="relative aspect-video bg-muted flex items-center justify-center group cursor-pointer"
               onClick={() => setIsPlaying(true)}>
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20" />

            {/* Play button */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="h-8 w-8 text-primary-foreground ml-1" fill="currentColor" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {type === 'episode' && episodeInfo
                    ? `S${episodeInfo.season}E${episodeInfo.episode}: ${title}`
                    : title
                  }
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {type === 'movie' ? 'Movie' : type === 'episode' ? 'Episode' : 'TV Show'}
                </Badge>
              </div>
            </div>

            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Dialog open={customizeOpen} onOpenChange={setCustomizeOpen}>
                <DialogTrigger asChild>
                  <Button size="icon" variant="secondary" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Customize Player</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <Input
                          id="primaryColor"
                          type="color"
                          value={playerOptions.primaryColor}
                          onChange={(e) => setPlayerOptions(prev => ({ ...prev, primaryColor: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={playerOptions.secondaryColor}
                          onChange={(e) => setPlayerOptions(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="iconColor">Icon Color</Label>
                      <Input
                        id="iconColor"
                        type="color"
                        value={playerOptions.iconColor}
                        onChange={(e) => setPlayerOptions(prev => ({ ...prev, iconColor: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="icons">Icon Style</Label>
                      <Select
                        value={playerOptions.icons}
                        onValueChange={(value: 'vid' | 'default') =>
                          setPlayerOptions(prev => ({ ...prev, icons: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="vid">VidLink</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="player">Player Type</Label>
                      <Select
                        value={playerOptions.player}
                        onValueChange={(value: 'jw' | 'default') =>
                          setPlayerOptions(prev => ({ ...prev, player: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="jw">JW Player</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="title"
                          checked={playerOptions.title}
                          onCheckedChange={(checked) =>
                            setPlayerOptions(prev => ({ ...prev, title: checked }))
                          }
                        />
                        <Label htmlFor="title">Show Title</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="poster"
                          checked={playerOptions.poster}
                          onCheckedChange={(checked) =>
                            setPlayerOptions(prev => ({ ...prev, poster: checked }))
                          }
                        />
                        <Label htmlFor="poster">Show Poster</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="autoplay"
                          checked={playerOptions.autoplay}
                          onCheckedChange={(checked) =>
                            setPlayerOptions(prev => ({ ...prev, autoplay: checked }))
                          }
                        />
                        <Label htmlFor="autoplay">Autoplay</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="nextbutton"
                          checked={playerOptions.nextbutton}
                          onCheckedChange={(checked) =>
                            setPlayerOptions(prev => ({ ...prev, nextbutton: checked }))
                          }
                        />
                        <Label htmlFor="nextbutton">Next Episode</Label>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="startAt">Start At (seconds)</Label>
                      <Input
                        id="startAt"
                        type="number"
                        value={playerOptions.startAt}
                        onChange={(e) => setPlayerOptions(prev => ({ ...prev, startAt: parseInt(e.target.value) || 0 }))}
                        min="0"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sub_file">Subtitle File URL</Label>
                      <Input
                        id="sub_file"
                        type="url"
                        value={playerOptions.sub_file}
                        onChange={(e) => setPlayerOptions(prev => ({ ...prev, sub_file: e.target.value }))}
                        placeholder="https://example.com/subtitles.vtt"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sub_label">Subtitle Label</Label>
                      <Input
                        id="sub_label"
                        value={playerOptions.sub_label}
                        onChange={(e) => setPlayerOptions(prev => ({ ...prev, sub_label: e.target.value }))}
                        placeholder="English"
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button size="icon" variant="secondary" onClick={openExternal} className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            {type === 'episode' && episodeInfo
              ? `S${episodeInfo.season}E${episodeInfo.episode}: ${title}`
              : title
            }
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPlaying(false)}
            >
              Stop
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={openExternal}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open External
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full">
          <iframe
            src={getCurrentUrl()}
            className="w-full h-full rounded-lg border-0"
            allowFullScreen
            allow="autoplay; encrypted-media"
            title={`${title} - VidLink Player`}
          />
        </div>
      </CardContent>
    </Card>
  )
}