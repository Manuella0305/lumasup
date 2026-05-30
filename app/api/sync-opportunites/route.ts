import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  // Vérification clé secrète
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Appel Claude API avec web search
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{
          role: 'user',
          content: `Recherche sur le web les concours d'entrée, bourses d'études, portes ouvertes et événements académiques en Afrique (Cameroun, Sénégal, Côte d'Ivoire, Maroc, Burkina Faso, Gabon, Congo, Mali) pour les prochains mois de 2026.

Retourne UNIQUEMENT un JSON valide sans markdown, sans explication, avec ce format exact :
{
  "opportunites": [
    {
      "type": "concours|bourse|porte_ouverte|evenement",
      "intitule": "Nom de l'opportunité",
      "description": "Description courte en français (max 200 caractères)",
      "date_debut": "YYYY-MM-DD ou null",
      "date_limite": "YYYY-MM-DD ou null",
      "pays": "Nom du pays ou null",
      "ville": "Nom de la ville ou null",
      "lien_source": "URL source ou null"
    }
  ]
}

Trouve entre 5 et 10 opportunités réelles et vérifiées. Ne retourne que le JSON.`
        }]
      })
    })

    const data = await response.json()

    // Extraire le texte de la réponse
    const textContent = data.content
      .filter((block: any) => block.type === 'text')
      .map((block: any) => block.text)
      .join('')

    // Parser le JSON
    const parsed = JSON.parse(textContent.replace(/```json|```/g, '').trim())
    const opportunites = parsed.opportunites

    if (!opportunites || !Array.isArray(opportunites)) {
      return NextResponse.json({ error: 'Format invalide' }, { status: 500 })
    }

    // Insérer dans Supabase en évitant les doublons
    const results = []
    for (const op of opportunites) {
      // Vérifier si l'opportunité existe déjà
      const { data: existing } = await supabase
        .from('opportunites')
        .select('id')
        .eq('intitule', op.intitule)
        .single()

      if (!existing) {
        const { data: inserted, error } = await supabase
          .from('opportunites')
          .insert({
            type: op.type,
            intitule: op.intitule,
            description: op.description,
            date_debut: op.date_debut,
            date_limite: op.date_limite,
            pays: op.pays,
            ville: op.ville,
            lien_source: op.lien_source,
            actif: true
          })
          .select()
          .single()

        if (!error) results.push(inserted)
      }
    }

    return NextResponse.json({
      success: true,
      inserted: results.length,
      total_found: opportunites.length
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
