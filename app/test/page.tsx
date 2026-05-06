"use client"

import { useEffect, useState } from "react"

export default function TestPage() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    async function test() {
      try {
        const response = await fetch('/api/tmdb/movies?category=popular')
        const json = await response.json()
        console.log('API Response:', json)
        setData(json)
      } catch (err) {
        console.error('Error:', err)
        setError(String(err))
      }
    }
    test()
  }, [])

  return (
    <div className="p-8 bg-background min-h-screen text-foreground">
      <h1 className="text-3xl font-bold mb-4">API Test Page</h1>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 p-4 rounded mb-4">
          <p className="text-red-500">Error: {error}</p>
        </div>
      )}

      {data && (
        <div className="space-y-4">
          <div className="bg-green-500/20 border border-green-500 p-4 rounded">
            <p className="text-green-500">✓ API is working!</p>
            <p className="text-sm mt-2">Found {data.results?.length || 0} movies</p>
          </div>

          {data.results && data.results[0] && (
            <div className="bg-card border border-border p-6 rounded">
              <h2 className="text-xl font-bold mb-4">First Movie Data:</h2>
              <pre className="bg-muted p-4 rounded overflow-auto text-xs">
                {JSON.stringify(data.results[0], null, 2)}
              </pre>
              
              <div className="mt-4">
                <h3 className="font-bold mb-2">Test Image:</h3>
                <img 
                  src={`https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`}
                  alt={data.results[0].title}
                  className="w-48 border-4 border-primary"
                  onError={(e) => {
                    console.error('Image failed to load')
                    const target = e.target as HTMLImageElement
                    target.style.border = '4px solid red'
                  }}
                  onLoad={() => console.log('Image loaded successfully!')}
                />
                <p className="mt-2 text-sm">Image URL: https://image.tmdb.org/t/p/w500{data.results[0].poster_path}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
