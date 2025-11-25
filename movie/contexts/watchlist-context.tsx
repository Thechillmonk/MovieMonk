"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import type { Movie, TVShow } from "@/lib/tmdb"

type WatchlistItem = (Movie | TVShow) & { type: "movie" | "tv" }

interface WatchlistContextType {
  watchlist: WatchlistItem[]
  addToWatchlist: (item: Movie | TVShow, type: "movie" | "tv") => void
  removeFromWatchlist: (id: number) => void
  isInWatchlist: (id: number) => boolean
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined)

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("moviemonk-watchlist")
    if (stored) {
      try {
        setWatchlist(JSON.parse(stored))
      } catch (error) {
        console.error("Error loading watchlist:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("moviemonk-watchlist", JSON.stringify(watchlist))
    }
  }, [watchlist, isLoaded])

  const addToWatchlist = (item: Movie | TVShow, type: "movie" | "tv") => {
    setWatchlist((prev) => {
      if (prev.some((i) => i.id === item.id)) {
        return prev
      }
      return [...prev, { ...item, type }]
    })
  }

  const removeFromWatchlist = (id: number) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id))
  }

  const isInWatchlist = (id: number) => {
    return watchlist.some((item) => item.id === id)
  }

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlist() {
  const context = useContext(WatchlistContext)
  if (context === undefined) {
    throw new Error("useWatchlist must be used within a WatchlistProvider")
  }
  return context
}
