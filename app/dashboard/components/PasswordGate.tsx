'use client'

import { useState, useEffect } from 'react'
import { Lock } from 'lucide-react'

interface PasswordGateProps {
  children: React.ReactNode
}

const COOKIE_NAME = 'dashboard_auth'
const COOKIE_DURATION_DAYS = 7

export default function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${COOKIE_NAME}=`))
    
    if (cookie) {
      const value = cookie.split('=')[1]
      if (value === 'authenticated') {
        setIsAuthenticated(true)
      }
    }
    setIsLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const correctPassword = process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD

    if (password === correctPassword) {
      const expires = new Date()
      expires.setDate(expires.getDate() + COOKIE_DURATION_DAYS)
      document.cookie = `${COOKIE_NAME}=authenticated; expires=${expires.toUTCString()}; path=/dashboard`
      setIsAuthenticated(true)
    } else {
      setError('Mot de passe incorrect')
      setPassword('')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="animate-pulse text-warm-gray">Chargement...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-[#FAF9F6] rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-warm-gray" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-[#2D2A26] mb-2">
            Dashboard Admin
          </h1>
          <p className="text-center text-[#6B6560] mb-6">
            Diagnostic Brutal
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full px-4 py-3 rounded-xl border border-[#E8E4DF] bg-[#FAF9F6] text-[#2D2A26] placeholder-[#9B8F85] focus:outline-none focus:ring-2 focus:ring-[#FF9B71] focus:border-transparent mb-4"
              autoFocus
            />
            
            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#FF9B71] text-white font-semibold py-3 rounded-xl hover:bg-[#FF8A5C] transition-colors"
            >
              Accéder au dashboard
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
