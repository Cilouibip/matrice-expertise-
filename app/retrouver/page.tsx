'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Define Supabase client locally since we need it on the client side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function RetrouverPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError('')

    try {
      const { data, error: fetchError } = await supabase
        .from('matrice_sessions')
        .select('id, created_at, quadrant, certainty_score')
        .eq('user_email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (fetchError || !data) {
        setError("Aucun diagnostic trouvé pour cet email.")
      } else {
        router.push(`/resultat/${data.id}`)
      }
    } catch (err) {
      console.error(err)
      setError("Une erreur s'est produite lors de la recherche.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-200 selection:bg-white/30 flex items-center justify-center p-6">
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-violet-500/5 via-violet-500/2 to-transparent blur-[150px] opacity-[0.06]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#0a0a0a] border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl">
          
          <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center border border-violet-500/20 mb-8">
            <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Retrouver mon diagnostic
          </h1>
          <p className="text-neutral-400 mb-8 leading-relaxed">
            Entrez l'adresse email utilisée lors de votre évaluation pour accéder à votre rapport complet.
          </p>

          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-4 text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                placeholder="vous@entreprise.com"
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full group relative inline-flex items-center justify-center px-6 py-4 font-medium text-white text-lg rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-violet-500/10 bg-neutral-900 border border-violet-500/40 hover:bg-violet-600/20 hover:border-violet-500/60 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Recherche...
                </span>
              ) : (
                "Retrouver mon diagnostic"
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-neutral-500 text-sm">
              Vous n'avez pas encore passé le test ? <br />
              <Link 
                href="/quiz" 
                className="inline-block text-violet-400 hover:text-violet-300 font-medium mt-2 transition-colors"
              >
                Commencer l'évaluation →
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
