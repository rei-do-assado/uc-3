create extension if not exists pgcrypto;

create table if not exists public.ranking_rei_sabor (
  id uuid primary key default gen_random_uuid(),
  sessao_id text not null default gen_random_uuid()::text,
  jogador text not null check (char_length(trim(jogador)) between 2 and 40),
  turma text check (turma is null or char_length(trim(turma)) between 1 and 40),
  total_pontos integer not null check (total_pontos between 0 and 5000),
  percentual_medio integer not null check (percentual_medio between 0 and 100),
  total_tentativas integer not null check (total_tentativas between 0 and 100),
  total_erros integer not null check (total_erros between 0 and 100),
  bonus_todos_jogos integer not null default 0 check (bonus_todos_jogos between 0 and 500),
  tipo_armazem_pontos integer not null default 0 check (tipo_armazem_pontos between 0 and 1500),
  capacidade_pontos integer not null default 0 check (capacidade_pontos between 0 and 1500),
  pallets_pontos integer not null default 0 check (pallets_pontos between 0 and 1500),
  jogos jsonb not null default '{}'::jsonb check (jsonb_typeof(jogos) = 'object' and pg_column_size(jogos) <= 20000),
  atualizado_em_local timestamptz,
  criado_em timestamptz not null default now()
);

alter table public.ranking_rei_sabor add column if not exists sessao_id text default gen_random_uuid()::text;
alter table public.ranking_rei_sabor add column if not exists bonus_todos_jogos integer not null default 0;
alter table public.ranking_rei_sabor add column if not exists tipo_armazem_pontos integer not null default 0;
alter table public.ranking_rei_sabor add column if not exists capacidade_pontos integer not null default 0;
alter table public.ranking_rei_sabor add column if not exists pallets_pontos integer not null default 0;

alter table public.ranking_rei_sabor enable row level security;

drop policy if exists "ranking_rei_sabor_select_publico" on public.ranking_rei_sabor;
drop policy if exists "ranking_rei_sabor_insert_publico" on public.ranking_rei_sabor;

create policy "ranking_rei_sabor_select_publico"
on public.ranking_rei_sabor
for select
to anon, authenticated
using (true);

create policy "ranking_rei_sabor_insert_publico"
on public.ranking_rei_sabor
for insert
to anon, authenticated
with check (
  char_length(trim(jogador)) between 2 and 40
  and total_pontos between 0 and 5000
  and percentual_medio between 0 and 100
  and total_tentativas between 0 and 100
  and total_erros between 0 and 100
  and bonus_todos_jogos between 0 and 500
  and tipo_armazem_pontos between 0 and 1500
  and capacidade_pontos between 0 and 1500
  and pallets_pontos between 0 and 1500
  and jsonb_typeof(jogos) = 'object'
  and pg_column_size(jogos) <= 20000
);

grant usage on schema public to anon, authenticated;
grant select, insert on table public.ranking_rei_sabor to anon, authenticated;

drop index if exists public.ranking_rei_sabor_placar_idx;

create index if not exists ranking_rei_sabor_placar_idx
on public.ranking_rei_sabor (total_pontos desc, percentual_medio desc, criado_em desc);

create index if not exists ranking_rei_sabor_sessao_idx
on public.ranking_rei_sabor (sessao_id, criado_em desc);
