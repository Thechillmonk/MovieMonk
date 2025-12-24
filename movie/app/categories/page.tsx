"use client"

import { useSearchParams } from "next/navigation"
import { Providers } from "@/components/providers"
import { Navigation } from "@/components/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { MovieBrowser } from "@/components/movie-browser"
import { TVBrowser } from "@/components/tv-browser"

export default function CategoriesPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get("category") || "popular"

  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Browse by Categories</h1>
            <p className="text-muted-foreground">Switch between Movies and TV Shows and use the category tabs and search.</p>
          </div>

          <Tabs defaultValue="movies" className="w-full">
            <TabsList className="grid w-full max-w-sm grid-cols-2">
              <TabsTrigger value="movies">Movies</TabsTrigger>
              <TabsTrigger value="tv">TV Shows</TabsTrigger>
            </TabsList>
            <TabsContent value="movies" className="pt-6">
              <MovieBrowser initialCategory={category} />
            </TabsContent>
            <TabsContent value="tv" className="pt-6">
              <TVBrowser initialCategory={category} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Providers>
  )
}
