-- =============================
-- Core Schema for Golf Trip App
-- Phase 1 Step 2
-- =============================

-- 1. PLAYERS
CREATE TABLE public.players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  full_name text NOT NULL,
  nickname text,
  email text,
  created_at timestamptz DEFAULT now()
);

-- 2. TRIPS
CREATE TABLE public.trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date date,
  end_date date,
  location text,
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 3. TRIP ↔ PLAYERS JOIN TABLE
CREATE TABLE public.trip_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  player_id uuid REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
  handicap numeric,
  is_admin boolean DEFAULT false,
  UNIQUE (trip_id, player_id)
);

-- ============================================
-- RLS (Row Level Security)
-- ============================================

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_players ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- ============================================

-- PLAYERS:
-- Users may read themselves; admins can insert/update.
CREATE POLICY "Players: users can read their own row"
  ON public.players FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Players: user can update their own row"
  ON public.players FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert/update players"
  ON public.players FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- TRIPS:
-- Anyone in a trip can read the trip
CREATE POLICY "Trips: members can read"
  ON public.trips FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.trip_players tp
    WHERE tp.trip_id = id AND tp.player_id IN (
      SELECT id FROM public.players WHERE user_id = auth.uid()
    )
  ));

-- Only admins can create/update/delete trips
CREATE POLICY "Trips: admins can manage"
  ON public.trips FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- TRIP PLAYERS:
-- Trip members can read (needed for leaderboards, scoring)
CREATE POLICY "TripPlayers: members can read"
  ON public.trip_players FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.trip_players tp2
      JOIN public.players pl ON tp2.player_id = pl.id
      WHERE tp2.trip_id = trip_id AND pl.user_id = auth.uid()
    )
  );

-- Only admins can insert/update/delete membership
CREATE POLICY "TripPlayers: admins can manage"
  ON public.trip_players FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');
