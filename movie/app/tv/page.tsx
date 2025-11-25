import { TVBrowser } from "@/components/tv-browser"
import { Navigation } from "@/components/navigation"
import { Providers } from "@/components/providers"

export default function TVPage() {
  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <Navigation />
        <TVBrowser />
      </div>
    </Providers>
  )
}
