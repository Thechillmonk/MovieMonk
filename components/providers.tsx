"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { FontProvider } from "@/components/font-provider"
import { WatchlistProvider } from "@/contexts/watchlist-context"
import { AuthProvider } from "@/components/auth-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <FontProvider>
        <AuthProvider>
          <WatchlistProvider>
            {children}
          </WatchlistProvider>
        </AuthProvider>
      </FontProvider>
    </ThemeProvider>
  )
}