import { Providers } from "@/components/providers"

export default function MovieLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Providers>{children}</Providers>
}