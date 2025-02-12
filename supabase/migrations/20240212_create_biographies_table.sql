-- Create biographies table
create table if not exists public.biographies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name_and_role text not null,
  company_name text not null,
  niche text not null,
  help_description text not null,
  services text not null,
  experience text not null,
  achievements text not null,
  recognition text,
  differential text not null,
  best_clients text not null,
  preferred_clients text not null,
  avoid_clients text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create RLS policies
alter table public.biographies enable row level security;

create policy "Users can view their own biography"
  on public.biographies for select
  using (auth.uid() = user_id);

create policy "Users can insert their own biography"
  on public.biographies for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own biography"
  on public.biographies for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create indexes
create index biographies_user_id_idx on public.biographies(user_id);
