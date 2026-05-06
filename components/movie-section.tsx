"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Star, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchMovies, fetchTVShows, type Movie, type TVShow, getImageUrl } from "@/lib/tmdb"
import Link from "next/link"

interface MovieSectionProps {
  title: string
  endpoint: string
  type: "movie" | "tv"
}

export function MovieSection({ title, endpoint, type }: MovieSectionProps) {
  const [items, setItems] = useState<(Movie | TVShow)[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    async function loadItems() {
      setLoading(true)
      setPage(1)
      try {
        if (type === "movie") {
          const response = await fetchMovies(endpoint, undefined, 1)
          setItems(response.results)
          setTotalPages(response.total_pages || 1)
        } else {
          const response = await fetchTVShows(endpoint, undefined, 1)
          setItems(response.results)
          setTotalPages(response.total_pages || 1)
        }
      } catch (error) {
        console.error(`Error loading ${type} ${endpoint}:`, error)
        setItems([])
        setTotalPages(1)
      } finally {
        setLoading(false)
      }
    }

    loadItems()
  }, [endpoint, type])

  const loadMore = async () => {
    if (loadingMore) return
    if (page >= totalPages) return
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      if (type === "movie") {
        const response = await fetchMovies(endpoint, undefined, nextPage)
        setItems((prev) => [...prev, ...response.results])
      } else {
        const response = await fetchTVShows(endpoint, undefined, nextPage)
        setItems((prev) => [...prev, ...response.results])
      }
      setPage((p) => p + 1)
    } catch (error) {
      console.error(`Error loading more ${type} ${endpoint}:`, error)
    } finally {
      setLoadingMore(false)
    }
  }

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById(`scroll-${title.replace(/\s+/g, "-")}`)
    if (container) {
      const scrollAmount = 320 // Width of card + gap
      const newPosition =
        direction === "left" ? Math.max(0, scrollPosition - scrollAmount * 3) : scrollPosition + scrollAmount * 3

      container.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  if (loading) {
    return (
      <section className="px-4 animate-fade-in">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-40 sm:w-48 md:w-60 lg:w-72 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <Card className="bg-card border-border/50 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-[2/3] skeleton rounded-t-lg" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 skeleton rounded" />
                      <div className="h-3 skeleton rounded w-2/3" />
                      <div className="h-3 skeleton rounded w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll("left")} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll("right")} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          id={`scroll-${title.replace(/\s+/g, "-")}`}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, index) => (
            <Link key={item.id} href={`/${type}/${item.id}`}>
              <Card
                className={`flex-shrink-0 w-40 sm:w-48 md:w-60 lg:w-72 bg-card hover:bg-accent/50 card-hover cursor-pointer group border-border/50 hover:border-primary/30 animate-fade-in stagger-${Math.min(index + 1, 5)}`}
              >
                <CardContent className="p-0">
                  <div className="relative w-full" style={{ aspectRatio: '2/3' }}>
                    <img
                      src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "https://via.placeholder.com/500x750/333/999?text=No+Image"}
                      alt={"title" in item ? item.title : item.name}
                      className="w-full h-full object-cover rounded-t-lg group-hover:scale-110 transition-all duration-500 ease-out"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/500x750/333/999?text=Error";
                        console.error('Image failed:', target.src);
                      }}
                      onLoad={() => console.log('Image loaded:', item.poster_path)}
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    <div className="absolute top-2 right-2 transform group-hover:scale-110 transition-transform duration-300">
                      <Badge variant="secondary" className="bg-black/80 backdrop-blur-sm text-white border-none shadow-lg">
                        <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                        {item.vote_average.toFixed(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
                      {"title" in item ? item.title : item.name}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {"release_date" in item
                          ? new Date(item.release_date).getFullYear()
                          : new Date(item.first_air_date).getFullYear()}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">{item.overview}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-2 flex justify-center">
          <Button variant="outline" size="sm" onClick={loadMore} disabled={loadingMore || page >= totalPages}>
            {loadingMore ? "Loading..." : page >= totalPages ? "No more" : "Load more"}
          </Button>
        </div>
      </div>
    </section>
  )
}
