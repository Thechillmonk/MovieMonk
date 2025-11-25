'use client'

import { useState, useRef, useEffect } from "react"
import { Type } from "lucide-react"
import { useFont } from "@/components/font-provider"
import { Button } from "@/components/ui/button"

const fonts = [
  { value: "inter", label: "Inter", description: "Clean and modern" },
  { value: "roboto", label: "Roboto", description: "Google's typeface" },
  { value: "open-sans", label: "Open Sans", description: "Humanist sans-serif" },
  { value: "lato", label: "Lato", description: "Contemporary sans-serif" },
  { value: "montserrat", label: "Montserrat", description: "Geometric sans-serif" },
  { value: "nunito", label: "Nunito", description: "Rounded sans-serif" },
  { value: "poppins", label: "Poppins", description: "Geometric sans-serif" },
  { value: "raleway", label: "Raleway", description: "Elegant sans-serif" },
  { value: "source-sans-3", label: "Source Sans 3", description: "Adobe's sans-serif" },
  { value: "ubuntu", label: "Ubuntu", description: "Ubuntu's typeface" },
  { value: "playfair", label: "Playfair Display", description: "Serif display font" },
  { value: "space-grotesk", label: "Space Grotesk", description: "Geometric sans-serif" },
]

export function FontToggle() {
  const { font, setFont } = useFont()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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
        className="bg-red-500"
      >
        <Type className="h-[1.2rem] w-[1.2rem]" />
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-popover text-popover-foreground border rounded-md shadow-md p-1 z-[100]">
          {fonts.map((fontOption) => (
            <div
              key={fontOption.value}
              onClick={() => {
                setFont(fontOption.value as any)
                setIsOpen(false)
              }}
              className="flex items-center gap-2 p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-sm"
            >
              <div className="flex flex-col">
                <span className="font-medium">{fontOption.label}</span>
                <span className="text-xs text-muted-foreground">{fontOption.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}