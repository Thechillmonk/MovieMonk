const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
  popularity: number
  video: boolean
}

export interface TVShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  origin_country: string[]
  original_language: string
  original_name: string
  popularity: number
}

export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export async function fetchMovies(category?: string, query?: string, page = 1): Promise<TMDBResponse<Movie>> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
    })

    if (category) params.append("category", category)
    if (query) params.append("query", query)

    const response = await fetch(`/api/tmdb/movies?${params}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching movies:", error)
    return {
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0,
    }
  }
}

export async function fetchTVShows(category?: string, query?: string, page = 1): Promise<TMDBResponse<TVShow>> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
    })

    if (category) params.append("category", category)
    if (query) params.append("query", query)

    const response = await fetch(`/api/tmdb/tv?${params}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching TV shows:", error)
    return {
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0,
    }
  }
}

export function getImageUrl(path: string | null, size = "w500"): string {
  if (!path) {
    // Return a placeholder image URL
    return "https://via.placeholder.com/500x750/1a1a1a/666666?text=No+Image"
  }
  const url = `${TMDB_IMAGE_BASE_URL}/${size}${path}`
  console.log('Image URL:', url) // Debug log
  return url
}

export function getBackdropUrl(path: string | null, size = "w1280"): string {
  if (!path) {
    return "https://via.placeholder.com/1280x720/1a1a1a/666666?text=No+Backdrop"
  }
  const url = `${TMDB_IMAGE_BASE_URL}/${size}${path}`
  console.log('Backdrop URL:', url) // Debug log
  return url
}

export interface Genre {
  id: number
  name: string
}

