export const runtime = 'edge'

export async function POST() {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate_day`
  const r = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` } })
  return new Response(r.body, { status: r.status, headers: { 'content-type': 'application/json' } })
}