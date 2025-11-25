"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  signup: (name: string, email: string, password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("moviemonk-user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (error) {
        console.error("Error loading user:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      if (user) {
        localStorage.setItem("moviemonk-user", JSON.stringify(user))
      } else {
        localStorage.removeItem("moviemonk-user")
      }
    }
  }, [user, isLoaded])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call - In production, this would call your backend
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo purposes, accept any email/password
    // In production, validate against your backend
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split("@")[0],
      email,
    }

    setUser(mockUser)
    return true
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call - In production, this would call your backend
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
    }

    setUser(mockUser)
    return true
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
