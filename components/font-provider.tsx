"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Font =
  | "inter"
  | "roboto"
  | "open-sans"
  | "lato"
  | "montserrat"
  | "nunito"
  | "poppins"
  | "raleway"
  | "source-sans-3"
  | "ubuntu"
  | "playfair"
  | "space-grotesk"

type FontProviderProps = {
  children: React.ReactNode
  defaultFont?: Font
  storageKey?: string
}

type FontProviderState = {
  font: Font
  setFont: (font: Font) => void
}

const initialState: FontProviderState = {
  font: "inter",
  setFont: () => null,
}

export const FontProviderContext = createContext<FontProviderState>(initialState)

export function FontProvider({
  children,
  defaultFont = "inter",
  storageKey = "moviemonk-font",
  ...props
}: FontProviderProps) {
  const [font, setFont] = useState<Font>(defaultFont)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage?.getItem(storageKey) as Font
    if (stored) {
      setFont(stored)
    }
  }, [storageKey])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.body

    // Remove all font classes
    root.classList.remove(
      "font-inter",
      "font-roboto",
      "font-open-sans",
      "font-lato",
      "font-montserrat",
      "font-nunito",
      "font-poppins",
      "font-raleway",
      "font-source-sans-3",
      "font-ubuntu",
      "font-playfair",
      "font-space-grotesk"
    )

    root.classList.add(`font-${font}`)
  }, [font, mounted])

  const value = {
    font,
    setFont: (newFont: Font) => {
      if (mounted) {
        localStorage?.setItem(storageKey, newFont)
      }
      setFont(newFont)
    },
  }

  return (
    <FontProviderContext.Provider {...props} value={value}>
      {children}
    </FontProviderContext.Provider>
  )
}

export const useFont = () => {
  const context = useContext(FontProviderContext)

  if (context === undefined) throw new Error("useFont must be used within a FontProvider")

  return context
}