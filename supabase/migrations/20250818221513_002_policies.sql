-- Enable RLS
alter table public.decks            enable row level security;
alter table public.deck_cards       enable row level security;
alter table public.curated_scenes   enable row level security;
alter table public.ai_cache         enable row level security;
alter table public.embeddings       enable row level security;
alter table public.ai_templates     enable row level security;

-- Helper: service role gate (Supabase provides auth.role())
-- Public read policies

-- decks: public SELECT, writes only by service_role
drop policy if exists "decks public read" on public.decks;
create policy "decks public read" on public.decks
  for select using (true);

drop policy if exists "decks service write" on public.decks;
create policy "decks service write" on public.decks
  for insert with check (auth.role() = 'service_role');
create policy "decks service update" on public.decks
  for update using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "decks service delete" on public.decks
  for delete using (auth.role() = 'service_role');

-- deck_cards: public SELECT, writes only by service_role
drop policy if exists "deck_cards public read" on public.deck_cards;
create policy "deck_cards public read" on public.deck_cards
  for select using (true);

drop policy if exists "deck_cards service write" on public.deck_cards;
create policy "deck_cards service write" on public.deck_cards
  for insert with check (auth.role() = 'service_role');
create policy "deck_cards service update" on public.deck_cards
  for update using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "deck_cards service delete" on public.deck_cards
  for delete using (auth.role() = 'service_role');

-- curated_scenes: public SELECT, writes only by service_role
drop policy if exists "curated_scenes public read" on public.curated_scenes;
create policy "curated_scenes public read" on public.curated_scenes
  for select using (true);

drop policy if exists "curated_scenes service write" on public.curated_scenes;
create policy "curated_scenes service write" on public.curated_scenes
  for insert with check (auth.role() = 'service_role');
create policy "curated_scenes service update" on public.curated_scenes
  for update using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "curated_scenes service delete" on public.curated_scenes
  for delete using (auth.role() = 'service_role');

-- ai_cache: no public read; only service_role can read/write
drop policy if exists "ai_cache service read" on public.ai_cache;
create policy "ai_cache service read" on public.ai_cache
  for select using (auth.role() = 'service_role');

drop policy if exists "ai_cache service write" on public.ai_cache;
create policy "ai_cache service write" on public.ai_cache
  for insert with check (auth.role() = 'service_role');
create policy "ai_cache service update" on public.ai_cache
  for update using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
drop policy if exists "ai_cache service delete" on public.ai_cache;
create policy "ai_cache service delete" on public.ai_cache
  for delete using (auth.role() = 'service_role');

-- embeddings: no public read; only service_role can read/write
drop policy if exists "embeddings service read" on public.embeddings;
create policy "embeddings service read" on public.embeddings
  for select using (auth.role() = 'service_role');

drop policy if exists "embeddings service write" on public.embeddings;
create policy "embeddings service write" on public.embeddings
  for insert with check (auth.role() = 'service_role');
create policy "embeddings service update" on public.embeddings
  for update using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "embeddings service delete" on public.embeddings
  for delete using (auth.role() = 'service_role');

-- ai_templates: no public read; only service_role can read/write
drop policy if exists "ai_templates service read" on public.ai_templates;
create policy "ai_templates service read" on public.ai_templates
  for select using (auth.role() = 'service_role');

drop policy if exists "ai_templates service write" on public.ai_templates;
create policy "ai_templates service write" on public.ai_templates
  for insert with check (auth.role() = 'service_role');
create policy "ai_templates service update" on public.ai_templates
  for update using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "ai_templates service delete" on public.ai_templates
  for delete using (auth.role() = 'service_role');