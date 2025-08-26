"use client"

import { useAuth } from "@/hooks/useAuth"

export function AuthDebug() {
  const { user, isLoading, isAuthenticated, error } = useAuth()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h4 className="font-bold mb-2">Auth Debug</h4>
      <div className="space-y-1">
        <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
        <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
        <div>User: {user ? user.name : 'None'}</div>
        <div>Email: {user ? user.email : 'None'}</div>
        <div>Error: {error ? 'Yes' : 'No'}</div>
      </div>
    </div>
  )
}






