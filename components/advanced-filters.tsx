"use client"

import { useState } from "react"
import { Filter, X, Calendar, Star, Clock, Globe2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export interface FilterOptions {
  yearRange: [number, number]
  ratingRange: [number, number]
  runtime: [number, number]
  genres: string[]
  languages: string[]
  sortBy: string
  includeAdult: boolean
}

interface AdvancedFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  type: "movie" | "tv"
}

const MOVIE_GENRES = [
  { id: "28", name: "Action" },
  { id: "12", name: "Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "99", name: "Documentary" },
  { id: "18", name: "Drama" },
  { id: "10751", name: "Family" },
  { id: "14", name: "Fantasy" },
  { id: "36", name: "History" },
  { id: "27", name: "Horror" },
  { id: "10402", name: "Music" },
  { id: "9648", name: "Mystery" },
  { id: "10749", name: "Romance" },
  { id: "878", name: "Science Fiction" },
  { id: "53", name: "Thriller" },
  { id: "10752", name: "War" },
  { id: "37", name: "Western" },
]

const TV_GENRES = [
  { id: "10759", name: "Action & Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "99", name: "Documentary" },
  { id: "18", name: "Drama" },
  { id: "10751", name: "Family" },
  { id: "10762", name: "Kids" },
  { id: "9648", name: "Mystery" },
  { id: "10763", name: "News" },
  { id: "10764", name: "Reality" },
  { id: "10765", name: "Sci-Fi & Fantasy" },
  { id: "10766", name: "Soap" },
  { id: "10767", name: "Talk" },
  { id: "10768", name: "War & Politics" },
  { id: "37", name: "Western" },
]

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "hi", name: "Hindi" },
  { code: "ar", name: "Arabic" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
]

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "popularity.asc", label: "Least Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "vote_average.asc", label: "Lowest Rated" },
  { value: "release_date.desc", label: "Newest First" },
  { value: "release_date.asc", label: "Oldest First" },
  { value: "title.asc", label: "Title A-Z" },
  { value: "title.desc", label: "Title Z-A" },
]

export function AdvancedFilters({ filters, onFiltersChange, type }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const genres = type === "movie" ? MOVIE_GENRES : TV_GENRES

  const updateFilters = (updates: Partial<FilterOptions>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const toggleGenre = (genreId: string) => {
    const newGenres = filters.genres.includes(genreId)
      ? filters.genres.filter((id) => id !== genreId)
      : [...filters.genres, genreId]
    updateFilters({ genres: newGenres })
  }

  const toggleLanguage = (langCode: string) => {
    const newLanguages = filters.languages.includes(langCode)
      ? filters.languages.filter((code) => code !== langCode)
      : [...filters.languages, langCode]
    updateFilters({ languages: newLanguages })
  }

  const resetFilters = () => {
    onFiltersChange({
      yearRange: [1900, new Date().getFullYear() + 2],
      ratingRange: [0, 10],
      runtime: [0, 300],
      genres: [],
      languages: [],
      sortBy: "popularity.desc",
      includeAdult: false,
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.yearRange[0] !== 1900 || filters.yearRange[1] !== new Date().getFullYear() + 2) count++
    if (filters.ratingRange[0] !== 0 || filters.ratingRange[1] !== 10) count++
    if (filters.runtime[0] !== 0 || filters.runtime[1] !== 300) count++
    if (filters.genres.length > 0) count++
    if (filters.languages.length > 0) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative bg-transparent">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-6" align="start">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Advanced Filters</h3>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Year Range */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <Label className="text-sm font-medium">Release Year</Label>
            </div>
            <div className="px-2">
              <Slider
                value={filters.yearRange}
                onValueChange={(value) => updateFilters({ yearRange: value as [number, number] })}
                min={1900}
                max={new Date().getFullYear() + 2}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{filters.yearRange[0]}</span>
                <span>{filters.yearRange[1]}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Rating Range */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <Label className="text-sm font-medium">Rating</Label>
            </div>
            <div className="px-2">
              <Slider
                value={filters.ratingRange}
                onValueChange={(value) => updateFilters({ ratingRange: value as [number, number] })}
                min={0}
                max={10}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{filters.ratingRange[0].toFixed(1)}</span>
                <span>{filters.ratingRange[1].toFixed(1)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Runtime */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <Label className="text-sm font-medium">Runtime (minutes)</Label>
            </div>
            <div className="px-2">
              <Slider
                value={filters.runtime}
                onValueChange={(value) => updateFilters({ runtime: value as [number, number] })}
                min={0}
                max={300}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{filters.runtime[0]}m</span>
                <span>{filters.runtime[1]}m</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Genres */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Genres</Label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {genres.map((genre) => (
                <Badge
                  key={genre.id}
                  variant={filters.genres.includes(genre.id) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => toggleGenre(genre.id)}
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Languages */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4" />
              <Label className="text-sm font-medium">Languages</Label>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {LANGUAGES.map((language) => (
                <Badge
                  key={language.code}
                  variant={filters.languages.includes(language.code) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => toggleLanguage(language.code)}
                >
                  {language.name}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Sort By */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Sort By</Label>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
