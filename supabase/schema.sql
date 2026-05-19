create extension if not exists pgcrypto;

create table if not exists public.parent_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.child_profiles (
  id uuid primary key default gen_random_uuid(),
  parent_user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) <= 30),
  age_group text not null check (age_group in ('age_6_8','age_9_12','other')),
  avatar_id text,
  pin_hash text,
  currency_label text not null default '円' check (currency_label in ('円','ポイント')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  child_profile_id uuid not null unique references public.child_profiles(id) on delete cascade,
  parent_user_id uuid not null references auth.users(id) on delete cascade,
  balance numeric(12,2) not null default 0 check (balance >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wish_items (
  id uuid primary key default gen_random_uuid(),
  parent_user_id uuid not null references auth.users(id) on delete cascade,
  child_profile_id uuid not null references public.child_profiles(id) on delete cascade,
  title text not null check (char_length(title) <= 50),
  price numeric(12,2) not null check (price >= 0),
  category text not null,
  reason text check (char_length(reason) <= 200),
  found_place text,
  priority integer check (priority between 1 and 5),
  desire_level integer check (desire_level between 1 and 5),
  image_url text,
  status text not null default 'draft' check (status in ('draft','checking','consulting','approved','wait','discuss','saving','rejected','purchased','archived')),
  approved_at timestamptz,
  purchased_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  parent_user_id uuid not null references auth.users(id) on delete cascade,
  child_profile_id uuid not null references public.child_profiles(id) on delete cascade,
  wallet_id uuid not null references public.wallets(id) on delete cascade,
  transaction_type text not null check (transaction_type in ('income','spending','adjustment','refund')),
  amount numeric(12,2) not null check (amount > 0),
  category text,
  memo text,
  related_wish_item_id uuid references public.wish_items(id) on delete set null,
  created_by_role text not null check (created_by_role in ('parent','child','system')),
  created_at timestamptz not null default now()
);

create table if not exists public.pre_purchase_checks (
  id uuid primary key default gen_random_uuid(),
  parent_user_id uuid not null references auth.users(id) on delete cascade,
  child_profile_id uuid not null references public.child_profiles(id) on delete cascade,
  wish_item_id uuid not null unique references public.wish_items(id) on delete cascade,
  need_or_want text check (need_or_want in ('need','want','unsure')),
  reason_text text check (char_length(reason_text) <= 200),
  already_have_similar boolean,
  wait_choice text check (wait_choice in ('wait_now','wait_1_day','wait_1_week')),
  expected_usage text check (expected_usage in ('often','sometimes','rarely','unknown')),
  child_payment_ratio integer check (child_payment_ratio between 0 and 100),
  remaining_balance_after_purchase numeric(12,2),
  answer_json jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  parent_user_id uuid not null references auth.users(id) on delete cascade,
  child_profile_id uuid not null references public.child_profiles(id) on delete cascade,
  wish_item_id uuid not null references public.wish_items(id) on delete cascade,
  status text not null default 'open' check (status in ('open','closed')),
  parent_decision text check (parent_decision in ('approved','wait','discuss','save','rejected')),
  parent_comment text check (char_length(parent_comment) <= 300),
  child_response text,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversation_guides (
  id uuid primary key default gen_random_uuid(),
  trigger_type text not null,
  category text,
  age_group text not null default 'all',
  title text not null,
  ng_example text,
  recommended_example text not null,
  question_examples jsonb,
  is_premium boolean not null default false,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_parent_profiles_updated_at on public.parent_profiles;
create trigger set_parent_profiles_updated_at before update on public.parent_profiles for each row execute function public.set_updated_at();
drop trigger if exists set_child_profiles_updated_at on public.child_profiles;
create trigger set_child_profiles_updated_at before update on public.child_profiles for each row execute function public.set_updated_at();
drop trigger if exists set_wallets_updated_at on public.wallets;
create trigger set_wallets_updated_at before update on public.wallets for each row execute function public.set_updated_at();
drop trigger if exists set_wish_items_updated_at on public.wish_items;
create trigger set_wish_items_updated_at before update on public.wish_items for each row execute function public.set_updated_at();
drop trigger if exists set_pre_purchase_checks_updated_at on public.pre_purchase_checks;
create trigger set_pre_purchase_checks_updated_at before update on public.pre_purchase_checks for each row execute function public.set_updated_at();
drop trigger if exists set_consultations_updated_at on public.consultations;
create trigger set_consultations_updated_at before update on public.consultations for each row execute function public.set_updated_at();
drop trigger if exists set_conversation_guides_updated_at on public.conversation_guides;
create trigger set_conversation_guides_updated_at before update on public.conversation_guides for each row execute function public.set_updated_at();

alter table public.parent_profiles enable row level security;
alter table public.child_profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.wish_items enable row level security;
alter table public.pre_purchase_checks enable row level security;
alter table public.consultations enable row level security;
alter table public.conversation_guides enable row level security;

create policy "own parent profile" on public.parent_profiles for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own child profiles" on public.child_profiles for all using (parent_user_id = auth.uid()) with check (parent_user_id = auth.uid());
create policy "own wallets" on public.wallets for all using (parent_user_id = auth.uid()) with check (parent_user_id = auth.uid());
create policy "own wallet transactions" on public.wallet_transactions for all using (parent_user_id = auth.uid()) with check (parent_user_id = auth.uid());
create policy "own wish items" on public.wish_items for all using (parent_user_id = auth.uid()) with check (parent_user_id = auth.uid());
create policy "own pre purchase checks" on public.pre_purchase_checks for all using (parent_user_id = auth.uid()) with check (parent_user_id = auth.uid());
create policy "own consultations" on public.consultations for all using (parent_user_id = auth.uid()) with check (parent_user_id = auth.uid());
create policy "active guides readable" on public.conversation_guides for select using (auth.uid() is not null and is_active = true);

insert into public.conversation_guides (trigger_type, category, age_group, title, ng_example, recommended_example, question_examples, sort_order)
values
  ('game_charge', 'game', 'all', 'ゲーム課金の相談', 'ダメ。必要ないでしょ。', '「何日くらい楽しめそう？」と聞いてみましょう。', '["何回くらい使いそう？","来週もまだほしいと思う？"]', 10),
  ('gacha', 'gacha', 'all', 'ガチャの相談', 'もったいないからダメ。', '「出なかった時も納得できそう？」と一緒に考えてみましょう。', '["何が出たらうれしい？","何回までにする？"]', 20),
  ('low_balance', null, 'all', '残高が少ない時', 'お金がないから無理。', '「買った後に残るお金で困らないかな？」と確認しましょう。', '["買った後はいくら残る？","次にほしいものはある？"]', 30)
on conflict do nothing;
