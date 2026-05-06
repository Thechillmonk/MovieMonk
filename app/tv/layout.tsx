import { Providers } from "@/components/providers"

export default function TVLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Providers>{children}</Providers>
}