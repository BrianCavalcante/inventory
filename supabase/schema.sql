-- Execute este script no SQL Editor do seu projeto Supabase.
create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  category text not null check (char_length(trim(category)) > 0),
  manufacturer text,
  model text,
  quantity integer not null default 0 check (quantity >= 0),
  price numeric(12,2) not null default 0 check (price >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists equipment_user_id_idx on public.equipment(user_id);
alter table public.equipment enable row level security;

-- Recria políticas com nomes estáveis para permitir reexecutar o script.
drop policy if exists "Users can view own equipment" on public.equipment;
drop policy if exists "Users can insert own equipment" on public.equipment;
drop policy if exists "Users can update own equipment" on public.equipment;
drop policy if exists "Users can delete own equipment" on public.equipment;

create policy "Users can view own equipment" on public.equipment
  for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own equipment" on public.equipment
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own equipment" on public.equipment
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own equipment" on public.equipment
  for delete to authenticated using (auth.uid() = user_id);

grant select, insert, update, delete on public.equipment to authenticated;
