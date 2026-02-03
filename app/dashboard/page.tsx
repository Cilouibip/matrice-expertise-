'use client'

import { useState, useEffect, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Diagnostic } from './types'
import { filterTestAccounts, timeAgo } from './utils'

import PasswordGate from './components/PasswordGate'
import DisplayModeToggle, { DisplayMode } from './components/DisplayModeToggle'
import KPICards from './components/KPICards'
import ArchetypeChart from './components/ArchetypeChart'
import ScoreDistribution from './components/ScoreDistribution'
import BlockageChart from './components/BlockageChart'
import MotivationChart from './components/MotivationChart'
import SituationChart from './components/SituationChart'
import RunwayChart from './components/RunwayChart'
import ObjectifChart from './components/ObjectifChart'
import ReactionChart from './components/ReactionChart'
import TimelineChart from './components/TimelineChart'
import LeadsTable from './components/LeadsTable'
import DiagnosticModal from './components/DiagnosticModal'
import InsightsSection from './components/InsightsSection'

export default function DashboardPage() {
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [showTests, setShowTests] = useState(false)
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<Diagnostic | null>(null)
  const [displayMode, setDisplayMode] = useState<DisplayMode>('percent')

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('diagnostics')
        .select(`
          *,
          users (
            id,
            email,
            first_name,
            linkedin_url,
            created_at
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDiagnostics(data || [])
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error fetching diagnostics:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredDiagnostics = showTests ? diagnostics : filterTestAccounts(diagnostics)

  return (
    <PasswordGate>
      <div className="min-h-screen bg-[#FAF9F6]">
        <header className="sticky top-0 z-40 bg-[#FAF9F6]/80 backdrop-blur-sm border-b border-[#E8E4DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#2D2A26]">
                  🔒 Dashboard — Diagnostic Brutal
                </h1>
                <p className="text-sm text-[#6B6560]">
                  {lastUpdate ? `Dernière MAJ : ${timeAgo(lastUpdate.toISOString())}` : 'Chargement...'}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <DisplayModeToggle mode={displayMode} onChange={setDisplayMode} />
                
                <label className="flex items-center gap-2 text-sm text-[#6B6560] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTests}
                    onChange={(e) => setShowTests(e.target.checked)}
                    className="rounded border-[#E8E4DF] text-[#FF9B71] focus:ring-[#FF9B71]"
                  />
                  Afficher les tests
                </label>
                
                <button
                  onClick={fetchData}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E8E4DF] text-sm text-[#2D2A26] hover:bg-[#F5F3EF] transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading && diagnostics.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-[#6B6560]">Chargement des données...</div>
            </div>
          ) : (
            <div className="space-y-8">
              <KPICards diagnostics={filteredDiagnostics} />

              <div className="grid lg:grid-cols-2 gap-6">
                <ArchetypeChart diagnostics={filteredDiagnostics} displayMode={displayMode} />
                <ScoreDistribution diagnostics={filteredDiagnostics} />
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <BlockageChart diagnostics={filteredDiagnostics} displayMode={displayMode} />
                <MotivationChart diagnostics={filteredDiagnostics} displayMode={displayMode} />
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <SituationChart diagnostics={filteredDiagnostics} displayMode={displayMode} />
                <RunwayChart diagnostics={filteredDiagnostics} displayMode={displayMode} />
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <ObjectifChart diagnostics={filteredDiagnostics} displayMode={displayMode} />
                <ReactionChart diagnostics={filteredDiagnostics} displayMode={displayMode} />
              </div>

              <TimelineChart diagnostics={filteredDiagnostics} />

              <InsightsSection diagnostics={filteredDiagnostics} />

              <LeadsTable 
                diagnostics={filteredDiagnostics} 
                onViewDiagnostic={setSelectedDiagnostic}
              />
            </div>
          )}
        </main>

        <DiagnosticModal 
          diagnostic={selectedDiagnostic} 
          onClose={() => setSelectedDiagnostic(null)} 
        />
      </div>
    </PasswordGate>
  )
}
