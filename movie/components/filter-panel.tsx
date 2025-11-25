"use client"

import { useState } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export interface FilterOptions {
  sortBy: string
  minRating: number
  genres: number[]
  year: string
}

interface FilterPanelProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  type: "movie" | "tv"
}

const MOVIE_GENRES = [
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

export function FilterPanel({ filters, onFiltersChange, type }: FilterPanelProps) {
  const [open, setOpen] = useState(false)
  const genres = type === "movie" ? MOVIE_GENRES : TV_GENRES

  const toggleGenre = (genreId: number) => {
    const newGenres = filters.genres.includes(genreId)
      ? filters.genres.filter((id) => id !== genreId)
      : [...filters.genres, genreId]
    onFiltersChange({ ...filters, genres: newGenres })
  }

  const clearFilters = () => {
    onFiltersChange({
      sortBy: "popularity.desc",
      minRating: 0,
      genres: [],
      year: "all",
    })
  }

  const activeFiltersCount =
    (filters.sortBy !== "popularity.desc" ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    filters.genres.length +
    (filters.year !== "all" ? 1 : 0)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter & Sort</SheetTitle>
          <SheetDescription>
            Refine your search with advanced filters
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Sort By */}
          <div className="space-y-2">
            <Label>Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity.desc">Popularity (High to Low)</SelectItem>
                <SelectItem value="popularity.asc">Popularity (Low to High)</SelectItem>
                <SelectItem value="vote_average.desc">Rating (High to Low)</SelectItem>
                <SelectItem value="vote_average.asc">Rating (Low to High)</SelectItem>
                <SelectItem value="release_date.desc">Release Date (Newest)</SelectItem>
                <SelectItem value="release_date.asc">Release Date (Oldest)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Minimum Rating</Label>
              <span className="text-sm text-muted-foreground">{filters.minRating.toFixed(1)}+</span>
            </div>
            <Slider
              value={[filters.minRating]}
              onValueChange={([value]) => onFiltersChange({ ...filters, minRating: value })}
              max={10}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* Year */}
          <div className="space-y-2">
            <Label>Release Year</Label>
            <Select
              value={filters.year}
              onValueChange={(value) => onFiltersChange({ ...filters, year: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2010s">2010-2019</SelectItem>
                <SelectItem value="2000s">2000-2009</SelectItem>
                <SelectItem value="1990s">1990-1999</SelectItem>
                <SelectItem value="1980s">1980-1989</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Genres */}
          <div className="space-y-2">
            <Label>Genres</Label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Badge
                  key={genre.id}
                  variant={filters.genres.includes(genre.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleGenre(genre.id)}
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={clearFilters} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <Button onClick={() => setOpen(false)} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
