"use client";

import { useEffect, useState } from "react";
import { Play, Info, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchMovies, type Movie, getBackdropUrl } from "@/lib/tmdb";

export function MovieHero() {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedMovie() {
      try {
        const response = await fetchMovies("popular");
        if (response.results.length > 0) {
          // Get a random movie from the first 5 popular movies
          const randomIndex = Math.floor(
            Math.random() * Math.min(5, response.results.length)
          );
          setFeaturedMovie(response.results[randomIndex]);
        }
      } catch (error) {
        console.error("Error loading featured movie:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedMovie();
  }, []);

  if (loading) {
    return (
      <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] bg-muted animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>
    );
  }

  if (!featuredMovie) {
    return (
      <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 sm:p-6 lg:p-8 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            Welcome to MovieMonk
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-4 sm:mb-6">
            Hop in the World of Everything You need
          </p>
        </div>
      </div>
    );
  }

  return (
    <section 
      className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden animate-fade-in"
      aria-label="Featured Movie"
    >
      {/* Background Image with parallax effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax scale-110 transition-transform duration-700"
        style={{
          backgroundImage: featuredMovie.backdrop_path 
            ? `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
        role="img"
        aria-label={`${featuredMovie.title} backdrop`}
      />

      {/* Enhanced Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/40" aria-hidden="true" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-4 sm:p-6 lg:p-8 max-w-2xl space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 mb-3 sm:mb-4 animate-slide-in-left stagger-1">
          <Badge
            variant="secondary"
            className="bg-primary/20 backdrop-blur-sm text-primary border-primary/30 shadow-lg"
          >
            Featured
          </Badge>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-4 w-4 fill-current animate-pulse" />
            <span className="text-sm font-medium">
              {featuredMovie.vote_average.toFixed(1)}
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 text-balance animate-slide-in-left stagger-2 drop-shadow-2xl">
          {featuredMovie.title}
        </h1>

        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-4 sm:mb-6 text-pretty line-clamp-3 animate-slide-in-left stagger-3 drop-shadow-lg">
          {featuredMovie.overview}
        </p>

        <div className="flex items-center gap-3 sm:gap-4 animate-slide-in-left stagger-4">
          <Button size="sm" className="sm:size-default bg-primary hover:bg-primary/90 hover-glow shadow-xl transform hover:scale-105 transition-all duration-300">
            <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2 fill-current" />
            Watch Now
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-foreground/20 hover:bg-foreground/10 bg-transparent backdrop-blur-sm shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Info className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            More Info
          </Button>
        </div>
      </div>
    </section>
  );
}
