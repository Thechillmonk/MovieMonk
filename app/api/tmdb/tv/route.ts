import { type NextRequest, NextResponse } from "next/server"

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export async function GET(request: NextRequest) {
  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: "TMDB API key not configured" }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") || "popular"
  const query = searchParams.get("query")
  const page = searchParams.get("page") || "1"

  try {
    let endpoint = ""

    if (query) {
      endpoint = `/search/tv?query=${encodeURIComponent(query)}&page=${page}`
    } else {
      switch (category) {
        case "popular":
          endpoint = `/tv/popular?page=${page}`
          break
        case "top_rated":
          endpoint = `/tv/top_rated?page=${page}`
          break
        case "on_the_air":
          endpoint = `/tv/on_the_air?page=${page}`
          break
        case "airing_today":
          endpoint = `/tv/airing_today?page=${page}`
          break
        default:
          endpoint = `/tv/popular?page=${page}`
      }
    }

    const response = await fetch(`${TMDB_BASE_URL}${endpoint}&api_key=${TMDB_API_KEY}`)

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching TV shows:", error)
    return NextResponse.json({ error: "Failed to fetch TV shows" }, { status: 500 })
  }
}
