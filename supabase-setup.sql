-- ============================================
-- Valentine Wish App - Supabase Database Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create the wishes table
create table public.wishes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  wish_name text unique not null,
  to_name text not null,
  from_name text not null,
  message text not null,
  template_id integer not null default 1,
  image_url text default '',
  created_at timestamp with time zone default now()
);

-- 2. Enable Row Level Security
alter table public.wishes enable row level security;

-- 3. Policy: Anyone can read wishes (needed for wish viewing by name)
create policy "Wishes are publicly viewable"
  on public.wishes for select
  using (true);

-- 4. Policy: Authenticated users can insert their own wishes
create policy "Users can create their own wishes"
  on public.wishes for insert
  with check (auth.uid() = user_id);

-- 5. Policy: Users can update their own wishes
create policy "Users can update their own wishes"
  on public.wishes for update
  using (auth.uid() = user_id);

-- 6. Policy: Users can delete their own wishes
create policy "Users can delete their own wishes"
  on public.wishes for delete
  using (auth.uid() = user_id);

-- ============================================
-- Storage Setup (do this in Supabase Dashboard)
-- ============================================
-- 1. Go to Storage > Create new bucket
-- 2. Name: "wish-images"
-- 3. Set to PUBLIC bucket
-- 4. Add policy: Allow anyone to read (SELECT)
-- 5. Add policy: Allow authenticated users to upload (INSERT)
