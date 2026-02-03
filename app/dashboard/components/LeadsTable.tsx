'use client'

import { useState, useMemo } from 'react'
import { Search, Download, ChevronUp, ChevronDown, ExternalLink, Eye } from 'lucide-react'
import { Diagnostic, ARCHETYPE_CONFIG, BLOCAGE_LABELS, MOTIVATION_LABELS, SITUATION_LABELS, RUNWAY_LABELS, OBJECTIF_LABELS, ArchetypeKey } from '../types'
import { formatDate, exportToCSV } from '../utils'

interface LeadsTableProps {
  diagnostics: Diagnostic[]
  onViewDiagnostic: (diagnostic: Diagnostic) => void
}

type SortKey = 'first_name' | 'email' | 'archetype' | 'score' | 'blocage' | 'created_at'
type SortDirection = 'asc' | 'desc'

export default function LeadsTable({ diagnostics, onViewDiagnostic }: LeadsTableProps) {
  const [search, setSearch] = useState('')
  const [archetypeFilter, setArchetypeFilter] = useState<string>('all')
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredAndSorted = useMemo(() => {
    let result = [...diagnostics]

    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(d => 
        d.users?.first_name?.toLowerCase().includes(searchLower) ||
        d.users?.email?.toLowerCase().includes(searchLower)
      )
    }

    if (archetypeFilter !== 'all') {
      result = result.filter(d => d.archetype === archetypeFilter)
    }

    result.sort((a, b) => {
      let aVal: string | number = ''
      let bVal: string | number = ''

      switch (sortKey) {
        case 'first_name':
          aVal = a.users?.first_name || ''
          bVal = b.users?.first_name || ''
          break
        case 'email':
          aVal = a.users?.email || ''
          bVal = b.users?.email || ''
          break
        case 'archetype':
          aVal = a.archetype
          bVal = b.archetype
          break
        case 'score':
          aVal = a.score
          bVal = b.score
          break
        case 'blocage':
          aVal = a.quiz_answers.blocage
          bVal = b.quiz_answers.blocage
          break
        case 'created_at':
          aVal = new Date(a.created_at).getTime()
          bVal = new Date(b.created_at).getTime()
          break
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      
      return sortDirection === 'asc' 
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number)
    })

    return result
  }, [diagnostics, search, archetypeFilter, sortKey, sortDirection])

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage)
  const paginatedData = filteredAndSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return null
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4" />
      : <ChevronDown className="w-4 h-4" />
  }

  const archetypes = Object.keys(ARCHETYPE_CONFIG) as ArchetypeKey[]

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-[#2D2A26]">Tableau des Leads</h3>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B8F85]" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              className="pl-9 pr-4 py-2 rounded-xl border border-[#E8E4DF] bg-[#FAF9F6] text-sm text-[#2D2A26] placeholder-[#9B8F85] focus:outline-none focus:ring-2 focus:ring-[#FF9B71] focus:border-transparent w-full sm:w-48"
            />
          </div>
          
          <select
            value={archetypeFilter}
            onChange={(e) => { setArchetypeFilter(e.target.value); setCurrentPage(1) }}
            className="px-4 py-2 rounded-xl border border-[#E8E4DF] bg-[#FAF9F6] text-sm text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-[#FF9B71] focus:border-transparent"
          >
            <option value="all">Tous les archétypes</option>
            {archetypes.map(key => (
              <option key={key} value={key}>{ARCHETYPE_CONFIG[key].name}</option>
            ))}
          </select>
          
          <button
            onClick={() => exportToCSV(filteredAndSorted, `leads-diagnostic-brutal-${new Date().toISOString().split('T')[0]}.csv`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF9F6] border border-[#E8E4DF] text-sm text-[#2D2A26] hover:bg-[#F5F3EF] transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8E4DF]">
              <th 
                className="text-left py-3 px-2 text-sm font-medium text-[#6B6560] cursor-pointer hover:text-[#2D2A26]"
                onClick={() => handleSort('first_name')}
              >
                <div className="flex items-center gap-1">
                  Prénom <SortIcon columnKey="first_name" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-2 text-sm font-medium text-[#6B6560] cursor-pointer hover:text-[#2D2A26]"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center gap-1">
                  Email <SortIcon columnKey="email" />
                </div>
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-[#6B6560]">LinkedIn</th>
              <th 
                className="text-left py-3 px-2 text-sm font-medium text-[#6B6560] cursor-pointer hover:text-[#2D2A26]"
                onClick={() => handleSort('archetype')}
              >
                <div className="flex items-center gap-1">
                  Archétype <SortIcon columnKey="archetype" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-2 text-sm font-medium text-[#6B6560] cursor-pointer hover:text-[#2D2A26]"
                onClick={() => handleSort('score')}
              >
                <div className="flex items-center gap-1">
                  Score <SortIcon columnKey="score" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-2 text-sm font-medium text-[#6B6560] cursor-pointer hover:text-[#2D2A26]"
                onClick={() => handleSort('blocage')}
              >
                <div className="flex items-center gap-1">
                  Blocage <SortIcon columnKey="blocage" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-2 text-sm font-medium text-[#6B6560] cursor-pointer hover:text-[#2D2A26]"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center gap-1">
                  Date <SortIcon columnKey="created_at" />
                </div>
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-[#6B6560]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((d) => (
              <tr 
                key={d.id} 
                className="border-b border-[#E8E4DF] hover:bg-[#FAF9F6] transition-colors"
              >
                <td className="py-3 px-2 text-sm text-[#2D2A26]">
                  {d.users?.first_name || '-'}
                </td>
                <td className="py-3 px-2 text-sm text-[#6B6560]">
                  {d.users?.email || '-'}
                </td>
                <td className="py-3 px-2">
                  {d.users?.linkedin_url ? (
                    <a 
                      href={d.users.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#5BC0EB] hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="text-sm">Voir</span>
                    </a>
                  ) : (
                    <span className="text-sm text-[#9B8F85]">-</span>
                  )}
                </td>
                <td className="py-3 px-2">
                  <span 
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: `${ARCHETYPE_CONFIG[d.archetype as ArchetypeKey]?.color}40`,
                      color: '#2D2A26'
                    }}
                  >
                    {ARCHETYPE_CONFIG[d.archetype as ArchetypeKey]?.emoji} {ARCHETYPE_CONFIG[d.archetype as ArchetypeKey]?.name}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <span className={`text-sm font-medium ${d.score >= 70 ? 'text-green-600' : d.score >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                    {d.score}
                  </span>
                </td>
                <td className="py-3 px-2 text-sm text-[#6B6560]">
                  {BLOCAGE_LABELS[d.quiz_answers.blocage] || d.quiz_answers.blocage}
                </td>
                <td className="py-3 px-2 text-sm text-[#6B6560]">
                  {formatDate(d.created_at)}
                </td>
                <td className="py-3 px-2">
                  <button
                    onClick={() => onViewDiagnostic(d)}
                    className="p-2 rounded-lg hover:bg-[#E8E4DF] transition-colors"
                    title="Voir le diagnostic"
                  >
                    <Eye className="w-4 h-4 text-[#6B6560]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E8E4DF]">
          <p className="text-sm text-[#6B6560]">
            {filteredAndSorted.length} résultat{filteredAndSorted.length > 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg text-sm text-[#6B6560] hover:bg-[#FAF9F6] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  currentPage === page 
                    ? 'bg-[#FF9B71] text-white' 
                    : 'text-[#6B6560] hover:bg-[#FAF9F6]'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg text-sm text-[#6B6560] hover:bg-[#FAF9F6] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
