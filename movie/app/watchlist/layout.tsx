import { Providers } from "@/components/providers"

export default function WatchlistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Providers>{children}</Providers>
}