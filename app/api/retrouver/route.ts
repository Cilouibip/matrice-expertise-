import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email requis' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('matrice_sessions')
      .select('id, created_at, quadrant, certainty_score')
      .eq('user_email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return NextResponse.json({ success: false, data: null })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: unknown) {
    console.error('[retrouver] Error:', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
