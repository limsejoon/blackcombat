-- ============================================
-- BlackBombat Database Schema
-- Supabase Dashboard > SQL Editor 에서 실행
-- ============================================

-- tournaments
create table if not exists tournaments (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  starts_at   timestamptz,
  ends_at     timestamptz,
  status      text not null default 'upcoming'
                check (status in ('upcoming', 'ongoing', 'finished')),
  created_at  timestamptz not null default now()
);

-- players
create table if not exists players (
  id            uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  name          text not null,
  nickname      text,
  image_url     text,
  created_at    timestamptz not null default now()
);

-- donations
create table if not exists donations (
  id             uuid primary key default gen_random_uuid(),
  tournament_id  uuid not null references tournaments(id) on delete cascade,
  player_id      uuid not null references players(id) on delete cascade,
  donor_id       uuid not null references auth.users(id),
  donor_nickname text not null,
  amount         integer not null check (amount in (1000, 5000, 10000, 50000)),
  message        text not null check (char_length(message) <= 100),
  is_hidden      boolean not null default false,
  payment_key    text,
  order_id       text not null unique,
  created_at     timestamptz not null default now()
);

-- ============================================
-- 인덱스
-- ============================================
create index if not exists donations_tournament_id_idx
  on donations(tournament_id, created_at desc);

create index if not exists players_tournament_id_idx
  on players(tournament_id);

-- ============================================
-- RLS 활성화
-- ============================================
alter table tournaments enable row level security;
alter table players     enable row level security;
alter table donations   enable row level security;

-- ============================================
-- RLS 정책 — tournaments
-- ============================================
create policy "tournaments: 누구나 읽기"
  on tournaments for select
  using (true);

create policy "tournaments: 관리자만 쓰기"
  on tournaments for all
  using (auth.role() = 'service_role');

-- ============================================
-- RLS 정책 — players
-- ============================================
create policy "players: 누구나 읽기"
  on players for select
  using (true);

create policy "players: 관리자만 쓰기"
  on players for all
  using (auth.role() = 'service_role');

-- ============================================
-- RLS 정책 — donations
-- ============================================
-- 일반 사용자: is_hidden=false만 조회
create policy "donations: 공개 읽기"
  on donations for select
  using (is_hidden = false);

-- INSERT는 서버(service_role)에서만
create policy "donations: 서버만 삽입"
  on donations for insert
  with check (auth.role() = 'service_role');

-- is_hidden 수정은 서버(service_role)에서만
create policy "donations: 서버만 수정"
  on donations for update
  using (auth.role() = 'service_role');

-- ============================================
-- 샘플 데이터 (개발용)
-- ============================================
insert into tournaments (title, description, status, starts_at) values
  ('2026 코리아 오픈 격투기 토너먼트', '서울 KSPO돔에서 열리는 국내 최대 격투기 대회', 'ongoing', now())
on conflict do nothing;
