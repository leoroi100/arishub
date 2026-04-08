create extension if not exists "pgcrypto";

create table if not exists public.aris_tiktok_connections (
  id uuid primary key,
  label text not null,
  access_token_cipher text not null,
  refresh_token_cipher text,
  token_expires_at timestamptz,
  scope text[] not null default '{}',
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.aris_tiktok_business_centers (
  id text primary key,
  connection_id uuid not null references public.aris_tiktok_connections(id) on delete cascade,
  name text not null,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.aris_tiktok_advertisers (
  id text primary key,
  connection_id uuid not null references public.aris_tiktok_connections(id) on delete cascade,
  business_center_id text,
  name text not null,
  currency text,
  timezone text,
  status text,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists aris_tiktok_advertisers_connection_idx
  on public.aris_tiktok_advertisers(connection_id);

create table if not exists public.aris_tiktok_pixels (
  id text primary key,
  connection_id uuid not null references public.aris_tiktok_connections(id) on delete cascade,
  advertiser_id text not null references public.aris_tiktok_advertisers(id) on delete cascade,
  code text,
  name text not null,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists aris_tiktok_pixels_connection_adv_idx
  on public.aris_tiktok_pixels(connection_id, advertiser_id);

create table if not exists public.aris_launch_blueprints (
  id uuid primary key,
  connection_id uuid not null references public.aris_tiktok_connections(id) on delete cascade,
  name text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.aris_launch_runs (
  id uuid primary key,
  connection_id uuid not null references public.aris_tiktok_connections(id) on delete cascade,
  blueprint_id uuid references public.aris_launch_blueprints(id) on delete set null,
  name text not null,
  status text not null,
  request_payload jsonb not null default '{}'::jsonb,
  result_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.aris_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists aris_tiktok_connections_touch on public.aris_tiktok_connections;
create trigger aris_tiktok_connections_touch
before update on public.aris_tiktok_connections
for each row execute function public.aris_touch_updated_at();

drop trigger if exists aris_tiktok_business_centers_touch on public.aris_tiktok_business_centers;
create trigger aris_tiktok_business_centers_touch
before update on public.aris_tiktok_business_centers
for each row execute function public.aris_touch_updated_at();

drop trigger if exists aris_tiktok_advertisers_touch on public.aris_tiktok_advertisers;
create trigger aris_tiktok_advertisers_touch
before update on public.aris_tiktok_advertisers
for each row execute function public.aris_touch_updated_at();

drop trigger if exists aris_tiktok_pixels_touch on public.aris_tiktok_pixels;
create trigger aris_tiktok_pixels_touch
before update on public.aris_tiktok_pixels
for each row execute function public.aris_touch_updated_at();

drop trigger if exists aris_launch_blueprints_touch on public.aris_launch_blueprints;
create trigger aris_launch_blueprints_touch
before update on public.aris_launch_blueprints
for each row execute function public.aris_touch_updated_at();
