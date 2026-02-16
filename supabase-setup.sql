-- ============================================
-- Valentine Wish App - Supabase FINAL FIX
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop old table
drop table if exists public.wishes;

-- Recreate table
create table public.wishes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid default auth.uid(),
  wish_name text unique not null,
  to_name text not null,
  from_name text not null,
  message text not null,
  template_id integer not null default 1,
  image_url text default '',
  created_at timestamp with time zone default now()
);

-- DISABLE Row Level Security completely
-- This is fine for a personal Valentine gift app
alter table public.wishes disable row level security;

-- Grant full access
grant all on public.wishes to anon, authenticated;
