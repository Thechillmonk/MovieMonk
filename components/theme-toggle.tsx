'use client'

import { useState, useRef, useEffect } from "react"
import { Monitor, Palette, Film, Zap, Minimize, Triangle, Twitter, Clock, Leaf, Waves, Sunset, Moon, Palette as PaletteIcon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

const themes = [
  { value: "cinema", label: "Cinema Dark", icon: Film, description: "Dark cinematic theme" },
  { value: "cyberpunk", label: "Cyberpunk", icon: Zap, description: "Neon cyberpunk vibes" },
  { value: "minimal", label: "Minimal Light", icon: Minimize, description: "Clean minimal design" },
  { value: "vercel", label: "Vercel", icon: Triangle, description: "Vercel-inspired theme" },
  { value: "twitter", label: "Twitter", icon: Twitter, description: "Twitter-like interface" },
  { value: "retro", label: "Retro", icon: Clock, description: "Vintage retro style" },
  { value: "nature", label: "Nature", icon: Leaf, description: "Fresh nature-inspired" },
  { value: "ocean", label: "Ocean", icon: Waves, description: "Calming ocean blues" },
  { value: "sunset", label: "Sunset", icon: Sunset, description: "Warm sunset colors" },
  { value: "dracula", label: "Dracula", icon: Moon, description: "Dark, vibrant Dracula theme" },
  { value: "pastel", label: "Pastel", icon: PaletteIcon, description: "Soft pastel palette" },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const currentTheme = themes.find((t) => t.value === theme)
  const CurrentIcon = currentTheme?.icon || Palette

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500"
      >
        <CurrentIcon className="h-[1.2rem] w-[1.2rem]" />
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-popover text-popover-foreground border rounded-md shadow-md p-1 z-[100]">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon
            return (
              <div
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value as any)
                  setIsOpen(false)
                }}
                className="flex items-center gap-2 p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-sm"
              >
                <Icon className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{themeOption.label}</span>
                  <span className="text-xs text-muted-foreground">{themeOption.description}</span>
                </div>
              </div>
            )
          })}
          <div className="border-t my-1" />
          <div
            onClick={() => {
              setTheme("system")
              setIsOpen(false)
            }}
            className="flex items-center gap-2 p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-sm"
          >
            <Monitor className="h-4 w-4" />
            <div className="flex flex-col">
              <span className="font-medium">System</span>
              <span className="text-xs text-muted-foreground">Use system preference</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}