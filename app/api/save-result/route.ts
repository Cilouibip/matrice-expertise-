import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      userEmail, firstName, coreAnswers, bonusAnswers,
      scoring, diagnosticJson,
    } = body

    // Cast string answers to numbers if necessary
    const parsedCore = Object.fromEntries(
      Object.entries(coreAnswers).map(([k, v]) => [k, typeof v === 'string' ? parseInt(v, 10) : v])
    )
    
    const parsedBonus = bonusAnswers ? Object.fromEntries(
      Object.entries(bonusAnswers).map(([k, v]) => [k, typeof v === 'string' && k !== 'q11' ? parseInt(v, 10) : v])
    ) : null

    // Insert session
    const { data: session, error: sessionError } = await supabase
      .from('matrice_sessions')
      .insert({
        user_email: userEmail,
        first_name: firstName || null,
        diagnostic_depth: parsedBonus ? 'advanced' : 'standard',
        core_answers: parsedCore,
        bonus_answers: parsedBonus,
        axis_x: scoring.base.axis_x,
        axis_y: scoring.base.axis_y,
        certainty_score: scoring.base.certainty_score,
        revenue_proximity: scoring.base.revenue_proximity,
        speed_score: scoring.base.speed,
        reliability_score: scoring.base.reliability,
        moat_tech: scoring.advanced?.moat_tech || null,
        moat_data: scoring.advanced?.moat_data || null,
        moat_distribution: scoring.advanced?.moat_distribution || null,
        moat_global: scoring.advanced?.moat_global || null,
        ia_vulnerability: scoring.advanced?.ia_vulnerability || null,
        pain_point: scoring.advanced?.pain_point || null,
        quadrant: scoring.base.quadrant,
        diagnostic_json: diagnosticJson,
        scoring_debug: scoring.debug || null,
      })
      .select('id')
      .single()

    if (sessionError) throw sessionError

    // Insert answer events for analytics
    const events = Object.entries(parsedCore).map(([key, value]) => ({
      session_id: session.id,
      question_key: key,
      answer_value: String(value),
      is_bonus: false,
    }))

    if (parsedBonus) {
      Object.entries(parsedBonus).forEach(([key, value]) => {
        events.push({
          session_id: session.id,
          question_key: key,
          answer_value: String(value),
          is_bonus: true,
        })
      })
    }

    await supabase.from('matrice_answer_events').insert(events)

    // --- Systeme.io : créer contact + ajouter tag ---
    try {
      if (process.env.SYSTEME_API_KEY && process.env.SYSTEME_TAG_MATRICE_ID) {
        const systemeResponse = await fetch('https://api.systeme.io/api/contacts', {
          method: 'POST',
          headers: {
            'X-API-Key': process.env.SYSTEME_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail,
            locale: 'fr',
            fields: [
              { slug: 'first_name', value: firstName || '' }
            ]
          })
        })

        const systemeData = await systemeResponse.json()
        const contactId = systemeData?.id

        if (contactId) {
          const tagId = process.env.SYSTEME_TAG_MATRICE_ID
          await fetch(`https://api.systeme.io/api/contacts/${contactId}/tags`, {
            method: 'POST',
            headers: {
              'X-API-Key': process.env.SYSTEME_API_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              tagId: parseInt(tagId, 10)
            })
          })
        }
      }
    } catch (systemeError) {
      console.error('[save-result] Systeme.io error (non-blocking):', systemeError)
      // On ne bloque pas le flow si Systeme.io échoue
    }

    return NextResponse.json({ success: true, sessionId: session.id })
  } catch (err: unknown) {
    console.error('[save-result] Error:', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
