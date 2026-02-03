import { Diagnostic, TEST_EMAILS } from './types'

export function filterTestAccounts(diagnostics: Diagnostic[]): Diagnostic[] {
  return diagnostics.filter(d => !TEST_EMAILS.includes(d.users?.email || ''))
}

export function countByKey<T>(
  items: T[],
  keyExtractor: (item: T) => string | undefined
): Record<string, number> {
  return items.reduce((acc, item) => {
    const key = keyExtractor(item)
    if (key) {
      acc[key] = (acc[key] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)
}

export function getMode<T>(
  items: T[],
  keyExtractor: (item: T) => string | undefined
): string | null {
  const counts = countByKey(items, keyExtractor)
  const entries = Object.entries(counts)
  if (entries.length === 0) return null
  return entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0]
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0
  return numbers.reduce((a, b) => a + b, 0) / numbers.length
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'à l\'instant'
  if (diffMins < 60) return `il y a ${diffMins} min`
  if (diffHours < 24) return `il y a ${diffHours}h`
  if (diffDays < 7) return `il y a ${diffDays}j`
  return formatDate(dateString)
}

export function exportToCSV(diagnostics: Diagnostic[], filename: string): void {
  const headers = [
    'Prénom',
    'Email',
    'LinkedIn',
    'Archétype',
    'Score',
    'Blocage',
    'Motivation',
    'Situation',
    'Runway',
    'Objectif Revenus',
    'Réaction Incertitude',
    'Date',
  ]

  const rows = diagnostics.map(d => [
    d.users?.first_name || '',
    d.users?.email || '',
    d.users?.linkedin_url || '',
    d.archetype,
    d.score.toString(),
    d.quiz_answers.blocage,
    d.quiz_answers.motivation,
    d.quiz_answers.situation,
    d.quiz_answers.runway,
    d.quiz_answers.objectif_revenus,
    d.quiz_answers.reaction_incertitude,
    formatDateTime(d.created_at),
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

export function groupByDate(diagnostics: Diagnostic[]): Record<string, number> {
  return diagnostics.reduce((acc, d) => {
    const date = new Date(d.created_at).toISOString().split('T')[0]
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}
