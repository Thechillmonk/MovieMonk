import { type NextRequest, NextResponse } from "next/server"

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: "TMDB API key not configured" }, { status: 500 })
  }

  const { id } = await params

  try {
    const res = await fetch(`${TMDB_BASE_URL}/tv/${id}/watch/providers?api_key=${TMDB_API_KEY}`)
    if (!res.ok) throw new Error(`TMDB API error: ${res.status}`)
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error("Error fetching TV watch providers:", err)
    return NextResponse.json({ error: "Failed to fetch TV watch providers" }, { status: 500 })
  }
}
