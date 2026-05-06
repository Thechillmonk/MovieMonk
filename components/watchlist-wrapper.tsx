"use client"

import dynamic from "next/dynamic"

const WatchlistContent = dynamic(() => import("@/components/watchlist-content"), {
  ssr: false,
  loading: () => (
    <div className="text-center py-20 animate-fade-in">
      <div className="h-16 w-16 mx-auto mb-4 bg-muted animate-pulse rounded-full" />
      <h2 className="text-2xl font-semibold mb-2">Loading Watchlist...</h2>
    </div>
  ),
})

export default function WatchlistWrapper() {
  return <WatchlistContent />
}