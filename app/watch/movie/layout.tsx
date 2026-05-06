import { Providers } from "@/components/providers"

export default function WatchMovieLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Providers>{children}</Providers>
}