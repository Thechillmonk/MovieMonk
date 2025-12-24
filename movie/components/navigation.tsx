"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Menu, Film, Tv, Star, Globe, Heart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { FontToggle } from "@/components/font-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { AuthDialog } from "@/components/auth-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navigation() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-border/50 shadow-lg animate-slide-in-left">
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/30 shadow-sm">
              <Image
                src="/movielogo.png"
                alt="MovieMonk logo"
                width={32}
                height={32}
                className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 object-contain"
                priority
              />
            </span>
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-foreground tracking-tight">
              MovieMonk
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/movies">
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary"
              >
                <Film className="h-4 w-4 mr-2" />
                Movies
              </Button>
            </Link>
            <Link href="/tv">
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary"
              >
                <Tv className="h-4 w-4 mr-2" />
                TV Shows
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-foreground hover:text-primary"
                >
                  <span className="inline-flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Categories
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/categories?category=popular">Popular</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categories?category=top_rated">Top Rated</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categories?category=now_playing">Now Playing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categories?category=upcoming">Upcoming</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Link href="/language">
                  <Button
                    asChild={false}
                    variant="ghost"
                    className="text-foreground hover:text-primary"
                  >
                    <span className="inline-flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Language
                    </span>
                  </Button>
                </Link>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Spanish</DropdownMenuItem>
                <DropdownMenuItem>French</DropdownMenuItem>
                <DropdownMenuItem>German</DropdownMenuItem>
                <DropdownMenuItem>Japanese</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search and Theme Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search movies, TV shows..."
                className="pl-10 w-44 sm:w-56 md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <Link href="/watchlist">
              <Button variant="ghost" size="icon" title="My Watchlist">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <FontToggle />
            <ThemeToggle />
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <User className="h-4 w-4 mr-2" />
                    {user?.name}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AuthDialog />
            )}
            
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
