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
      endpoint = `/search/movie?query=${encodeURIComponent(query)}&page=${page}`
    } else {
      switch (category) {
        case "popular":
          endpoint = `/movie/popular?page=${page}`
          break
        case "top_rated":
          endpoint = `/movie/top_rated?page=${page}`
          break
        case "now_playing":
          endpoint = `/movie/now_playing?page=${page}`
          break
        case "upcoming":
          endpoint = `/movie/upcoming?page=${page}`
          break
        default:
          endpoint = `/movie/popular?page=${page}`
      }
    }

    const response = await fetch(`${TMDB_BASE_URL}${endpoint}&api_key=${TMDB_API_KEY}`)

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching movies:", error)
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 })
  }
}
