// deno-lint-ignore-file no-explicit-any
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  if (req.method !== 'GET')
    return new Response('Method not allowed', { status: 405 })

  const supabase = createClient(supabaseUrl, serviceKey)

  // Fetch active decks & cards
  const { data: decks, error: e1 } = await supabase
    .from('decks')
    .select('*')
    .eq('is_active', true)

  if (e1) return new Response(JSON.stringify({ error: e1.message }), { status: 500 })

  const { data: cards, error: e2 } = await supabase
    .from('deck_cards')
    .select('*')
    .eq('is_active', true)

  if (e2) return new Response(JSON.stringify({ error: e2.message }), { status: 500 })

  // Group cards by deck_id
  const byDeck: Record<string, any[]> = {}
  for (const c of cards ?? []) {
    byDeck[c.deck_id] ??= []
    byDeck[c.deck_id].push(c)
  }

  const payload = (decks ?? []).map((d) => ({
    ...d,
    cards: byDeck[d.id] ?? [],
  }))

  return new Response(JSON.stringify({ decks: payload }), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=300', // 5 min cache
    },
  })
})