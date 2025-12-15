-- ===========================
-- PLAYERS TABLE
-- ===========================
create table public.players (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  handicap numeric(4,1),
  created_at timestamptz default now()
);

-- ===========================
-- TRIPS TABLE
-- ===========================
create table public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  start_date date not null,
  end_date date not null,
  created_at timestamptz default now()
);

-- ===========================
-- TRIP ↔ PLAYERS JOIN TABLE
-- ===========================
create table public.trip_players (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  is_admin boolean default false,
  created_at timestamptz default now(),
  unique(trip_id, player_id) -- prevent duplicates
);
