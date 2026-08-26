-- Mr. Bonsai sync setup — run once in the Supabase SQL Editor.
-- Creates the state table, the photo bucket and row-level security so
-- every user can only ever touch their own data.

-- Collection state: one row per user holding the whole collection as JSON
create table if not exists public.collection_state (
    user_id uuid primary key references auth.users (id) on delete cascade,
    data jsonb not null,
    updated_at timestamptz not null default now()
);

alter table public.collection_state enable row level security;

drop policy if exists "own state" on public.collection_state;
create policy "own state" on public.collection_state
    for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Photo storage: private bucket, files live under <user_id>/<photo_id>.jpg
insert into storage.buckets (id, name, public)
values ('photos', 'photos', false)
on conflict (id) do nothing;

drop policy if exists "own photos select" on storage.objects;
create policy "own photos select" on storage.objects
    for select using (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "own photos insert" on storage.objects;
create policy "own photos insert" on storage.objects
    for insert with check (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "own photos update" on storage.objects;
create policy "own photos update" on storage.objects
    for update using (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "own photos delete" on storage.objects;
create policy "own photos delete" on storage.objects
    for delete using (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);
