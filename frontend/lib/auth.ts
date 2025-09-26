"use client"

export interface User {
  id: string
  email: string
  name: string
}

export const AUTH_STORAGE_KEY = "moise-auth-user"

export function login(email: string, password: string): Promise<User | null> {
  return new Promise((resolve) => {
    // TODO: Replace with actual authentication service (Firebase, Auth0, Supabase, etc.)
    resolve(null) // Always return null until real auth is implemented
  })
}

export function logout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}