export interface ProductionCompany {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface Credits {
  cast: CastMember[]
  crew: CrewMember[]
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export interface WatchProviderItem {
  provider_id: number
  provider_name: string
  logo_path: string | null
}

export interface WatchProvidersByType {
  link: string
  flatrate?: WatchProviderItem[]
  rent?: WatchProviderItem[]
  buy?: WatchProviderItem[]
  ads?: WatchProviderItem[]
  free?: WatchProviderItem[]
}

export interface WatchProvidersResponse {
  results: Record<string, WatchProvidersByType>
}

export interface MovieDetails extends Movie {
  genres: Genre[]
  runtime: number
  budget: number
  revenue: number
  production_companies: ProductionCompany[]
  tagline: string
  status: string
}

export interface TVShowDetails extends TVShow {
  genres: Genre[]
  episode_run_time: number[]
  number_of_seasons: number
  number_of_episodes: number
  production_companies: ProductionCompany[]
  tagline: string
  status: string
  created_by: { id: number; name: string }[]
  seasons: Season[]
}

export interface Season {
  id: number
  name: string
  overview: string
  poster_path: string | null
  season_number: number
  episode_count: number
  air_date: string
}

export interface Episode {
  id: number
  name: string
  overview: string
  episode_number: number
  season_number: number
  still_path: string | null
  air_date: string
  runtime: number
  vote_average: number
  vote_count: number
  crew: CrewMember[]
  guest_stars: CastMember[]
}

export async function fetchMovieDetails(id: number): Promise<MovieDetails | null> {
  try {
    const response = await fetch(`/api/tmdb/movies/${id}`)
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error fetching movie details:", error)
    return null
  }
}

export async function fetchTVShowDetails(id: number): Promise<TVShowDetails | null> {
  try {
    const response = await fetch(`/api/tmdb/tv/${id}`)
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error fetching TV show details:", error)
    return null
  }
}

export async function fetchMovieCredits(id: number): Promise<Credits | null> {
  try {
    const response = await fetch(`/api/tmdb/movies/${id}/credits`)
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error fetching movie credits:", error)
    return null
  }
}

export async function fetchTVShowCredits(id: number): Promise<Credits | null> {
  try {
    const response = await fetch(`/api/tmdb/tv/${id}/credits`)
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error fetching TV show credits:", error)
    return null
  }
}

export async function fetchMovieVideos(id: number): Promise<Video[]> {
  try {
    const response = await fetch(`/api/tmdb/movies/${id}/videos`)
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error("Error fetching movie videos:", error)
    return []
  }
}

export async function fetchTVShowVideos(id: number): Promise<Video[]> {
  try {
    const response = await fetch(`/api/tmdb/tv/${id}/videos`)
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error("Error fetching TV show videos:", error)
    return []
  }
}

export async function fetchMovieWatchProviders(id: number): Promise<WatchProvidersResponse | null> {
  try {
    const response = await fetch(`/api/tmdb/movies/${id}/watch/providers`)
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error fetching movie watch providers:", error)
    return null
  }
}

export async function fetchTVShowWatchProviders(id: number): Promise<WatchProvidersResponse | null> {
  try {
    const response = await fetch(`/api/tmdb/tv/${id}/watch/providers`)
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error fetching TV show watch providers:", error)
    return null
  }
}

export async function fetchTVShowSeason(id: number, seasonNumber: number): Promise<Season | null> {
  try {
    const response = await fetch(`/api/tmdb/tv/${id}/season/${seasonNumber}`)
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error fetching TV show season:", error)
    return null
  }
}

export async function fetchTVShowEpisode(id: number, seasonNumber: number, episodeNumber: number): Promise<Episode | null> {
  try {
    const response = await fetch(`/api/tmdb/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}`)
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error fetching TV show episode:", error)
    return null
  }
}

export function getVidLinkMovieUrl(tmdbId: number, options?: {
  primaryColor?: string
  secondaryColor?: string
  iconColor?: string
  icons?: 'vid' | 'default'
  title?: boolean
  poster?: boolean
  autoplay?: boolean
  nextbutton?: boolean
  player?: 'jw' | 'default'
  startAt?: number
  sub_file?: string
  sub_label?: string
}): string {
  const baseUrl = `https://vidlink.pro/movie/${tmdbId}`
  const params = new URLSearchParams()

  if (options?.primaryColor) params.append('primaryColor', options.primaryColor.replace('#', ''))
  if (options?.secondaryColor) params.append('secondaryColor', options.secondaryColor.replace('#', ''))
  if (options?.iconColor) params.append('iconColor', options.iconColor.replace('#', ''))
  if (options?.icons) params.append('icons', options.icons)
  if (options?.title !== undefined) params.append('title', options.title.toString())
  if (options?.poster !== undefined) params.append('poster', options.poster.toString())
  if (options?.autoplay !== undefined) params.append('autoplay', options.autoplay.toString())
  if (options?.nextbutton !== undefined) params.append('nextbutton', options.nextbutton.toString())
  if (options?.player) params.append('player', options.player)
  if (options?.startAt) params.append('startAt', options.startAt.toString())
  if (options?.sub_file) params.append('sub_file', options.sub_file)
  if (options?.sub_label) params.append('sub_label', options.sub_label)

  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

export function getVidLinkTVUrl(tmdbId: number, season: number, episode: number, options?: {
  primaryColor?: string
  secondaryColor?: string
  iconColor?: string
  icons?: 'vid' | 'default'
  title?: boolean
  poster?: boolean
  autoplay?: boolean
  nextbutton?: boolean
  player?: 'jw' | 'default'
  startAt?: number
  sub_file?: string
  sub_label?: string
}): string {
  const baseUrl = `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`
  const params = new URLSearchParams()

  if (options?.primaryColor) params.append('primaryColor', options.primaryColor.replace('#', ''))
  if (options?.secondaryColor) params.append('secondaryColor', options.secondaryColor.replace('#', ''))
  if (options?.iconColor) params.append('iconColor', options.iconColor.replace('#', ''))
  if (options?.icons) params.append('icons', options.icons)
  if (options?.title !== undefined) params.append('title', options.title.toString())
  if (options?.poster !== undefined) params.append('poster', options.poster.toString())
  if (options?.autoplay !== undefined) params.append('autoplay', options.autoplay.toString())
  if (options?.nextbutton !== undefined) params.append('nextbutton', options.nextbutton.toString())
  if (options?.player) params.append('player', options.player)
  if (options?.startAt) params.append('startAt', options.startAt.toString())
  if (options?.sub_file) params.append('sub_file', options.sub_file)
  if (options?.sub_label) params.append('sub_label', options.sub_label)

  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

export async function fetchMovieRecommendations(id: number, page = 1): Promise<TMDBResponse<Movie>> {
  try {
    const response = await fetch(`/api/tmdb/movies/${id}/recommendations?page=${page}`)
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error fetching movie recommendations:", error)
    return {
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0,
    }
  }
}
