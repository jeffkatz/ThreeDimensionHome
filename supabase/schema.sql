-- Enable PostGIS if available (optional, but good for real geospatial)
-- create extension if not exists postgis;

-- 1. Villages Table
create table public.villages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  coordinates jsonb not null, -- Stores { "lat": number, "lng": number }
  history_text text,
  chief_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Businesses Table
create table public.businesses (
  id uuid default gen_random_uuid() primary key,
  village_id uuid references public.villages(id) on delete cascade not null,
  business_name text not null,
  category text not null,
  contact_details text,
  website_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Schools Table
create table public.schools (
  id uuid default gen_random_uuid() primary key,
  village_id uuid references public.villages(id) on delete cascade not null,
  school_name text not null,
  type text check (type in ('Primary', 'High', 'Secondary', 'Combined')),
  student_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. News Table
create table public.news (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  image_url text,
  category text check (category in ('Culture', 'News', 'Alerts')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Row Level Security (RLS) Policies (Basic Read Access)
alter table public.villages enable row level security;
create policy "Public villages are viewable by everyone" on public.villages for select using (true);

alter table public.businesses enable row level security;
create policy "Public businesses are viewable by everyone" on public.businesses for select using (true);

alter table public.schools enable row level security;
create policy "Public schools are viewable by everyone" on public.schools for select using (true);

alter table public.news enable row level security;
create policy "Public news is viewable by everyone" on public.news for select using (true);
