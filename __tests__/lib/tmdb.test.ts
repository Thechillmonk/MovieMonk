import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fetchMovies, fetchTVShows, getImageUrl, getBackdropUrl } from '@/lib/tmdb'

// Mock fetch globally
global.fetch = vi.fn()

describe('TMDB Library', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchMovies', () => {
    it('should fetch movies successfully', async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: 'Test Movie',
            overview: 'Test overview',
            poster_path: '/test.jpg',
            backdrop_path: '/backdrop.jpg',
            release_date: '2024-01-01',
            vote_average: 8.5,
            vote_count: 100,
            genre_ids: [28, 12],
            adult: false,
            original_language: 'en',
            original_title: 'Test Movie',
            popularity: 100,
            video: false,
          },
        ],
        total_pages: 1,
        total_results: 1,
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await fetchMovies('popular')
      expect(result.results).toHaveLength(1)
      expect(result.results[0].title).toBe('Test Movie')
    })

    it('should handle API errors gracefully', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      const result = await fetchMovies('popular')
      expect(result.results).toHaveLength(0)
      expect(result.total_results).toBe(0)
    })
  })

  describe('getImageUrl', () => {
    it('should return correct image URL', () => {
      const path = '/test.jpg'
      const url = getImageUrl(path)
      expect(url).toBe('https://image.tmdb.org/t/p/w500/test.jpg')
    })

    it('should return placeholder for null path', () => {
      const url = getImageUrl(null)
      expect(url).toBe('/abstract-movie-poster.png')
    })

    it('should support different sizes', () => {
      const path = '/test.jpg'
      const url = getImageUrl(path, 'w780')
      expect(url).toBe('https://image.tmdb.org/t/p/w780/test.jpg')
    })
  })

  describe('getBackdropUrl', () => {
    it('should return correct backdrop URL', () => {
      const path = '/backdrop.jpg'
      const url = getBackdropUrl(path)
      expect(url).toBe('https://image.tmdb.org/t/p/w1280/backdrop.jpg')
    })

    it('should return placeholder for null path', () => {
      const url = getBackdropUrl(null)
      expect(url).toBe('/movie-backdrop.png')
    })
  })
})
