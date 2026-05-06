"use client"

import { Providers } from "@/components/providers"
import { Navigation } from "@/components/navigation"
import { AdvancedFilters, type FilterOptions } from "@/components/advanced-filters"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { MovieBrowser } from "@/components/movie-browser"
import { TVBrowser } from "@/components/tv-browser"

export default function LanguagePage() {
  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Browse by Language</h1>
            <p className="text-muted-foreground">Use the language filters inside the browser filters to refine results.</p>
          </div>
          {/* Reuse existing browsers which already support language filters */}
          <div className="grid gap-12">
            <section>
              <h2 className="text-xl font-semibold mb-4">Movies</h2>
              <MovieBrowser />
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-4">TV Shows</h2>
              <TVBrowser />
            </section>
          </div>
        </div>
      </div>
    </Providers>
  )
}
