-- ========== Extensions ==========
create extension if not exists pgcrypto;   -- for gen_random_uuid()
create extension if not exists "uuid-ossp";
create extension if not exists vector;     -- pgvector

-- ========== Enums ==========
do $$ begin
  create type deck_type as enum ('positive','negative');
exception when duplicate_object then null; end $$;

do $$ begin
  create type rarity as enum ('common','uncommon','rare','very_rare');
exception when duplicate_object then null; end $$;

do $$ begin
  create type setting_enum as enum ('home','school','playground','store','friends_house');
exception when duplicate_object then null; end $$;

do $$ begin
  create type item_type as enum ('scene','card');
exception when duplicate_object then null; end $$;

-- ========== Tables ==========

-- 5.3 decks
create table if not exists public.decks (
  id                uuid primary key default gen_random_uuid(),
  type              deck_type not null,
  title             text not null,
  description       text,
  default_points    integer not null default 0
                    check (default_points between -5 and 5),
  rarity_weights    jsonb,           -- e.g. {"common":0.6,"uncommon":0.25,"rare":0.12,"very_rare":0.03}
  themes            text[] default '{}',
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create unique index if not exists decks_type_title_uniq
  on public.decks(type, title);

-- 5.3 deck_cards
create table if not exists public.deck_cards (
  id          uuid primary key default gen_random_uuid(),
  deck_id     uuid not null references public.decks(id) on delete cascade,
  title       text not null,
  text        text not null,
  points      integer not null check (points between -5 and 5),
  rarity      rarity not null default 'common',
  tags        text[] default '{}',
  themes      text[] default '{}',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create unique index if not exists deck_cards_deck_title_uniq
  on public.deck_cards(deck_id, title);

create index if not exists deck_cards_deck_id_idx on public.deck_cards(deck_id);

-- 5.3 curated_scenes
create table if not exists public.curated_scenes (
  id                  uuid primary key default gen_random_uuid(),
  setting             setting_enum not null,
  obstacle            text not null,
  options             jsonb not null,             -- [{ id,text,intent_tags,expected_valence }, ...]
  expected_valences   jsonb not null,             -- ["positive"|"negative"|"neutral", ...]
  intents             jsonb not null default '[]'::jsonb,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists curated_scenes_setting_idx on public.curated_scenes(setting);

-- 5.3 ai_cache
create table if not exists public.ai_cache (
  hash            text primary key,               -- prompt hash
  model           text not null,
  inputs_summary  text,
  json_result     jsonb not null,
  created_at      timestamptz not null default now()
);

-- 5.3 embeddings  (choose your embedding dimension; 1536 is common)
create table if not exists public.embeddings (
  id         uuid primary key default gen_random_uuid(),
  item_type  item_type not null,
  item_id    uuid not null,
  vector     vector(1536) not null,
  created_at timestamptz not null default now()
);

-- vector index (optional until you need ANN)
-- ivfflat requires a list size; 100 is a safe start. Only works after data exists; keep commented if applying to empty table is problematic.
-- create index if not exists embeddings_vector_ivfflat_idx
--   on public.embeddings using ivfflat (vector vector_cosine_ops) with (lists = 100);

create index if not exists embeddings_item_idx on public.embeddings(item_type, item_id);

-- 5.3 ai_templates
create table if not exists public.ai_templates (
  name            text primary key,
  system_prompt   text not null,
  user_prompt_vars jsonb not null default '{}'::jsonb,
  schema          jsonb not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ========== Triggers ==========

-- simple updated_at triggers
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists touch_decks on public.decks;
create trigger touch_decks before update on public.decks
for each row execute procedure public.touch_updated_at();

drop trigger if exists touch_deck_cards on public.deck_cards;
create trigger touch_deck_cards before update on public.deck_cards
for each row execute procedure public.touch_updated_at();

drop trigger if exists touch_curated_scenes on public.curated_scenes;
create trigger touch_curated_scenes before update on public.curated_scenes
for each row execute procedure public.touch_updated_at();

drop trigger if exists touch_ai_templates on public.ai_templates;
create trigger touch_ai_templates before update on public.ai_templates
for each row execute procedure public.touch_updated_at();