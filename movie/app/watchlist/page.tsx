import { Navigation } from "@/components/navigation"
import WatchlistWrapper from "@/components/watchlist-wrapper"

export default function WatchlistPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <WatchlistWrapper />
      </div>
    </div>
  )
}
