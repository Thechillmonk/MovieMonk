import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Playfair_Display, Space_Grotesk, Fira_Code, Roboto, Open_Sans, Lato, Montserrat, Nunito, Poppins, Raleway, Source_Sans_3, Ubuntu } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
})

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
})

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
})

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans-3",
  display: "swap",
})

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "MovieMonk - Discover Movies & TV Shows",
    template: "%s | MovieMonk",
  },
  description: "Discover the latest movies and TV shows from around the world. Browse popular content, create your watchlist, and explore detailed information about your favorite entertainment.",
  keywords: ["movies", "tv shows", "streaming", "entertainment", "watch", "cinema", "television"],
  authors: [{ name: "MovieMonk" }],
  creator: "MovieMonk",
  publisher: "MovieMonk",
  metadataBase: new URL("https://moviemonk.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://moviemonk.app",
    title: "MovieMonk - Discover Movies & TV Shows",
    description: "Discover the latest movies and TV shows from around the world. Browse popular content, create your watchlist, and explore detailed information.",
    siteName: "MovieMonk",
  },
  twitter: {
    card: "summary_large_image",
    title: "MovieMonk - Discover Movies & TV Shows",
    description: "Discover the latest movies and TV shows from around the world",
    creator: "@moviemonk",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  icons: {
    icon: [
      { url: "/movielogo.png", sizes: "32x32", type: "image/png" },
      { url: "/movielogo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/movielogo.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/movielogo.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`
        ${inter.variable}
        ${jetbrainsMono.variable}
        ${playfairDisplay.variable}
        ${spaceGrotesk.variable}
        ${firaCode.variable}
        ${roboto.variable}
        ${openSans.variable}
        ${lato.variable}
        ${montserrat.variable}
        ${nunito.variable}
        ${poppins.variable}
        ${raleway.variable}
        ${sourceSans3.variable}
        ${ubuntu.variable}
        font-sans antialiased
      `}
      >
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
