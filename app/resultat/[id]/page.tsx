import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import ResultPage from './ResultPage'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const { data, error } = await supabase
    .from('matrice_sessions')
    .select('*')
    .eq('id', id)
    .single()

  console.log('SESSION DATA:', data)
  if (error) console.log('SESSION ERROR:', error)

  if (!data) return notFound()

  return <ResultPage session={data} />
}
