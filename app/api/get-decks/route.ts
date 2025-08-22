export const runtime = 'edge'

export async function GET() {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get_decks`
  const r = await fetch(url, { headers: { Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` } })
  return new Response(r.body, { status: r.status, headers: { 'content-type': 'application/json' } })
}