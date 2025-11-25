"use client"

import { Heart, Film, Tv, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Providers } from "@/components/providers"
import { useWatchlist } from "@/contexts/watchlist-context"
import { getImageUrl } from "@/lib/tmdb"
import Link from "next/link"

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useWatchlist()

  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 animate-slide-in-left">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Heart className="h-8 w-8 text-red-500 fill-red-500 animate-pulse" />
              <span className="gradient-text">My Watchlist</span>
            </h1>
            <p className="text-muted-foreground animate-fade-in stagger-2">
              {watchlist.length} {watchlist.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          {watchlist.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground animate-pulse" />
              <h2 className="text-2xl font-semibold mb-2">Your Watchlist is Empty</h2>
              <p className="text-muted-foreground mb-6">
                Start adding movies and TV shows you want to watch
              </p>
              <Link href="/">
                <Button className="hover-glow transform hover:scale-105 transition-all duration-300">Browse Content</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {watchlist.map((item) => {
                const isMovie = item.type === "movie"
                const title = isMovie ? ("title" in item ? item.title : "") : ("name" in item ? item.name : "")
                const date = isMovie ? ("release_date" in item ? item.release_date : "") : ("first_air_date" in item ? item.first_air_date : "")

                return (
                  <Card key={item.id} className="group relative card-hover border-border/50 hover:border-primary/30 animate-scale-in overflow-hidden">
                    <CardContent className="p-0">
                      <Link href={`/${item.type}/${item.id}`}>
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
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-black/70 text-white border-none">
                              ⭐ {item.vote_average.toFixed(1)}
                            </Badge>
                          </div>
                          <div className="absolute top-2 left-2">
                            <Badge variant="secondary" className="bg-black/70 text-white border-none">
                              {isMovie ? <Film className="h-3 w-3" /> : <Tv className="h-3 w-3" />}
                            </Badge>
                          </div>
                        </div>
                      </Link>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1">{title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {date ? new Date(date).getFullYear() : "N/A"}
                        </p>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={() => removeFromWatchlist(item.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Providers>
  )
}
