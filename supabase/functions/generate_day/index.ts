// deno-lint-ignore-file no-explicit-any
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

function rngInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

Deno.serve(async (req) => {
  if (req.method !== 'POST')
    return new Response('Method not allowed', { status: 405 })

  const supabase = createClient(supabaseUrl, serviceKey)

  // Read all active curated scenes
  const { data: scenes, error } = await supabase
    .from('curated_scenes')
    .select('*')
    .eq('is_active', true)

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  // Pick 5–8 at random
  const count = rngInt(5, 8)
  const shuffled = [...(scenes ?? [])].sort(() => Math.random() - 0.5)
  const picked = shuffled.slice(0, count)

  // Match your §6.1 schema shape (id/setting/obstacle/options[])
  const payload = {
    scenes: picked.map((s) => ({
      id: s.id,
      setting: s.setting,
      obstacle: s.obstacle,
      options: s.options, // already JSONB with id/text/intent_tags/expected_valence
    })),
    source: 'curated', // helpful flag for your UI/logging
  }

  return new Response(JSON.stringify(payload), {
    headers: { 'content-type': 'application/json' },
  })
})